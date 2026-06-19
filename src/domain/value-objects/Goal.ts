export type GoalType = 'muscle_gain' | 'fat_loss'

export interface GoalGuidelines {
  reps: number
  sets: number
  restSeconds: number
}

/**
 * Goal Value Object
 *
 * Represents the user's training objective and the evidence-based
 * training guidelines associated with it:
 *
 *   muscle_gain (hypertrophy) — 8-12 reps, 4 sets, 75s rest
 *     Moderate reps + higher volume (more sets) is the classic
 *     hypertrophy prescription (70-80% of 1RM).
 *
 *   fat_loss — 12-15 reps, 3 sets, 40s rest
 *     Higher reps with short rest keeps heart rate elevated and
 *     metabolic demand high, without needing maximal loads.
 */
export class Goal {
  private static readonly GUIDELINES: Record<GoalType, GoalGuidelines> = {
    muscle_gain: { reps: 10, sets: 4, restSeconds: 75 },
    fat_loss: { reps: 14, sets: 3, restSeconds: 40 },
  }

  private constructor(public readonly type: GoalType) {}

  static create(type: string): Goal {
    if (type !== 'muscle_gain' && type !== 'fat_loss') {
      throw new Error(`Invalid goal "${type}". Must be "muscle_gain" or "fat_loss".`)
    }
    return new Goal(type)
  }

  getGuidelines(): GoalGuidelines {
    return Goal.GUIDELINES[this.type]
  }
}