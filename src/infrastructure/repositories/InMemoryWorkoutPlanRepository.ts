import { WorkoutPlan } from '../../domain/entities/WorkoutPlan'
import { IWorkoutPlanRepository } from '../../domain/repositories/IWorkoutPlanRepository'

/**
 * In-memory implementation of IWorkoutPlanRepository.
 *
 * Data persists only during the server session.
 */
export class InMemoryWorkoutPlanRepository implements IWorkoutPlanRepository {
  private plans: Map<string, WorkoutPlan> = new Map()

  async save(plan: WorkoutPlan): Promise<void> {
    this.plans.set(plan.id, plan)
  }

  async findById(id: string): Promise<WorkoutPlan | null> {
    return this.plans.get(id) ?? null
  }

  async findByUserId(userId: string): Promise<WorkoutPlan | null> {
    for (const plan of this.plans.values()) {
      if (plan.userId === userId) return plan
    }
    return null
  }
}