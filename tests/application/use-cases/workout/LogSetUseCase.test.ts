import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LogSetUseCase } from '../../../../src/application/use-cases/workout/LogSetUseCase'
import { InvalidInputError } from '../../../../src/application/errors/UseCaseError'
import { CalibrationService } from '../../../../src/domain/services/CalibrationService'
import { Session } from '../../../../src/domain/entities/Session'
import { ISessionRepository } from '../../../../src/domain/repositories/ISessionRepository'

function buildMockSessionRepository(overrides: Partial<ISessionRepository> = {}): ISessionRepository {
  return {
    save: vi.fn(async () => {}),
    findById: vi.fn(async () => buildFakeSession()),
    findActiveByUserId: vi.fn(async () => null),
    ...overrides,
  }
}

function buildFakeSession(): Session {
  return Session.start({ id: 'session-1', userId: 'user-1', workoutPlanId: 'plan-1' })
}

describe('LogSetUseCase', () => {
  let mockSessionRepository: ISessionRepository
  let calibrationService: CalibrationService
  let useCase: LogSetUseCase

  beforeEach(() => {
    mockSessionRepository = buildMockSessionRepository()
    calibrationService = new CalibrationService()
    useCase = new LogSetUseCase(mockSessionRepository, calibrationService)
  })

  it('should log a set and return the estimated 1RM', async () => {
    const result = await useCase.execute('session-1', { exerciseId: 'ex-1', weight: 80, reps: 8 })

    expect(result.estimatedOneRepMax).toBeCloseTo(101.3, 1)
    expect(result.warning).toBeNull()
    expect(mockSessionRepository.save).toHaveBeenCalledOnce()
  })

  it('should include a warning when reps exceed the reliable range', async () => {
    const result = await useCase.execute('session-1', { exerciseId: 'ex-1', weight: 50, reps: 20 })

    expect(result.warning).not.toBeNull()
  })

  it('should throw InvalidInputError if session does not exist', async () => {
    mockSessionRepository = buildMockSessionRepository({ findById: vi.fn(async () => null) })
    useCase = new LogSetUseCase(mockSessionRepository, calibrationService)

    await expect(
      useCase.execute('nonexistent-session', { exerciseId: 'ex-1', weight: 80, reps: 8 }),
    ).rejects.toThrow(InvalidInputError)
  })

  it('should throw if the session is already completed', async () => {
    const completedSession = buildFakeSession()
      .logSet({ exerciseId: 'ex-1', weight: 80, reps: 8, estimatedOneRepMax: 101.3 })
      .complete()

    mockSessionRepository = buildMockSessionRepository({
      findById: vi.fn(async () => completedSession),
    })
    useCase = new LogSetUseCase(mockSessionRepository, calibrationService)

    await expect(
      useCase.execute('session-1', { exerciseId: 'ex-1', weight: 80, reps: 8 }),
    ).rejects.toThrow()
  })
})