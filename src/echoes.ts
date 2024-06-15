import { Stat } from "./stats";

export interface Echo {
    cost: number;
    mainStat: Stat;
    secondaryStat: Stat;
    substats: Stat[];
}