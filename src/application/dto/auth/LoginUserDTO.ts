import { z } from 'zod'

/**
 * LoginUserDTO
 *
 * Validates input to POST /auth/login.
 * Requires only email and password.
 */
export const loginUserSchema = z.object({
  email: z
    .string('Email is required')
    .email('Must be a valid email address')
    .trim()
    .toLowerCase(),

  password: z
    .string('Password is required')
    .min(1, 'Password is required'),
})

export type LoginUserDTO = z.infer<typeof loginUserSchema>

export function validateLoginUserInput(
  data: unknown,
): { success: true; data: LoginUserDTO } | { success: false; error: string } {
  const result = loginUserSchema.safeParse(data)
  if (result.success) return { success: true, data: result.data }
  return { success: false, error: result.error.message }
}