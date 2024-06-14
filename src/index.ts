import { Stats } from "./stats";

export { BaseStats, Element, Move, MoveType, StatType, Stats } from "./stats";
export { Echo } from "./echoes";

export function exampleStats(): Stats {
    return new Stats({atk: 100, hp: 100, def: 100})
}
