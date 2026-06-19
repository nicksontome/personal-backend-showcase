import { Request, Response } from 'express'
import { GenerateWorkoutPlanUseCase } from '../../../application/use-cases/onboarding/GenerateWorkoutPlanUseCase'
import { validateOnboardingInput } from '../../../application/dto/onboarding/OnboardingDTO'

/**
 * OnboardingController
 *
 * HTTP layer for the onboarding flow: user picks a goal, receives a
 * complete PPL workout plan in response. Protected by JWT auth.
 */
export class OnboardingController {
  constructor(private generateWorkoutPlanUseCase: GenerateWorkoutPlanUseCase) {}

  async complete(req: Request, res: Response): Promise<void> {
    const userId = req.userId as string

    const validation = validateOnboardingInput(req.body)
    if (!validation.success) {
      res.status(400).json({ error: validation.error })
      return
    }

    const result = await this.generateWorkoutPlanUseCase.execute(userId, validation.data)
    res.status(201).json(result)
  }
}