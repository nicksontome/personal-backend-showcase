import { User } from '../../domain/entities/User'
import { IUserRepository } from '../../domain/repositories/IUserRepository'

/**
 * In-memory implementation of IUserRepository.
 *
 * Exists so this showcase can run as a live demo without requiring a real
 * database. In the production project, this interface is implemented by
 * a PrismaUserRepository backed by PostgreSQL — swapping one for the other
 * requires zero changes to any use case.
 *
 * Data is not persisted across server restarts.
 */
export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map()

  async save(user: User): Promise<void> {
    this.users.set(user.id, user)
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user
    }
    return null
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id)
  }

  async update(user: User): Promise<void> {
    this.users.set(user.id, user)
  }
}