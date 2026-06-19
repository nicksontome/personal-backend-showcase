import { z } from 'zod'

/**
 * OnboardingDTO
 *
 * Validates input to POST /onboarding.
 * Accepts the user's training goal, which determines the generated plan.
 */
export const onboardingSchema = z.object({
  goal: z.enum(['muscle_gain', 'fat_loss'], 'Goal must be either "muscle_gain" or "fat_loss"'),
})

export type OnboardingDTO = z.infer<typeof onboardingSchema>

export function validateOnboardingInput(
  data: unknown,
): { success: true; data: OnboardingDTO } | { success: false; error: string } {
  const result = onboardingSchema.safeParse(data)
  if (result.success) return { success: true, data: result.data }
  return { success: false, error: result.error.message }
}