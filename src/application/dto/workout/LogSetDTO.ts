import { z } from 'zod'

/**
 * LogSetDTO
 *
 * Validates input to POST /workout/:sessionId/log-set.
 */
export const logSetSchema = z.object({
  exerciseId: z
    .string('Exercise ID is required')
    .min(1, 'Exercise ID cannot be empty'),

  weight: z
    .number('Weight must be a number')
    .positive('Weight must be greater than zero'),

  reps: z
    .number('Reps must be a number')
    .int('Reps must be a whole number')
    .positive('Reps must be greater than zero'),
})

export type LogSetDTO = z.infer<typeof logSetSchema>

export function validateLogSetInput(
  data: unknown,
): { success: true; data: LogSetDTO } | { success: false; error: string } {
  const result = logSetSchema.safeParse(data)
  if (result.success) return { success: true, data: result.data }
  return { success: false, error: result.error.message }
}