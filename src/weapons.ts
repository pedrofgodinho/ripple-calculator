import { StackableStat, StatType } from "./stats";

export interface Weapon {
    atk: number;
    secondaryStat: {type: StatType, value: number};
    passiveStats: {[key: string]: StackableStat};
}