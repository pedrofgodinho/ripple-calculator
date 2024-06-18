import { BaseStats, CharacterStats, MoveElement, MoveType, StatType } from "../src";
import { Character } from "../src/characters";
import { Weapon } from "../src/weapons";


const BASE_STATS: BaseStats = {
    atk: 343,
    hp: 7954,
    def: 899,
};

const WEAPON: Weapon = {
    atk: 445,
    secondaryStat: {type: StatType.CritDmg, value: 0.401},
    passiveStats: {
        "VerdantSummit1": {minStacks: 1, maxStacks: 1, stat: {type: StatType.GlacioDmg, value: 0.12}},
        "VerdantSummit2": {minStacks: 1, maxStacks: 1, stat: {type: StatType.FusionDmg, value: 0.12}},
        "VerdantSummit3": {minStacks: 1, maxStacks: 1, stat: {type: StatType.ElectroDmg, value: 0.12}},
        "VerdantSummit4": {minStacks: 1, maxStacks: 1, stat: {type: StatType.AeroDmg, value: 0.12}},
        "VerdantSummit5": {minStacks: 1, maxStacks: 1, stat: {type: StatType.SpectroDmg, value: 0.12}},
        "VerdantSummit6": {minStacks: 1, maxStacks: 1, stat: {type: StatType.HavocDmg, value: 0.12}},
        "VerdantSummit7": {minStacks: 0, maxStacks: 2, stat: {type: StatType.HeavyDmg, value: 0.24}},
    }
};

const ECHO1 = {
    cost: 3,
    mainStat: {type: StatType.AeroDmg, value: 0.3},
    secondaryStat: {type: StatType.AtkFlat, value: 100},
    substats: [
        {type: StatType.CritRate, value: 0.075},
        {type: StatType.AtkFlat, value: 50},
        {type: StatType.CritDmg, value: 0.15},
        {type: StatType.HeavyDmg, value: 0.094},
        {type: StatType.HpFlat, value: 430},
    ]
};
const ECHO2 = {
    cost: 1,
    mainStat: {type: StatType.AtkPercent, value: 0.122},
    secondaryStat: {type: StatType.HpFlat, value: 1550},
    substats: [
        {type: StatType.BasicDmg, value: 0.101},
        {type: StatType.CritDmg, value: 0.174},
        {type: StatType.DefFlat, value: 50},
    ]
};

function sampleStats(): CharacterStats{
    // returns the stats of a level 70 Jiyan with lvl 70 signature weapon, with a sample echo
    let stats = new CharacterStats(BASE_STATS);

    // weapon
    stats.baseAtk += 445;
    stats.critDmg += 0.401;
    for (let i = 0; i < 6; i++) {
        stats.elementDmg[i] += 0.12;
    }

    // echo 1: aero dmg 30%  atk 100  crit rate 7.5%  atk 50  crit dmg 15%  heavy dmg 9.4%  hp 430
    stats.elementDmg[MoveElement.Aero] += 0.3;
    stats.atkFlat += 100;
    stats.critRate += 0.075;
    stats.atkFlat += 50;
    stats.critDmg += 0.15;
    stats.moveDmg[MoveType.Heavy] += 0.094;
    stats.hpFlat += 430;

    // echo2: atk 12.2%  hp 1550  basic dmg 10.1%  crig dmg 17.4%  def 50
    stats.atkPercent += 0.122;
    stats.hpFlat += 1550;
    stats.moveDmg[MoveType.Basic] += 0.101;
    stats.critDmg += 0.174;
    stats.defFlat += 50;

    // Talent Stats
    stats.atkPercent += 0.018 + 0.018;
    stats.critRate += 0.012 + 0.012;
    stats.critDmg += 0.12;

    return stats;
}


