import { describe, it, expect, beforeEach, vi } from 'vitest'
import { OnboardingUseCase } from '../../../../src/application/use-cases/onboarding/OnboardingUseCase'
import { UserNotFoundError } from '../../../../src/application/errors/UseCaseError'
import { WorkoutGoal } from '../../../../src/domain/value-objects/WorkoutGoal'
import { User } from '../../../../src/domain/entities/User'
import { IUserRepository } from '../../../../src/domain/repositories/IUserRepository'
import { IWorkoutPlanRepository } from '../../../../src/domain/repositories/IWorkoutPlanRepository'

function buildMockUserRepository(overrides: Partial<IUserRepository> = {}): IUserRepository {
  return {
    save: vi.fn(async () => {}),
    findById: vi.fn(async () => buildFakeUser()),
    findByEmail: vi.fn(async () => null),
    delete: vi.fn(async () => {}),
    update: vi.fn(async () => {}),
    ...overrides,
  }
}

function buildMockWorkoutPlanRepository(
  overrides: Partial<IWorkoutPlanRepository> = {},
): IWorkoutPlanRepository {
  return {
    save: vi.fn(async () => {}),
    findById: vi.fn(async () => null),
    findByUserId: vi.fn(async () => null),
    ...overrides,
  }
}

function buildFakeUser(): User {
  return User.create({
    id: 'user-1',
    email: 'user@example.com',
    passwordHash: 'hashed',
    name: 'Test User',
  })
}

describe('OnboardingUseCase', () => {
  let mockUserRepository: IUserRepository
  let mockWorkoutPlanRepository: IWorkoutPlanRepository
  let useCase: OnboardingUseCase

  beforeEach(() => {
    mockUserRepository = buildMockUserRepository()
    mockWorkoutPlanRepository = buildMockWorkoutPlanRepository()
    useCase = new OnboardingUseCase(mockUserRepository, mockWorkoutPlanRepository)
  })

  it('should generate a plan with 3 exercises for a valid user', async () => {
    const result = await useCase.execute('user-1', { goal: WorkoutGoal.MUSCLE_GAIN })

    expect(result.planId).toBeDefined()
    expect(result.exercises).toHaveLength(3)
    expect(mockWorkoutPlanRepository.save).toHaveBeenCalledOnce()
  })

  it('should use higher reps and shorter rest for fat_loss goal', async () => {
    const result = await useCase.execute('user-1', { goal: WorkoutGoal.FAT_LOSS })

    expect(result.exercises[0].targetReps).toBe(15)
    expect(result.exercises[0].restBetweenSetsSecs).toBe(45)
  })

  it('should use lower reps and longer rest for muscle_gain goal', async () => {
    const result = await useCase.execute('user-1', { goal: WorkoutGoal.MUSCLE_GAIN })

    expect(result.exercises[0].targetReps).toBe(8)
    expect(result.exercises[0].restBetweenSetsSecs).toBe(90)
  })

  it('should throw UserNotFoundError if user does not exist', async () => {
    mockUserRepository = buildMockUserRepository({ findById: vi.fn(async () => null) })
    useCase = new OnboardingUseCase(mockUserRepository, mockWorkoutPlanRepository)

    await expect(
      useCase.execute('nonexistent-user', { goal: WorkoutGoal.MUSCLE_GAIN }),
    ).rejects.toThrow(UserNotFoundError)

    expect(mockWorkoutPlanRepository.save).not.toHaveBeenCalled()
  })
})