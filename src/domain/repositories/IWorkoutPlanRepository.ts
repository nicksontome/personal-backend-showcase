import { WorkoutPlan } from '../entities/WorkoutPlan'

/**
 * Repository interface for WorkoutPlan persistence.
 */
export interface IWorkoutPlanRepository {
  save(plan: WorkoutPlan): Promise<void>

  findById(id: string): Promise<WorkoutPlan | null>

  findByUserId(userId: string): Promise<WorkoutPlan | null>
}