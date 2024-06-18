import { Echo } from "./echoes";
import { BaseStats, CharacterStats, Stat, StatType } from "./stats";
import { Weapon } from "./weapons";


export class Character {
    stats: CharacterStats;
    echoes: [Echo|null, Echo|null, Echo|null, Echo|null, Echo|null];
    weapon: Weapon;
    extraStats: {[key: string]: {stat: Stat, stacks: number}};
    
    constructor(baseStats: BaseStats, weapon: Weapon, echoes: [Echo|null, Echo|null, Echo|null, Echo|null, Echo|null]) {
        this.stats = new CharacterStats(baseStats);
        this.echoes = echoes;
        this.extraStats = {};
        
        for (let echo of echoes) {
            if (echo !== null) {
                this.stats.addEcho(echo);
            }
        }

        // temp weapon so that we can call equipWeapon to set the stats
        this.weapon = {
            atk: 0,
            secondaryStat: {type: StatType.BaseAtk, value: 0},
            passiveStats: {}
        };
        this.equipWeapon(weapon);
    }

    equipWeapon(weapon: Weapon) {
        // remove old weapon stats
        this.stats.removeStat({type: StatType.BaseAtk, value: this.weapon.atk});
        this.stats.removeStat(this.weapon.secondaryStat);
        for (let key in this.weapon.passiveStats) {
            this.deleteExtraStat(key);
        }

        this.weapon = weapon;
        this.stats.addStat({type: StatType.BaseAtk, value: weapon.atk});
        this.stats.addStat(weapon.secondaryStat);
        for (let key in weapon.passiveStats) {
            this.addStacksToWeaponStat(key, weapon.passiveStats[key].minStacks);
        }
    }

    setEcho(position: number, echo: Echo|null) {
        if (this.echoes[position] !== null) {
            this.stats.removeEcho(this.echoes[position]!);
        }
        this.echoes[position] = echo;
        if (echo !== null) {
            this.stats.addEcho(echo);
        }
    }

    addExtraStatStacks(key: string, stat: Stat, stacks: number = 1) {
        if (this.extraStats[key] === undefined) {
            this.extraStats[key] = {stat, stacks};
        } else {
            this.extraStats[key].stacks += stacks;
        }
        this.stats.addStat(stat, stacks);
    }

    removeExtraStatStacks(key: string, stat: Stat, stacks: number = 1) {
        if (this.extraStats[key] === undefined) {
            return;
        }
        if (this.extraStats[key].stacks - stacks <= 0) {
            this.stats.removeStat(stat, this.extraStats[key].stacks);
            return;
        }
        this.extraStats[key].stacks -= stacks;
        this.stats.removeStat(stat, stacks);
    }

    deleteExtraStat(key: string) {
        if (this.extraStats[key] !== undefined) {
            this.stats.removeStat(this.extraStats[key].stat, this.extraStats[key].stacks);
            delete this.extraStats[key];
        }
    }

    addStacksToWeaponStat(key: string, stacks: number) {
        if (this.extraStats[key] === undefined) {
            this.extraStats[key] = {stat: this.weapon.passiveStats[key].stat, stacks: 0};
        }
        let currentStacks = this.extraStats[key].stacks;
        if (currentStacks === this.weapon.passiveStats[key].maxStacks) {
            return;
        }
        if (currentStacks + stacks > this.weapon.passiveStats[key].maxStacks) { 
            stacks = this.weapon.passiveStats[key].maxStacks - currentStacks;
        }
        this.addExtraStatStacks(key, this.weapon.passiveStats[key].stat, stacks);
    }

    removeStacksFromWeaponStat(key: string, stacks: number) {
        let currentStacks = this.extraStats[key].stacks;  // this.extraStats[key] should always exist if the weapon is equipped
        if (currentStacks === this.weapon.passiveStats[key].minStacks) {
            return;
        }
        if (currentStacks - stacks < this.weapon.passiveStats[key].minStacks) {
            stacks = this.extraStats[key].stacks - this.weapon.passiveStats[key].minStacks;
        }
        this.removeExtraStatStacks(key, this.weapon.passiveStats[key].stat, stacks);
    }
}