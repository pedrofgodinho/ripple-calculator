import { exampleStats } from '../src/index';

describe('exampleStats', () => {
    it('should return 100 for atk', () => {
        const stats = exampleStats();
        expect(stats.baseAtk).toBe(100);
    });
});