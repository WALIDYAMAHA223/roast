import { isContentInappropriate, filterContent, getSafeFallback } from '@/lib/filters'

describe('filters', () => {
  describe('isContentInappropriate', () => {
    it('should detect blocked words', () => {
      expect(isContentInappropriate('Tu es un idiot')).toBe(true)
      expect(isContentInappropriate('Tu es stupide')).toBe(true)
      expect(isContentInappropriate('connard')).toBe(true)
    })

    it('should detect problematic patterns', () => {
      expect(isContentInappropriate('Tu es un connard')).toBe(true)
      expect(isContentInappropriate('Va te faire foutre')).toBe(true)
      expect(isContentInappropriate('Je te déteste')).toBe(true)
    })

    it('should allow appropriate content', () => {
      expect(isContentInappropriate('Tu es génial')).toBe(false)
      expect(isContentInappropriate('Bonne journée')).toBe(false)
      expect(isContentInappropriate('Merci beaucoup')).toBe(false)
    })

    it('should be case insensitive', () => {
      expect(isContentInappropriate('TU ES UN IDIOT')).toBe(true)
      expect(isContentInappropriate('Idiot')).toBe(true)
    })
  })

  describe('filterContent', () => {
    it('should allow safe content in roast mode', () => {
      const result = filterContent('Tu es génial', 'roast', true)
      expect(result.isSafe).toBe(true)
    })

    it('should block inappropriate content in safe mode', () => {
      const result = filterContent('Tu es un idiot', 'roast', true)
      expect(result.isSafe).toBe(false)
    })

    it('should allow inappropriate content in non-safe mode', () => {
      const result = filterContent('Tu es un idiot', 'roast', false)
      expect(result.isSafe).toBe(true)
    })

    it('should block negative words in compliment mode', () => {
      const result = filterContent('Tu es un idiot mais génial', 'compliment', false)
      expect(result.isSafe).toBe(false)
    })

    it('should allow positive content in compliment mode', () => {
      const result = filterContent('Tu es génial et merveilleux', 'compliment', false)
      expect(result.isSafe).toBe(true)
    })
  })

  describe('getSafeFallback', () => {
    it('should return French fallback for French language', () => {
      const fallback = getSafeFallback('roast', 'light', 'fr')
      expect(fallback).toContain('Désolé')
    })

    it('should return English fallback for English language', () => {
      const fallback = getSafeFallback('roast', 'light', 'en')
      expect(fallback).toContain('Sorry')
    })

    it('should return different fallbacks for different intensities', () => {
      const lightFallback = getSafeFallback('roast', 'light', 'fr')
      const mediumFallback = getSafeFallback('roast', 'medium', 'fr')
      const spicyFallback = getSafeFallback('roast', 'spicy', 'fr')
      
      expect(lightFallback).not.toBe(mediumFallback)
      expect(mediumFallback).not.toBe(spicyFallback)
    })

    it('should return different fallbacks for different modes', () => {
      const roastFallback = getSafeFallback('roast', 'light', 'fr')
      const complimentFallback = getSafeFallback('compliment', 'light', 'fr')
      
      expect(roastFallback).not.toBe(complimentFallback)
    })

    it('should default to French if language not found', () => {
      const fallback = getSafeFallback('roast', 'light', 'unknown')
      expect(fallback).toContain('Désolé')
    })
  })
})




