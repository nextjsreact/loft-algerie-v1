import { cn } from '@/lib/utils';

describe('🛠️ Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('base-class', 'additional-class');
      expect(result).toContain('base-class');
      expect(result).toContain('additional-class');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base-class', undefined, null, 'valid-class');
      expect(result).toContain('base-class');
      expect(result).toContain('valid-class');
      expect(result).not.toContain('undefined');
      expect(result).not.toContain('null');
    });
  });
});