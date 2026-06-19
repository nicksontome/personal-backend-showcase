import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RegisterUserUseCase } from '../../../../src/application/use-cases/auth/RegisterUserUseCase'
import { EmailAlreadyRegisteredError } from '../../../../src/application/errors/UseCaseError'
import { User } from '../../../../src/domain/entities/User'
import { IUserRepository } from '../../../../src/domain/repositories/IUserRepository'

function buildMockUserRepository(overrides: Partial<IUserRepository> = {}): IUserRepository {
  return {
    save: vi.fn(async () => {}),
    findById: vi.fn(async () => null),
    findByEmail: vi.fn(async () => null),
    delete: vi.fn(async () => {}),
    update: vi.fn(async () => {}),
    ...overrides,
  }
}

function buildFakeUser(overrides: Partial<{ id: string; email: string; name: string }> = {}): User {
  return User.create({
    id: overrides.id ?? 'user-1',
    email: overrides.email ?? 'existing@example.com',
    passwordHash: 'hashed-password',
    name: overrides.name ?? 'Existing User',
  })
}

describe('RegisterUserUseCase', () => {
  let mockUserRepository: IUserRepository
  let useCase: RegisterUserUseCase

  beforeEach(() => {
    mockUserRepository = buildMockUserRepository()
    useCase = new RegisterUserUseCase(mockUserRepository)
  })

  it('should register a new user successfully', async () => {
    const result = await useCase.execute({
      email: 'new@example.com',
      password: 'password123',
      name: 'New User',
    })

    expect(result.userId).toBeDefined()
    expect(typeof result.userId).toBe('string')
    expect(mockUserRepository.save).toHaveBeenCalledOnce()
  })

  it('should throw EmailAlreadyRegisteredError if email is already registered', async () => {
    mockUserRepository = buildMockUserRepository({
      findByEmail: vi.fn(async () => buildFakeUser({ email: 'existing@example.com' })),
    })
    useCase = new RegisterUserUseCase(mockUserRepository)

    await expect(
      useCase.execute({
        email: 'existing@example.com',
        password: 'password123',
        name: 'Duplicate User',
      }),
    ).rejects.toThrow(EmailAlreadyRegisteredError)

    expect(mockUserRepository.save).not.toHaveBeenCalled()
  })

  it('should hash the password before saving', async () => {
    await useCase.execute({
      email: 'new@example.com',
      password: 'plaintext-password',
      name: 'New User',
    })

    const savedUser = vi.mocked(mockUserRepository.save).mock.calls[0][0]
    expect(savedUser.passwordHash).not.toBe('plaintext-password')
    expect(savedUser.passwordHash.length).toBeGreaterThan(0)
  })

  it('should normalize email to lowercase', async () => {
    await useCase.execute({
      email: 'NEW@EXAMPLE.COM',
      password: 'password123',
      name: 'New User',
    })

    const savedUser = vi.mocked(mockUserRepository.save).mock.calls[0][0]
    expect(savedUser.email).toBe('new@example.com')
  })
})