import { Echo } from "./echoes";

type ElementsDmg = [number, number, number, number, number, number];
export enum MoveElement {
    Glacio,
    Fusion,
    Electro,
    Aero,
    Spectro,
    Havoc,
}

type MovesDmg = [number, number, number, number];
export enum MoveType {
    Skill,
    Basic,
    Heavy,
    Liberation,
}

export interface BaseStats {
    atk: number;
    hp: number;
    def: number;
}

export interface Move {
    element: MoveElement;
    moveType: MoveType;
    moveMultiplier: number;
}

export enum StatType {
    BaseAtk,
    BaseHp,
    BaseDef,

    AtkFlat,
    HpFlat,
    DefFlat,

    AtkPercent,
    HpPercent,
    DefPercent,

    CritRate,
    CritDmg,
    EnergyRecharge,
    HealingBonus,

    GlacioDmg,
    FusionDmg,
    ElectroDmg,
    AeroDmg,
    SpectroDmg,
    HavocDmg,

    SkillDmg,
    BasicDmg,
    HeavyDmg,
    LiberationDmg,
}

export interface Stat {
    type: StatType;
    value: number;
}

export interface StackableStat {
    stat: Stat;
    minStacks: number;
    maxStacks: number;
}

export class CharacterStats {
    baseAtk: number;
    baseHp: number;
    baseDef: number;

    atkFlat: number;
    hpFlat: number;
    defFlat: number;

    atkPercent: number;
    hpPercent: number;
    defPercent: number;

    critRate: number;
    critDmg: number;
    energyRecharge: number;
    healingBonus: number;

    elementDmg: ElementsDmg;
    moveDmg: MovesDmg;


    constructor(baseStats: BaseStats) {
        this.baseAtk = baseStats.atk;
        this.baseHp = baseStats.hp;
        this.baseDef = baseStats.def;

        this.atkFlat = 0;
        this.hpFlat = 0;
        this.defFlat = 0;

        this.atkPercent = 0;
        this.hpPercent = 0;
        this.defPercent = 0;

        this.critRate = 0.05;
        this.critDmg = 1.5;
        this.energyRecharge = 0;
        this.healingBonus = 0;

        this.elementDmg = [0, 0, 0, 0, 0, 0];
        this.moveDmg = [0, 0, 0, 0];
    }

    getAtk(): number {
        return this.baseAtk * (1 + this.atkPercent) + this.atkFlat;
    }

    getHp(): number {
        return this.baseHp * (1 + this.hpPercent) + this.hpFlat;
    }

    getDef(): number {
        return this.baseDef * (1 + this.defPercent) + this.defFlat;
    }

    getMoveBaseDmg(move: Move): number {
        return this.getAtk() * move.moveMultiplier * (1 + this.moveDmg[move.moveType] + this.elementDmg[move.element]);
    }

    getMoveBaseDmgCrit(move: Move): number {
        return this.getMoveBaseDmg(move) * this.critDmg;
    }

    getMoveBaseDmgAvg(move: Move): number {
        return this.getMoveBaseDmg(move) * (1 + this.critRate * (this.critDmg - 1));
    }

    getEnemyResistance(character_level: number, enemy_level: number): number {
        // TODO better names: eleRes and dmgReduction do the opposite of what they sound like
        let defIgnore = 0.0; // TODO
        let resPen = 0.0; // TODO
        let eleRes = 1.0; // TODO
        let dmgReduction = 1.0; // TODO

        const baseRes = 0.1;
        const resTotal = baseRes + resPen;
        const resAdjusted = resTotal <= 0 ? 1 - resTotal / 2 : (resTotal <= 0.8 ? 1 - resTotal : 1 / (1 + 5 * resTotal));

        const enemyDef = 8 * enemy_level + 792;
        const characterLevelPart = 8 * character_level + 800;
        const defMult = characterLevelPart / (characterLevelPart + enemyDef * (1 - defIgnore));

        return resAdjusted * eleRes * dmgReduction * defMult;
    }

    getMoveDmg(move: Move, character_level: number, enemy_level: number): number {
        return this.getMoveBaseDmg(move) * this.getEnemyResistance(character_level, enemy_level);
    }

    getMoveDmgCrit(move: Move, character_level: number, enemy_level: number): number {
        return this.getMoveBaseDmgCrit(move) * this.getEnemyResistance(character_level, enemy_level);
    }

    getMoveDmgAvg(move: Move, character_level: number, enemy_level: number): number {
        return this.getMoveBaseDmgAvg(move) * this.getEnemyResistance(character_level, enemy_level);
    }

    addEcho(echo: Echo) {
        this.addStat(echo.mainStat);
        this.addStat(echo.secondaryStat);
        echo.substats.forEach(substat => this.addStat(substat));
    }

    removeEcho(echo: Echo) {
        this.removeStat(echo.mainStat);
        this.removeStat(echo.secondaryStat);
        echo.substats.forEach(substat => this.removeStat(substat));
    }

    addStat(stat: Stat, stacks: number = 1) {
        switch (stat.type) {
            case StatType.BaseAtk:
                this.baseAtk += stat.value * stacks;
                break;
            case StatType.AtkFlat:
                this.atkFlat += stat.value * stacks;
                break;
            case StatType.HpFlat:
                this.hpFlat += stat.value * stacks;
                break;
            case StatType.DefFlat:
                this.defFlat += stat.value * stacks;
                break;
            case StatType.AtkPercent:
                this.atkPercent += stat.value * stacks;
                break;
            case StatType.HpPercent:
                this.hpPercent += stat.value * stacks;
                break;
            case StatType.DefPercent:
                this.defPercent += stat.value * stacks;
                break;
            case StatType.CritRate:
                this.critRate += stat.value * stacks;
                break;
            case StatType.CritDmg:
                this.critDmg += stat.value * stacks;
                break;
            case StatType.EnergyRecharge:
                this.energyRecharge += stat.value * stacks;
                break;
            case StatType.HealingBonus:
                this.healingBonus += stat.value * stacks;
                break;
            case StatType.GlacioDmg:
                this.elementDmg[MoveElement.Glacio] += stat.value * stacks;
                break;
            case StatType.FusionDmg:
                this.elementDmg[MoveElement.Fusion] += stat.value * stacks;
                break;
            case StatType.ElectroDmg:
                this.elementDmg[MoveElement.Electro] += stat.value * stacks;
                break;
            case StatType.AeroDmg:
                this.elementDmg[MoveElement.Aero] += stat.value * stacks;
                break;
            case StatType.SpectroDmg:
                this.elementDmg[MoveElement.Spectro] += stat.value * stacks;
                break;
            case StatType.HavocDmg:
                this.elementDmg[MoveElement.Havoc] += stat.value * stacks;
                break;
            case StatType.SkillDmg:
                this.moveDmg[MoveType.Skill] += stat.value * stacks;
                break;
            case StatType.BasicDmg:
                this.moveDmg[MoveType.Basic] += stat.value * stacks;
                break;
            case StatType.HeavyDmg:
                this.moveDmg[MoveType.Heavy] += stat.value * stacks;
                break;
            case StatType.LiberationDmg:
                this.moveDmg[MoveType.Liberation] += stat.value * stacks;
                break;
        }
    }

    removeStat(stat: Stat, stacks: number = 1) {
        let negativeStat = {type: stat.type, value: -stat.value};
        this.addStat(negativeStat, stacks);
    }
}

