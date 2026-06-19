import { Session } from '../entities/Session'

/**
 * Repository interface for Session persistence.
 */
export interface ISessionRepository {
  save(session: Session): Promise<void>

  findById(id: string): Promise<Session | null>

  findActiveByUserId(userId: string): Promise<Session | null>
}