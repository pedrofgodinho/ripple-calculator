import { CharacterStats } from "./stats";

export { BaseStats, Element, Move, MoveType, StatType, CharacterStats, Stat } from "./stats";
export { Echo } from "./echoes";

export function exampleStats(): CharacterStats {
    return new CharacterStats({atk: 100, hp: 100, def: 100})
}