// TODO proper tests
describe('CharacterStats', () => {
    it('should calculate stats properly', () => {
        const stats = sampleStats();
        
        expect(stats.getAtk()).toBeApproxEqual(1062);
        expect(stats.getHp()).toBeApproxEqual(9934);
        expect(stats.getDef()).toBeApproxEqual(949);
        expect(stats.critRate).toBeApproxEqual(0.149);
        expect(stats.critDmg).toBeApproxEqual(2.345);
        expect(stats.moveDmg[MoveType.Basic]).toBeApproxEqual(0.101);
        expect(stats.moveDmg[MoveType.Heavy]).toBeApproxEqual(0.094);
        expect(stats.moveDmg[MoveType.Liberation]).toBeApproxEqual(0);
        expect(stats.moveDmg[MoveType.Skill]).toBeApproxEqual(0);
        expect(stats.elementDmg[MoveElement.Glacio]).toBeApproxEqual(0.12);
        expect(stats.elementDmg[MoveElement.Fusion]).toBeApproxEqual(0.12);
        expect(stats.elementDmg[MoveElement.Electro]).toBeApproxEqual(0.12);
        expect(stats.elementDmg[MoveElement.Aero]).toBeApproxEqual(0.42);
        expect(stats.elementDmg[MoveElement.Spectro]).toBeApproxEqual(0.12);
        expect(stats.elementDmg[MoveElement.Havoc]).toBeApproxEqual(0.12);
    });

    it('should calculate damage properly', () => {
        const stats = sampleStats();

        const move = {element: MoveElement.Aero, moveType: MoveType.Basic, moveMultiplier: 0.5007};
        
        // Damage data collected from in-game testing at level 70
        expect(stats.getMoveBaseDmg(move)).toBeApproxEqual(809);
        expect(stats.getMoveBaseDmgCrit(move)).toBeApproxEqual(1898);

        let damagePerLevel = [
            {level: 62, noncrit: 374, crit: 878},
            {level: 63, noncrit: 373, crit: 875},
            {level: 64, noncrit: 372, crit: 872},
            {level: 65, noncrit: 371, crit: 870},
            {level: 70, noncrit: 366, crit: 857},
        ]
        for (let i = 0; i < damagePerLevel.length; i++) {
            expect(stats.getMoveDmg(move, 70, damagePerLevel[i].level)).toBeApproxEqual(damagePerLevel[i].noncrit);
            expect(stats.getMoveDmgCrit(move, 70, damagePerLevel[i].level)).toBeApproxEqual(damagePerLevel[i].crit);
        }
    });
});

describe('Character', () => {
    it('should match the example stats', () => {
        let character = new Character(BASE_STATS, WEAPON, [ECHO1, ECHO2, null, null, null]);

        character.addExtraStatStacks("Bonus1", {type: StatType.AtkPercent, value: 0.018}, 2);
        character.addExtraStatStacks("Bonus3", {type: StatType.CritRate, value: 0.012}, 2);
        character.addExtraStatStacks("TempestTaming", {type: StatType.CritDmg, value: 0.12});

        const stats = sampleStats();
        expect(character.stats).toBeApproxEqual(stats);
    });

    it('should allow enabling weapon bonuses', () => {
        let echo1 = {
            cost: 3,
            mainStat: {type: StatType.AeroDmg, value: 0.3},
            secondaryStat: {type: StatType.AtkFlat, value: 100},
            substats: [
                {type: StatType.CritRate, value: 0.075},
                {type: StatType.AtkFlat, value: 50},
                {type: StatType.CritDmg, value: 0.15},
                {type: StatType.HeavyDmg, value: 0.094},
                {type: StatType.HpFlat, value: 430},
            ]
        };
        let echo2 = {
            cost: 1,
            mainStat: {type: StatType.AtkPercent, value: 0.122},
            secondaryStat: {type: StatType.HpFlat, value: 1550},
            substats: [
                {type: StatType.BasicDmg, value: 0.101},
                {type: StatType.CritDmg, value: 0.174},
                {type: StatType.DefFlat, value: 50},
            ]
        };

        let character = new Character(BASE_STATS, WEAPON, [echo1, echo2, null, null, null]);

        character.addExtraStatStacks("Bonus1", {type: StatType.AtkPercent, value: 0.018}, 2);
        character.addExtraStatStacks("Bonus3", {type: StatType.CritRate, value: 0.012}, 2);
        character.addExtraStatStacks("TempestTaming", {type: StatType.CritDmg, value: 0.12});

        character.addStacksToWeaponStat("VerdantSummit7", 2);

        const stats = sampleStats();
        stats.moveDmg[MoveType.Heavy] += 0.24 * 2;
        expect(character.stats).toBeApproxEqual(stats);
    });
});