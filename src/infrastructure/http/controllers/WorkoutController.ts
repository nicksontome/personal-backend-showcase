import { Request, Response } from 'express'
import { StartSessionUseCase } from '../../../application/use-cases/workout/StartSessionUseCase'
import { LogSetUseCase } from '../../../application/use-cases/workout/LogSetUseCase'
import { FinishSessionUseCase } from '../../../application/use-cases/workout/FinishSessionUseCase'
import { validateLogSetInput } from '../../../application/dto/workout/LogSetDTO'
import { InvalidInputError } from '../../../application/errors/UseCaseError'

/**
 * WorkoutController
 *
 * HTTP layer for the workout session flow: start a session, log sets,
 * and finish the session to receive a 1RM-based summary.
 * All routes require authentication — userId is populated by auth.middleware.
 */
export class WorkoutController {
  constructor(
    private startSessionUseCase: StartSessionUseCase,
    private logSetUseCase: LogSetUseCase,
    private finishSessionUseCase: FinishSessionUseCase,
  ) {}

  async start(req: Request, res: Response): Promise<void> {
    const userId = req.userId as string

    try {
      const result = await this.startSessionUseCase.execute(userId)
      res.status(201).json(result)
    } catch (error) {
      if (error instanceof InvalidInputError) {
        res.status(400).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Internal server error.' })
    }
  }

  async logSet(req: Request, res: Response): Promise<void> {
    const sessionId = req.params.sessionId as string

    const validation = validateLogSetInput(req.body)
    if (!validation.success) {
      res.status(400).json({ error: validation.error })
      return
    }

    try {
      const result = await this.logSetUseCase.execute(sessionId, validation.data)
      res.status(200).json(result)
    } catch (error) {
      if (error instanceof InvalidInputError) {
        res.status(404).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Internal server error.' })
    }
  }

  async finish(req: Request, res: Response): Promise<void> {
    const sessionId = req.params.sessionId as string

    try {
      const result = await this.finishSessionUseCase.execute(sessionId)
      res.status(200).json(result)
    } catch (error) {
      if (error instanceof InvalidInputError) {
        res.status(404).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Internal server error.' })
    }
  }
}