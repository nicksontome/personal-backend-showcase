import { describe, it, expect } from 'vitest'
import { CalibrationService } from '../../../src/domain/services/CalibrationService'

describe('CalibrationService', () => {
  const service = new CalibrationService()

  describe('estimateOneRepMax', () => {
    it('should calculate 1RM using the Epley formula', () => {
      const result = service.estimateOneRepMax(80, 8)
      expect(result).toBeCloseTo(101.3, 1)
    })

    it('should return the weight itself when reps is 1', () => {
      const result = service.estimateOneRepMax(100, 1)
      expect(result).toBeCloseTo(103.3, 1)
    })

    it('should cap the calculation at 12 reps for reliability', () => {
      const resultAt12 = service.estimateOneRepMax(50, 12)
      const resultAt20 = service.estimateOneRepMax(50, 20)
      expect(resultAt12).toBe(resultAt20)
    })

    it('should throw if weight is zero or negative', () => {
      expect(() => service.estimateOneRepMax(0, 8)).toThrow()
      expect(() => service.estimateOneRepMax(-10, 8)).toThrow()
    })

    it('should throw if reps is zero, negative, or not an integer', () => {
      expect(() => service.estimateOneRepMax(80, 0)).toThrow()
      expect(() => service.estimateOneRepMax(80, -1)).toThrow()
      expect(() => service.estimateOneRepMax(80, 8.5)).toThrow()
    })
  })

  describe('isOutsideReliableRange', () => {
    it('should return false for reps within the reliable range', () => {
      expect(service.isOutsideReliableRange(8)).toBe(false)
      expect(service.isOutsideReliableRange(12)).toBe(false)
    })

    it('should return true for reps above the reliable range', () => {
      expect(service.isOutsideReliableRange(13)).toBe(true)
      expect(service.isOutsideReliableRange(20)).toBe(true)
    })
  })

  describe('suggestWeightForReps', () => {
    it('should suggest a lower weight for a higher rep target', () => {
      const oneRepMax = 100
      const weightFor5Reps = service.suggestWeightForReps(oneRepMax, 5)
      const weightFor10Reps = service.suggestWeightForReps(oneRepMax, 10)
      expect(weightFor10Reps).toBeLessThan(weightFor5Reps)
    })

    it('should be the inverse of estimateOneRepMax', () => {
      const weight = 80
      const reps = 8
      const oneRepMax = service.estimateOneRepMax(weight, reps)
      const suggestedWeight = service.suggestWeightForReps(oneRepMax, reps)
      expect(suggestedWeight).toBeCloseTo(weight, 0)
    })

    it('should throw if oneRepMax is zero or negative', () => {
      expect(() => service.suggestWeightForReps(0, 8)).toThrow()
    })
  })
})