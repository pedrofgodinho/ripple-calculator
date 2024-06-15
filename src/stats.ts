import { Echo } from "./echoes";

type ElementsDmg = [number, number, number, number, number, number, number];
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

        this.elementDmg = [0, 0, 0, 0, 0, 0, 0];
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

    addStat(stat: Stat) {
        switch (stat.type) {
            case StatType.BaseAtk:
                this.baseAtk += stat.value;
                break;
            case StatType.AtkFlat:
                this.atkFlat += stat.value;
                break;
            case StatType.HpFlat:
                this.hpFlat += stat.value;
                break;
            case StatType.DefFlat:
                this.defFlat += stat.value;
                break;
            case StatType.AtkPercent:
                this.atkPercent += stat.value;
                break;
            case StatType.HpPercent:
                this.hpPercent += stat.value;
                break;
            case StatType.DefPercent:
                this.defPercent += stat.value;
                break;
            case StatType.CritRate:
                this.critRate += stat.value;
                break;
            case StatType.CritDmg:
                this.critDmg += stat.value;
                break;
            case StatType.EnergyRecharge:
                this.energyRecharge += stat.value;
                break;
            case StatType.HealingBonus:
                this.healingBonus += stat.value;
                break;
            case StatType.GlacioDmg:
                this.elementDmg[MoveElement.Glacio] += stat.value;
                break;
            case StatType.FusionDmg:
                this.elementDmg[MoveElement.Fusion] += stat.value;
                break;
            case StatType.ElectroDmg:
                this.elementDmg[MoveElement.Electro] += stat.value;
                break;
            case StatType.AeroDmg:
                this.elementDmg[MoveElement.Aero] += stat.value;
                break;
            case StatType.SpectroDmg:
                this.elementDmg[MoveElement.Spectro] += stat.value;
                break;
            case StatType.HavocDmg:
                this.elementDmg[MoveElement.Havoc] += stat.value;
                break;
            case StatType.SkillDmg:
                this.moveDmg[MoveType.Skill] += stat.value;
                break;
            case StatType.BasicDmg:
                this.moveDmg[MoveType.Basic] += stat.value;
                break;
            case StatType.HeavyDmg:
                this.moveDmg[MoveType.Heavy] += stat.value;
                break;
            case StatType.LiberationDmg:
                this.moveDmg[MoveType.Liberation] += stat.value;
                break;
        }
    }

    removeStat(stat: Stat) {
        let negativeStat = {type: stat.type, value: -stat.value};
        this.addStat(negativeStat);
    }
}

