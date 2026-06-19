import { User } from '../entities/User'

/**
 * Repository interface for User persistence.
 *
 * The domain and application layers depend only on this interface.
 * Concrete implementations (e.g., PrismaUserRepository) live in infrastructure.
 */
export interface IUserRepository {
  save(user: User): Promise<void>

  findById(id: string): Promise<User | null>

  findByEmail(email: string): Promise<User | null>

  delete(id: string): Promise<void>

  update(user: User): Promise<void>
}