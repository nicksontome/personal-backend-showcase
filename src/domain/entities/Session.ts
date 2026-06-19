export interface LoggedSet {
  exerciseId: string
  weight: number
  reps: number
  estimatedOneRepMax: number
}

export type SessionStatus = 'in_progress' | 'completed'

/**
 * Session Entity
 *
 * Represents a single workout session in progress or completed.
 * Tracks logged sets and their estimated 1RM per exercise.
 *
 * Immutable — state transitions (logSet, complete) return new instances.
 */
export class Session {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly workoutPlanId: string,
    public readonly status: SessionStatus,
    public readonly loggedSets: LoggedSet[],
    public readonly startedAt: Date,
    public readonly completedAt: Date | null,
  ) {}

  static start(input: { id: string; userId: string; workoutPlanId: string }): Session {
    return new Session(input.id, input.userId, input.workoutPlanId, 'in_progress', [], new Date(), null)
  }

  /**
   * Log a set for a given exercise within this session.
   * Throws if the session is already completed.
   */
  logSet(set: LoggedSet): Session {
    if (this.status === 'completed') {
      throw new Error('Cannot log a set on a completed session.')
    }

    return new Session(
      this.id,
      this.userId,
      this.workoutPlanId,
      this.status,
      [...this.loggedSets, set],
      this.startedAt,
      this.completedAt,
    )
  }

  /**
   * Mark the session as completed.
   * Throws if there are no logged sets — an empty session cannot be finished.
   */
  complete(): Session {
    if (this.loggedSets.length === 0) {
      throw new Error('Cannot complete a session with no logged sets.')
    }

    return new Session(
      this.id,
      this.userId,
      this.workoutPlanId,
      'completed',
      this.loggedSets,
      this.startedAt,
      new Date(),
    )
  }

  /**
   * Returns the best (highest) estimated 1RM per exercise logged in this session.
   * Used to build the "next time, lift this much" summary.
   */
  getBestOneRepMaxByExercise(): Record<string, number> {
    const best: Record<string, number> = {}

    for (const set of this.loggedSets) {
      const current = best[set.exerciseId] ?? 0
      if (set.estimatedOneRepMax > current) {
        best[set.exerciseId] = set.estimatedOneRepMax
      }
    }

    return best
  }
}