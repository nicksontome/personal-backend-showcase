import { z } from 'zod'

/**
 * RegisterUserDTO
 *
 * Validates input to POST /auth/register.
 * Ensures only valid data reaches the domain layer.
 */
export const registerUserSchema = z.object({
  email: z
    .string('Email is required')
    .email('Must be a valid email address')
    .trim()
    .toLowerCase(),

  password: z
    .string('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters'),

  name: z
    .string('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
})

export type RegisterUserDTO = z.infer<typeof registerUserSchema>

export function validateRegisterUserInput(
  data: unknown,
): { success: true; data: RegisterUserDTO } | { success: false; error: string } {
  const result = registerUserSchema.safeParse(data)
  if (result.success) return { success: true, data: result.data }
  return { success: false, error: result.error.message }
}