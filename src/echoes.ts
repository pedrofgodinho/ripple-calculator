import { StatType, Stats } from "./stats";

export interface Echo {
    cost: number;
    mainStatType: StatType;
    mainStatValue: number;
    secondaryStatType: StatType;
    secondaryStatValue: number;
    substats: {type: StatType, value: number}[];
}