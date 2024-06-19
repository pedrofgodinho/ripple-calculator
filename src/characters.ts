import { Echo } from "./echoes";
import { BaseStats, CharacterStats, Stat, StatType } from "./stats";
import { Weapon } from "./weapons";


export class Character {
    stats: CharacterStats;
    extraStats: {[key: string]: {stat: Stat, stacks: number}};
    
    constructor(baseStats: BaseStats) {
        this.stats = new CharacterStats(baseStats);
        this.extraStats = {};
    }

    static fromInterface(i: unknown): Character {
        let parsed = i as Character;
        let character = new Character({atk: 0, hp: 0, def: 0}); // dummy data that will be overwritten on the next line
        character.stats = CharacterStats.fromInterface(parsed.stats);
        character.extraStats = parsed.extraStats;
        return character;
    }

    unequipWeapon(weapon: Weapon) {
        this.stats.removeStat({type: StatType.BaseAtk, value: weapon.atk});
        this.stats.removeStat(weapon.secondaryStat);
        for (let key in weapon.passiveStats) {
            this.deleteExtraStat(key);
        }
    }

    equipWeapon(weapon: Weapon) {

        this.stats.addStat({type: StatType.BaseAtk, value: weapon.atk});
        this.stats.addStat(weapon.secondaryStat);
        for (let key in weapon.passiveStats) {
            this.addStacksToWeaponStat(weapon, key, weapon.passiveStats[key].minStacks);
        }
    }

    equipEcho(echo: Echo) {
        this.stats.addEcho(echo);
    }

    unequipEcho(echo: Echo) {
        this.stats.removeEcho(echo);
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

    addStacksToWeaponStat(weapon: Weapon, key: string, stacks: number) {
        if (this.extraStats[key] === undefined) {
            this.extraStats[key] = {stat: weapon.passiveStats[key].stat, stacks: 0};
        }
        let currentStacks = this.extraStats[key].stacks;
        if (currentStacks === weapon.passiveStats[key].maxStacks) {
            return;
        }
        if (currentStacks + stacks > weapon.passiveStats[key].maxStacks) { 
            stacks = weapon.passiveStats[key].maxStacks - currentStacks;
        }
        this.addExtraStatStacks(key, weapon.passiveStats[key].stat, stacks);
    }

    removeStacksFromWeaponStat(weapon: Weapon, key: string, stacks: number) {
        let currentStacks = this.extraStats[key].stacks;  // this.extraStats[key] should always exist if the weapon is equipped
        if (currentStacks === weapon.passiveStats[key].minStacks) {
            return;
        }
        if (currentStacks - stacks < weapon.passiveStats[key].minStacks) {
            stacks = this.extraStats[key].stacks - weapon.passiveStats[key].minStacks;
        }
        this.removeExtraStatStacks(key, weapon.passiveStats[key].stat, stacks);
    }
}