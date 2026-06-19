import { Session } from '../../domain/entities/Session'
import { ISessionRepository } from '../../domain/repositories/ISessionRepository'

/**
 * In-memory implementation of ISessionRepository.
 *
 * Data persists only during the server session.
 */
export class InMemorySessionRepository implements ISessionRepository {
  private sessions: Map<string, Session> = new Map()

  async save(session: Session): Promise<void> {
    this.sessions.set(session.id, session)
  }

  async findById(id: string): Promise<Session | null> {
    return this.sessions.get(id) ?? null
  }

  async findActiveByUserId(userId: string): Promise<Session | null> {
    for (const session of this.sessions.values()) {
      if (session.userId === userId && session.status === 'in_progress') {
        return session
      }
    }
    return null
  }
}