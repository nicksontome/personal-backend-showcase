import { ISessionRepository } from '../../../domain/repositories/ISessionRepository'
import { CalibrationService } from '../../../domain/services/CalibrationService'
import { LogSetDTO } from '../../dto/workout/LogSetDTO'
import { InvalidInputError } from '../../errors/UseCaseError'

export interface LogSetOutput {
  exerciseId: string
  weight: number
  reps: number
  estimatedOneRepMax: number
  warning: string | null
}

/**
 * LogSetUseCase
 *
 * Logs a single set (weight × reps) against an active session, and
 * calculates the estimated one-rep max for that exercise via the
 * Epley formula (CalibrationService).
 */
export class LogSetUseCase {
  constructor(
    private sessionRepository: ISessionRepository,
    private calibrationService: CalibrationService,
  ) {}

  async execute(sessionId: string, input: LogSetDTO): Promise<LogSetOutput> {
    const session = await this.sessionRepository.findById(sessionId)

    if (!session) {
      throw new InvalidInputError(`Session "${sessionId}" not found.`)
    }

    const estimatedOneRepMax = this.calibrationService.estimateOneRepMax(input.weight, input.reps)

    const updatedSession = session.logSet({
      exerciseId: input.exerciseId,
      weight: input.weight,
      reps: input.reps,
      estimatedOneRepMax,
    })

    await this.sessionRepository.save(updatedSession)

    const warning = this.calibrationService.isOutsideReliableRange(input.reps)
      ? 'Rep count exceeds the formula\'s reliable range (12). Estimate may be less accurate.'
      : null

    return {
      exerciseId: input.exerciseId,
      weight: input.weight,
      reps: input.reps,
      estimatedOneRepMax,
      warning,
    }
  }
}