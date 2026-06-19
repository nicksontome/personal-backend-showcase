import { describe, it, expect, beforeEach, vi } from 'vitest'
import bcrypt from 'bcrypt'
import { LoginUserUseCase } from '../../../../src/application/use-cases/auth/LoginUserUseCase'
import { IncorrectPasswordError, UserNotFoundError } from '../../../../src/application/errors/UseCaseError'
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

async function buildFakeUserWithPassword(plainPassword: string): Promise<User> {
  const passwordHash = await bcrypt.hash(plainPassword, 10)
  return User.create({
    id: 'user-1',
    email: 'user@example.com',
    passwordHash,
    name: 'Test User',
  })
}

describe('LoginUserUseCase', () => {
  const JWT_SECRET = 'test-secret'

  it('should log in successfully with correct credentials', async () => {
    const fakeUser = await buildFakeUserWithPassword('correct-password')
    const mockUserRepository = buildMockUserRepository({
      findByEmail: vi.fn(async () => fakeUser),
    })
    const useCase = new LoginUserUseCase(mockUserRepository, JWT_SECRET)

    const result = await useCase.execute({
      email: 'user@example.com',
      password: 'correct-password',
    })

    expect(result.token).toBeDefined()
    expect(result.userId).toBe('user-1')
  })

  it('should throw UserNotFoundError if email does not exist', async () => {
    const mockUserRepository = buildMockUserRepository({
      findByEmail: vi.fn(async () => null),
    })
    const useCase = new LoginUserUseCase(mockUserRepository, JWT_SECRET)

    await expect(
      useCase.execute({ email: 'nonexistent@example.com', password: 'any-password' }),
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should throw IncorrectPasswordError if password does not match', async () => {
    const fakeUser = await buildFakeUserWithPassword('correct-password')
    const mockUserRepository = buildMockUserRepository({
      findByEmail: vi.fn(async () => fakeUser),
    })
    const useCase = new LoginUserUseCase(mockUserRepository, JWT_SECRET)

    await expect(
      useCase.execute({ email: 'user@example.com', password: 'wrong-password' }),
    ).rejects.toThrow(IncorrectPasswordError)
  })

  it('should generate a token containing the userId', async () => {
    const fakeUser = await buildFakeUserWithPassword('correct-password')
    const mockUserRepository = buildMockUserRepository({
      findByEmail: vi.fn(async () => fakeUser),
    })
    const useCase = new LoginUserUseCase(mockUserRepository, JWT_SECRET)

    const result = await useCase.execute({
      email: 'user@example.com',
      password: 'correct-password',
    })

    const [, payloadBase64] = result.token.split('.')
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString())
    expect(payload.userId).toBe('user-1')
  })
})