import { StackableStat, Stat } from "./stats";

export interface Weapon {
    atk: number;
    secondaryStat: Stat;
    passiveStats: {[key: string]: StackableStat};
}