import { describe, it, expect, beforeEach, vi } from 'vitest'
import { StartSessionUseCase } from '../../../../src/application/use-cases/workout/StartSessionUseCase'
import { InvalidInputError } from '../../../../src/application/errors/UseCaseError'
import { WorkoutGoal } from '../../../../src/domain/value-objects/WorkoutGoal'
import { WorkoutPlan } from '../../../../src/domain/entities/WorkoutPlan'
import { Session } from '../../../../src/domain/entities/Session'
import { ISessionRepository } from '../../../../src/domain/repositories/ISessionRepository'
import { IWorkoutPlanRepository } from '../../../../src/domain/repositories/IWorkoutPlanRepository'

function buildMockSessionRepository(overrides: Partial<ISessionRepository> = {}): ISessionRepository {
  return {
    save: vi.fn(async () => {}),
    findById: vi.fn(async () => null),
    findActiveByUserId: vi.fn(async () => null),
    ...overrides,
  }
}

function buildMockWorkoutPlanRepository(
  overrides: Partial<IWorkoutPlanRepository> = {},
): IWorkoutPlanRepository {
  return {
    save: vi.fn(async () => {}),
    findById: vi.fn(async () => null),
    findByUserId: vi.fn(async () => buildFakePlan()),
    ...overrides,
  }
}

function buildFakePlan(): WorkoutPlan {
  return WorkoutPlan.create({ id: 'plan-1', userId: 'user-1', goal: WorkoutGoal.MUSCLE_GAIN })
}

describe('StartSessionUseCase', () => {
  let mockSessionRepository: ISessionRepository
  let mockWorkoutPlanRepository: IWorkoutPlanRepository
  let useCase: StartSessionUseCase

  beforeEach(() => {
    mockSessionRepository = buildMockSessionRepository()
    mockWorkoutPlanRepository = buildMockWorkoutPlanRepository()
    useCase = new StartSessionUseCase(mockSessionRepository, mockWorkoutPlanRepository)
  })

  it('should start a session and return the planned exercises', async () => {
    const result = await useCase.execute('user-1')

    expect(result.sessionId).toBeDefined()
    expect(result.exercises).toHaveLength(3)
    expect(mockSessionRepository.save).toHaveBeenCalledOnce()
  })

  it('should throw InvalidInputError if user has no workout plan', async () => {
    mockWorkoutPlanRepository = buildMockWorkoutPlanRepository({
      findByUserId: vi.fn(async () => null),
    })
    useCase = new StartSessionUseCase(mockSessionRepository, mockWorkoutPlanRepository)

    await expect(useCase.execute('user-1')).rejects.toThrow(InvalidInputError)
  })

  it('should throw InvalidInputError if user already has an active session', async () => {
    const activeSession = Session.start({ id: 'session-1', userId: 'user-1', workoutPlanId: 'plan-1' })
    mockSessionRepository = buildMockSessionRepository({
      findActiveByUserId: vi.fn(async () => activeSession),
    })
    useCase = new StartSessionUseCase(mockSessionRepository, mockWorkoutPlanRepository)

    await expect(useCase.execute('user-1')).rejects.toThrow(InvalidInputError)
    expect(mockSessionRepository.save).not.toHaveBeenCalled()
  })
})