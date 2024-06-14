"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
describe('exampleStats', () => {
    it('should return 100 for atk', () => {
        const stats = (0, index_1.exampleStats)();
        expect(stats.atk).toBe(100);
    });
});
