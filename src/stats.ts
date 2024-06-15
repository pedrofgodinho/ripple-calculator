import { Echo } from "./echoes";

type ElementsDmg = [number, number, number, number, number, number, number];
export enum Element {
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
    element: Element;
    moveType: MoveType;
    moveMultiplier: number;
}

export enum StatType {
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

export class Stats {
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
        this.addStat(echo.mainStatType, echo.mainStatValue);
        this.addStat(echo.secondaryStatType, echo.secondaryStatValue);
        echo.substats.forEach(substat => this.addStat(substat.type, substat.value));
    }

    removeEcho(echo: Echo) {
        this.removeStat(echo.mainStatType, echo.mainStatValue);
        this.removeStat(echo.secondaryStatType, echo.secondaryStatValue);
        echo.substats.forEach(substat => this.removeStat(substat.type, substat.value));
    }

    addStat(statType: StatType, value: number) {
        switch (statType) {
            case StatType.AtkFlat:
                this.atkFlat += value;
                break;
            case StatType.HpFlat:
                this.hpFlat += value;
                break;
            case StatType.DefFlat:
                this.defFlat += value;
                break;
            case StatType.AtkPercent:
                this.atkPercent += value;
                break;
            case StatType.HpPercent:
                this.hpPercent += value;
                break;
            case StatType.DefPercent:
                this.defPercent += value;
                break;
            case StatType.CritRate:
                this.critRate += value;
                break;
            case StatType.CritDmg:
                this.critDmg += value;
                break;
            case StatType.EnergyRecharge:
                this.energyRecharge += value;
                break;
            case StatType.HealingBonus:
                this.healingBonus += value;
                break;
            case StatType.GlacioDmg:
                this.elementDmg[Element.Glacio] += value;
                break;
            case StatType.FusionDmg:
                this.elementDmg[Element.Fusion] += value;
                break;
            case StatType.ElectroDmg:
                this.elementDmg[Element.Electro] += value;
                break;
            case StatType.AeroDmg:
                this.elementDmg[Element.Aero] += value;
                break;
            case StatType.SpectroDmg:
                this.elementDmg[Element.Spectro] += value;
                break;
            case StatType.HavocDmg:
                this.elementDmg[Element.Havoc] += value;
                break;
            case StatType.SkillDmg:
                this.moveDmg[MoveType.Skill] += value;
                break;
            case StatType.BasicDmg:
                this.moveDmg[MoveType.Basic] += value;
                break;
            case StatType.HeavyDmg:
                this.moveDmg[MoveType.Heavy] += value;
                break;
            case StatType.LiberationDmg:
                this.moveDmg[MoveType.Liberation] += value;
                break;
        }
    }

    removeStat(statType: StatType, value: number) {
        this.addStat(statType, -value);
    }
}

