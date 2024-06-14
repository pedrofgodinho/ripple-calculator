import { StatType, Stats } from "./stats";

export interface Echo {
    cost: number;
    main_stat_type: StatType;
    main_stat_value: number;
    secondary_stat_type: StatType;
    secondary_stat_value: number;
    substats: {type: StatType, value: number}[];
}