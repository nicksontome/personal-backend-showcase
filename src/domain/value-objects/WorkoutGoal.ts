/**
 * WorkoutGoal
 *
 * Represents the two supported training goals in this showcase.
 * Determines rep ranges and rest periods for the generated plan.
 */
export enum WorkoutGoal {
  MUSCLE_GAIN = 'muscle_gain',
  FAT_LOSS = 'fat_loss',
}

export function isValidWorkoutGoal(value: unknown): value is WorkoutGoal {
  return value === WorkoutGoal.MUSCLE_GAIN || value === WorkoutGoal.FAT_LOSS
}