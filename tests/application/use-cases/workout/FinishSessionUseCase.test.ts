import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FinishSessionUseCase } from '../../../../src/application/use-cases/workout/FinishSessionUseCase'
import { InvalidInputError } from '../../../../src/application/errors/UseCaseError'
import { WorkoutGoal } from '../../../../src/domain/value-objects/WorkoutGoal'
import { WorkoutPlan } from '../../../../src/domain/entities/WorkoutPlan'
import { Session } from '../../../../src/domain/entities/Session'
import { ISessionRepository } from '../../../../src/domain/repositories/ISessionRepository'
import { IWorkoutPlanRepository } from '../../../../src/domain/repositories/IWorkoutPlanRepository'

function buildMockSessionRepository(overrides: Partial<ISessionRepository> = {}): ISessionRepository {
  return {
    save: vi.fn(async () => {}),
    findById: vi.fn(async () => buildFakeSessionWithLoggedSet()),
    findActiveByUserId: vi.fn(async () => null),
    ...overrides,
  }
}

function buildMockWorkoutPlanRepository(
  overrides: Partial<IWorkoutPlanRepository> = {},
): IWorkoutPlanRepository {
  return {
    save: vi.fn(async () => {}),
    findById: vi.fn(async () => buildFakePlan()),
    findByUserId: vi.fn(async () => null),
    ...overrides,
  }
}

function buildFakePlan(): WorkoutPlan {
  return WorkoutPlan.create({ id: 'plan-1', userId: 'user-1', goal: WorkoutGoal.MUSCLE_GAIN })
}

function buildFakeSessionWithLoggedSet(): Session {
  return Session.start({ id: 'session-1', userId: 'user-1', workoutPlanId: 'plan-1' }).logSet({
    exerciseId: 'ex-1',
    weight: 80,
    reps: 8,
    estimatedOneRepMax: 101.3,
  })
}

describe('FinishSessionUseCase', () => {
  let mockSessionRepository: ISessionRepository
  let mockWorkoutPlanRepository: IWorkoutPlanRepository
  let useCase: FinishSessionUseCase

  beforeEach(() => {
    mockSessionRepository = buildMockSessionRepository()
    mockWorkoutPlanRepository = buildMockWorkoutPlanRepository()
    useCase = new FinishSessionUseCase(mockSessionRepository, mockWorkoutPlanRepository)
  })

  it('should complete the session and return a summary with suggested weights', async () => {
    const result = await useCase.execute('session-1')

    expect(result.sessionId).toBe('session-1')
    expect(result.summary).toHaveLength(1)
    expect(result.summary[0].exerciseId).toBe('ex-1')
    expect(result.summary[0].name).toBe('Bench Press')
    expect(result.summary[0].bestEstimatedOneRepMax).toBe(101.3)
    expect(result.summary[0].suggestedNextWeight).toBeGreaterThan(0)
    expect(mockSessionRepository.save).toHaveBeenCalledOnce()
  })

  it('should throw InvalidInputError if session does not exist', async () => {
    mockSessionRepository = buildMockSessionRepository({ findById: vi.fn(async () => null) })
    useCase = new FinishSessionUseCase(mockSessionRepository, mockWorkoutPlanRepository)

    await expect(useCase.execute('nonexistent-session')).rejects.toThrow(InvalidInputError)
  })

  it('should throw if the session has no logged sets', async () => {
    const emptySession = Session.start({ id: 'session-1', userId: 'user-1', workoutPlanId: 'plan-1' })
    mockSessionRepository = buildMockSessionRepository({
      findById: vi.fn(async () => emptySession),
    })
    useCase = new FinishSessionUseCase(mockSessionRepository, mockWorkoutPlanRepository)

    await expect(useCase.execute('session-1')).rejects.toThrow()
  })
})