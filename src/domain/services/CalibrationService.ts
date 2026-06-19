/**
 * CalibrationService
 *
 * Domain service implementing the Epley formula to estimate a user's
 * one-rep max (1RM) from a single logged set.
 *
 * Formula:
 *   1RM = weight × (1 + reps / 30)
 *
 * The Epley formula loses accuracy at high rep counts (above ~12), since
 * it's calibrated against near-maximal effort sets. This service caps
 * reps used in the calculation to keep estimates within a reasonable
 * confidence range.
 */
export class CalibrationService {
  private readonly MAX_RELIABLE_REPS = 12

  /**
   * Estimate one-rep max using the Epley formula.
   *
   * @param weight — weight lifted, in kg
   * @param reps — repetitions completed at that weight
   * @returns estimated 1RM, rounded to 1 decimal place
   */
  estimateOneRepMax(weight: number, reps: number): number {
    if (weight <= 0) {
      throw new Error('Weight must be greater than zero.')
    }

    if (reps <= 0 || !Number.isInteger(reps)) {
      throw new Error('Reps must be a positive integer.')
    }

    const reliableReps = Math.min(reps, this.MAX_RELIABLE_REPS)

    const oneRepMax = weight * (1 + reliableReps / 30)

    return Math.round(oneRepMax * 10) / 10
  }

  /**
   * Whether the rep count used falls outside the formula's reliable range.
   * Useful for surfacing a warning to the user without blocking the calculation.
   */
  isOutsideReliableRange(reps: number): boolean {
    return reps > this.MAX_RELIABLE_REPS
  }

  /**
   * Suggests a working weight for a target rep range, given a known 1RM.
   * Inverse of the Epley formula.
   */
  suggestWeightForReps(oneRepMax: number, targetReps: number): number {
    if (oneRepMax <= 0) {
      throw new Error('One-rep max must be greater than zero.')
    }

    if (targetReps <= 0 || !Number.isInteger(targetReps)) {
      throw new Error('Target reps must be a positive integer.')
    }

    const reliableReps = Math.min(targetReps, this.MAX_RELIABLE_REPS)

    const suggestedWeight = oneRepMax / (1 + reliableReps / 30)

    return Math.round(suggestedWeight * 10) / 10
  }
}