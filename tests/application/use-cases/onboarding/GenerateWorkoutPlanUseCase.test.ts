import { describe, it, expect, beforeEach } from 'vitest'
import { GenerateWorkoutPlanUseCase } from '../../../../src/application/use-cases/onboarding/GenerateWorkoutPlanUseCase'

describe('GenerateWorkoutPlanUseCase', () => {
  let useCase: GenerateWorkoutPlanUseCase

  beforeEach(() => {
    useCase = new GenerateWorkoutPlanUseCase()
  })

  it('should generate a 3-day PPL plan', async () => {
    const result = await useCase.execute('user-1', { goal: 'muscle_gain' })

    expect(result.days).toHaveLength(3)
    expect(result.days.map((d) => d.label)).toEqual(['Push', 'Pull', 'Legs'])
  })

  it('should apply muscle_gain guidelines (10 reps, 4 sets, 75s rest)', async () => {
    const result = await useCase.execute('user-1', { goal: 'muscle_gain' })

    for (const day of result.days) {
      for (const exercise of day.exercises) {
        expect(exercise.reps).toBe(10)
        expect(exercise.sets).toBe(4)
        expect(exercise.restSeconds).toBe(75)
      }
    }
  })

  it('should apply fat_loss guidelines (14 reps, 3 sets, 40s rest)', async () => {
    const result = await useCase.execute('user-1', { goal: 'fat_loss' })

    for (const day of result.days) {
      for (const exercise of day.exercises) {
        expect(exercise.reps).toBe(14)
        expect(exercise.sets).toBe(3)
        expect(exercise.restSeconds).toBe(40)
      }
    }
  })

  it('should include the correct exercises for each day', async () => {
    const result = await useCase.execute('user-1', { goal: 'muscle_gain' })

    const push = result.days.find((d) => d.label === 'Push')
    const pull = result.days.find((d) => d.label === 'Pull')
    const legs = result.days.find((d) => d.label === 'Legs')

    expect(push?.exercises.map((e) => e.name)).toEqual([
      'Bench Press',
      'Dumbbell Shoulder Press',
      'Triceps Pushdown',
    ])
    expect(pull?.exercises.map((e) => e.name)).toEqual([
      'Lat Pulldown',
      'Barbell Row',
      'Bicep Curl',
    ])
    expect(legs?.exercises.map((e) => e.name)).toEqual([
      'Back Squat',
      'Leg Press',
      'Leg Extension',
    ])
  })

  it('should return the goal in the output', async () => {
    const result = await useCase.execute('user-1', { goal: 'fat_loss' })
    expect(result.goal).toBe('fat_loss')
  })
})