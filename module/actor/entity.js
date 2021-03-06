import { d20Roll, damageRoll } from "../dice.js";
import ShortRestDialog from "../apps/short-rest.js";
import LongRestDialog from "../apps/long-rest.js";
import AbilityUseDialog from "../apps/ability-use-dialog.js";
import AbilityTemplate from "../pixi/ability-template.js";
import {bfrpg} from '../config.js';

/**
 * Extend the base Actor class to implement additional system-specific logic.
 */
export default class ActorBFRPG extends Actor {

  /**
   * Is this Actor currently polymorphed into some other creature?
   * @return {boolean}
   */
  get isPolymorphed() {
    return this.getFlag("bfrpg", "isPolymorphed") || false;
  }

  /* -------------------------------------------- */

  /** @override */
  prepareBaseData() {
    switch ( this.data.type ) {
      case "character":
        return this._prepareCharacterData(this.data);
      case "npc":
        return this._prepareNPCData(this.data);
      case "vehicle":
        return this._prepareVehicleData(this.data);
    }
  }

  /* -------------------------------------------- */

  /** @override */
  prepareDerivedData() {
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.bfrpg || {};
    const bonuses = getProperty(data, "bonuses.abilities") || {};

    // Retrieve data for polymorphed actors
    let originalSaves = null;
    let originalSkills = null;
    if (this.isPolymorphed) {
      const transformOptions = this.getFlag('bfrpg', 'transformOptions');
      const original = game.actors?.get(this.getFlag('bfrpg', 'originalActor'));
      if (original) {
        if (transformOptions.mergeSaves) {
          originalSaves = original.data.data.abilities;
        }
        if (transformOptions.mergeSkills) {
          originalSkills = original.data.data.skills;
        }
      }
    }

    // Ability modifiers and saves
    const dcBonus = Number.isNumeric(data.bonuses?.spell?.dc) ? parseInt(data.bonuses.spell.dc) : 0;
    const saveBonus = Number.isNumeric(bonuses.save) ? parseInt(bonuses.save) : 0;
    const checkBonus = Number.isNumeric(bonuses.check) ? parseInt(bonuses.check) : 0;
    for (let [id, abl] of Object.entries(data.abilities)) {
      if ( flags.diamondSoul ) abl.proficient = 1;  // Diamond Soul is proficient in all saves
      //abl.mod = Math.floor((abl.value - 10) / 2);
      if (abl.tempScore > 0){
        abl.mod = bfrpg.abilityModifierTable[abl.tempScore - 1];
      } else {
        abl.mod = bfrpg.abilityModifierTable[abl.value - 1];
      }
      abl.prof = (abl.proficient || 0) * data.attributes.prof;
      abl.saveBonus = saveBonus;
      abl.checkBonus = checkBonus;
      //abl.save = abl.mod + abl.prof + abl.saveBonus;
      abl.dc = 8 + abl.mod + data.attributes.prof + dcBonus;

      // If we merged saves when transforming, take the highest bonus here.
      if (originalSaves && abl.proficient) {
        abl.save = Math.max(abl.save, originalSaves[id].save);
      }
    }

    // Inventory encumbrance
    data.attributes.encumbrance = this._computeEncumbrance(actorData);

    // Prepare skills
    this._prepareSkills(actorData, bonuses, checkBonus, originalSkills);

    // Determine Initiative Modifier
    /* const init = data.attributes.init;
    const athlete = flags.remarkableAthlete;
    const joat = flags.jackOfAllTrades;
    init.mod = data.abilities.dex.mod;
    if ( joat ) init.prof = Math.floor(0.5 * data.attributes.prof);
    else if ( athlete ) init.prof = Math.ceil(0.5 * data.attributes.prof);
    else init.prof = 0;
    init.value = init.value ?? 0;
    init.bonus = init.value + (flags.initiativeAlert ? 5 : 0);
    init.total = init.mod + init.prof + init.bonus; */

    switch(data.details.race) { //The character's race
      case "dwarf":
        data.attributes.init.racemod = 0;
        break;
      case "elf":
        data.attributes.init.racemod = 0;
        break;
      case "halfling":
        data.attributes.init.racemod = 1;
        break;
      case "human":
        data.attributes.init.racemod = 0;
        break;
      default:
        data.attributes.init.racemod = 0;
    } 
    //data.attributes.init.prof = 0;
    data.attributes.init.bonus = data.attributes.init.racemod + data.abilities.dex.mod;
    data.attributes.init.value = data.attributes.init.bonus + data.attributes.init.mod;
    data.attributes.init.total = data.attributes.init.value;



    // Reaction Bonus
    data.attributes.reaction.value = data.attributes.reaction.miscmod + data.abilities.cha.mod;


    if (actorData.type === "character"){
      // Resources - set LongRest = true for all since there are only long rests in bfrpg
      data.resources.primary.lr = true;
      data.resources.secondary.lr = true;
      data.resources.tertiary.lr = true;
    }


    // Racial Traits 
    switch(data.details.race) { //The character's race
      case "dwarf":
        const dwarfLanguages = ["common", "dwarvish"];
        for (let lang of dwarfLanguages){
          if (!data.traits.languages.value.includes(lang)){
            data.traits.languages.value.push(lang);
          }
        }
        const dwarfAbilities = ["darkvision", "stonework", "noLweapons"];
        for (let raceabl of dwarfAbilities){
          if (!data.traits.racialAbility.value.includes(raceabl)){
            data.traits.racialAbility.value.push(raceabl);
          }
        }
        break;
      case "elf":
        const elfLanguages = ["common", "elvish"];
        for (let lang of elfLanguages){
          if (!data.traits.languages.value.includes(lang)){
            data.traits.languages.value.push(lang);
          }
        }
        const elfAbilities = ["darkvision", "doors", "paralysis", "surprise", "maxhd"];
        for (let raceabl of elfAbilities){
          if (!data.traits.racialAbility.value.includes(raceabl)){
            data.traits.racialAbility.value.push(raceabl);
          }
        }
        break;
      case "halfling":
        const halflingLanguages = ["common", "halfling"];
        for (let lang of halflingLanguages){
          if (!data.traits.languages.value.includes(lang)){
            data.traits.languages.value.push(lang);
          }
        }
        const halflingAbilities = ["hide", "noLMweapons", "maxhd"];
        for (let raceabl of halflingAbilities){
          if (!data.traits.racialAbility.value.includes(raceabl)){
            data.traits.racialAbility.value.push(raceabl);
          }
        }
        break;
      case "human":
        const humanLanguages = ["common"];
        for (let lang of humanLanguages){
          if (!data.traits.languages.value.includes(lang)){
            data.traits.languages.value.push(lang);
          }
        }
        const humanAbilities = ["xpbonus"];
        for (let raceabl of humanAbilities){
          if (!data.traits.racialAbility.value.includes(raceabl)){
            data.traits.racialAbility.value.push(raceabl);
          }
        }
        break;
      default:
        break;
    } 

    //------------------------------------------------------


    // Prepare spell-casting data
    this._computeSpellcastingDC(this.data);
    this._computeSpellcastingProgression(this.data);
  


    //------------------------------------------------------
    // Ability Check Target
    data.attributes.checkTarget = bfrpg.abilityCheckTable[data.details.level - 1];

    //------------------------------------------------------
    // Compute Speeds
    if (actorData.type === "character"){
      let encumbrance = "";
      if (data.attributes.encumbrance.value > data.attributes.encumbrance.max) {
        encumbrance = "encumbered";
      } else if (data.attributes.encumbrance.value <= data.attributes.encumbrance.threshold){
        encumbrance = "light";
      } else {
        encumbrance = "heavy";
      }
      data.attributes.movement.walk = null;
      let armorType = actorData.items.filter(i => i.type === "equipment" && i.data.equipped === true && i.data.armor.value != 0);
      for (let Armoritem of armorType){
        switch(Armoritem.data.armor.type) {
          case "leather":
            if (encumbrance === "light") {
              data.attributes.movement.walk = 30;
            } else if (encumbrance === "heavy"){
              data.attributes.movement.walk = 20;
            } else {   // encumbered beyond max carry
              data.attributes.movement.walk = 0;
            }
            break;
          case "leathermagic":
            if (encumbrance === "light") { 
              data.attributes.movement.walk = 40;
            } else if (encumbrance === "heavy"){
              data.attributes.movement.walk = 30;
            } else {   // encumbered beyond max carry
              data.attributes.movement.walk = 0;
            }
            break;
          case "metal":
            if (encumbrance === "light") {
              data.attributes.movement.walk = 20;
            } else if (encumbrance === "heavy"){
              data.attributes.movement.walk = 10;
            } else {   // encumbered beyond max carry
              data.attributes.movement.walk = 0;
            }
            break;
          case "metalmagic":
            if (encumbrance === "light") {
              data.attributes.movement.walk = 30;
            } else if (encumbrance === "heavy"){
              data.attributes.movement.walk = 20;
            } else {   // encumbered beyond max carry
              data.attributes.movement.walk = 0;
            }
            break;
          default:
            break;
        }
      }
      if (data.attributes.movement.walk === null) {
        if (encumbrance === "light"){
          data.attributes.movement.walk = 40;
        } else if (encumbrance === "heavy"){
          data.attributes.movement.walk = 30;
        } else {   // encumbered beyond max carry
          data.attributes.movement.walk = 0;
        }
      }
      data.attributes.movement.withdrawal = data.attributes.movement.walk / 2;
      data.attributes.movement.running = data.attributes.movement.walk * 2;
  }


    //------------------------------------------------------
    // Compute Armor Class
    let acBonus = 0;
    // Compute total acBonus of all equipped equipment items that have an armor value
    let armorItem = actorData.items.filter(i => i.type === "equipment" && i.data.equipped === true && i.data.armor.value != 0);
    for (let ACitem of armorItem){
      acBonus += ACitem.data.armor.value;
    }
    data.attributes.ac.value = 10 + acBonus +  data.abilities.dex.mod;   
    data.attributes.ac.rear = data.attributes.ac.value - 2;
    if (data.details.race == "halfling"){
      data.attributes.ac.vsL = data.attributes.ac.value + 2;
    } else {
      data.attributes.ac.vsL = data.attributes.ac.value;
    }

    //------------------------------------------------------
    // Class & Level Based Lookups
    let classitem = actorData.items.filter(i => i.type === "class");
    if (classitem.length > 0){

      // ====================
      // Saving Throws
      switch(classitem[0].name) { //The character class
        case "Cleric":
          data.saves.poison.base = bfrpg.Cleric_SAVING_THROW_TABLE[data.details.level - 1][0];
          data.saves.wands.base = bfrpg.Cleric_SAVING_THROW_TABLE[data.details.level - 1][1];
          data.saves.paralysis.base = bfrpg.Cleric_SAVING_THROW_TABLE[data.details.level - 1][2];
          data.saves.breath.base = bfrpg.Cleric_SAVING_THROW_TABLE[data.details.level - 1][3];
          data.saves.spells.base = bfrpg.Cleric_SAVING_THROW_TABLE[data.details.level - 1][4];
          break;
        case "Magic-User":
          data.saves.poison.base = bfrpg.MagicUser_SAVING_THROW_TABLE[data.details.level - 1][0];
          data.saves.wands.base = bfrpg.MagicUser_SAVING_THROW_TABLE[data.details.level - 1][1];
          data.saves.paralysis.base = bfrpg.MagicUser_SAVING_THROW_TABLE[data.details.level - 1][2];
          data.saves.breath.base = bfrpg.MagicUser_SAVING_THROW_TABLE[data.details.level - 1][3];
          data.saves.spells.base = bfrpg.MagicUser_SAVING_THROW_TABLE[data.details.level - 1][4];
          break;
        case "Fighter":
          data.saves.poison.base = bfrpg.Fighter_SAVING_THROW_TABLE[data.details.level - 1][0];
          data.saves.wands.base = bfrpg.Fighter_SAVING_THROW_TABLE[data.details.level - 1][1];
          data.saves.paralysis.base = bfrpg.Fighter_SAVING_THROW_TABLE[data.details.level - 1][2];
          data.saves.breath.base = bfrpg.Fighter_SAVING_THROW_TABLE[data.details.level - 1][3];
          data.saves.spells.base = bfrpg.Fighter_SAVING_THROW_TABLE[data.details.level - 1][4];
          break;
        case "Thief":
          data.saves.poison.base = bfrpg.Thief_SAVING_THROW_TABLE[data.details.level - 1][0];
          data.saves.wands.base = bfrpg.Thief_SAVING_THROW_TABLE[data.details.level - 1][1];
          data.saves.paralysis.base = bfrpg.Thief_SAVING_THROW_TABLE[data.details.level - 1][2];
          data.saves.breath.base = bfrpg.Thief_SAVING_THROW_TABLE[data.details.level - 1][3];
          data.saves.spells.base = bfrpg.Thief_SAVING_THROW_TABLE[data.details.level - 1][4];
          break;
        case "Fighter/Magic-User":
          data.saves.poison.base = bfrpg.FighterMagicUser_SAVING_THROW_TABLE[data.details.level - 1][0];
          data.saves.wands.base = bfrpg.FighterMagicUser_SAVING_THROW_TABLE[data.details.level - 1][1];
          data.saves.paralysis.base = bfrpg.FighterMagicUser_SAVING_THROW_TABLE[data.details.level - 1][2];
          data.saves.breath.base = bfrpg.FighterMagicUser_SAVING_THROW_TABLE[data.details.level - 1][3];
          data.saves.spells.base = bfrpg.FighterMagicUser_SAVING_THROW_TABLE[data.details.level - 1][4];
          break;
        case "Magic-User/Thief":
          data.saves.poison.base = bfrpg.MagicUserThief_SAVING_THROW_TABLE[data.details.level - 1][0];
          data.saves.wands.base = bfrpg.MagicUserThief_SAVING_THROW_TABLE[data.details.level - 1][1];
          data.saves.paralysis.base = bfrpg.MagicUserThief_SAVING_THROW_TABLE[data.details.level - 1][2];
          data.saves.breath.base = bfrpg.MagicUserThief_SAVING_THROW_TABLE[data.details.level - 1][3];
          data.saves.spells.base = bfrpg.MagicUserThief_SAVING_THROW_TABLE[data.details.level - 1][4];
          break;
        default:
          data.saves.poison.base = 20;
          data.saves.wands.base = 20;
          data.saves.paralysis.base = 20;
          data.saves.breath.base = 20;
          data.saves.spells.base = 20;
      } 
      switch(data.details.race) { //The character's race
        case "dwarf":
          data.saves.poison.racemod = bfrpg.saveModDwarf[0];
          data.saves.wands.racemod = bfrpg.saveModDwarf[1];
          data.saves.paralysis.racemod = bfrpg.saveModDwarf[2];
          data.saves.breath.racemod = bfrpg.saveModDwarf[3];
          data.saves.spells.racemod = bfrpg.saveModDwarf[4];
          break;
        case "elf":
          data.saves.poison.racemod = bfrpg.saveModElf[0];
          data.saves.wands.racemod = bfrpg.saveModElf[1];
          data.saves.paralysis.racemod = bfrpg.saveModElf[2];
          data.saves.breath.racemod = bfrpg.saveModElf[3];
          data.saves.spells.racemod = bfrpg.saveModElf[4];
          break;
        case "halfling":
          data.saves.poison.racemod = bfrpg.saveModHalfling[0];
          data.saves.wands.racemod = bfrpg.saveModHalfling[1];
          data.saves.paralysis.racemod = bfrpg.saveModHalfling[2];
          data.saves.breath.racemod = bfrpg.saveModHalfling[3];
          data.saves.spells.racemod = bfrpg.saveModHalfling[4];
          break;
        case "human":
          data.saves.poison.racemod = bfrpg.saveModHuman[0];
          data.saves.wands.racemod = bfrpg.saveModHuman[1];
          data.saves.paralysis.racemod = bfrpg.saveModHuman[2];
          data.saves.breath.racemod = bfrpg.saveModHuman[3];
          data.saves.spells.racemod = bfrpg.saveModHuman[4];
          break;
        default:
          data.saves.poison.racemod = 0;
          data.saves.wands.racemod = 0;
          data.saves.paralysis.racemod = 0;
          data.saves.breath.racemod = 0;
          data.saves.spells.racemod = 0;
      } 
      data.saves.poison.value = data.saves.poison.base - data.saves.poison.miscmod - data.saves.poison.racemod;
      data.saves.wands.value = data.saves.wands.base - data.saves.wands.miscmod - data.saves.wands.racemod;
      data.saves.paralysis.value = data.saves.paralysis.base - data.saves.paralysis.miscmod - data.saves.paralysis.racemod;
      data.saves.breath.value = data.saves.breath.base - data.saves.breath.miscmod - data.saves.breath.racemod;
      data.saves.spells.value = data.saves.spells.base - data.saves.spells.miscmod - data.saves.spells.racemod;
      // ====================

      // Saving Throw Bonuses
      data.savebonuses = [];        // Initialize the savebonuses array (it might not exist)
      data.savebonuses.length = 0;  // Clear the savebonuses array
      if (data.abilities.con.mod > 0) {
        data.savebonuses.push(`+${data.abilities.con.mod} vs. Poison`);
      } else if (data.abilities.con.mod < 0){
        data.savebonuses.push(`${data.abilities.con.mod} vs. Poison`);
      }
      if (data.abilities.int.mod > 0) {
        data.savebonuses.push(`+${data.abilities.int.mod} vs. Illusions`);
      } else if (data.abilities.int.mod < 0){
        data.savebonuses.push(`${data.abilities.int.mod} vs. Illusions`);
      }
      if (data.abilities.wis.mod > 0) {
        data.savebonuses.push(`+${data.abilities.wis.mod} vs. Charm/Mind Control`);
      } else if (data.abilities.wis.mod < 0){
        data.savebonuses.push(`${data.abilities.wis.mod} vs. Charm/Mind Control`);
      }


      // ====================
      // Attack Bonuses
      switch(classitem[0].name) { //The character class
        case "Cleric":
          data.attributes.AttackBonusMelee.base = bfrpg.Cleric_ATTACK_BONUS_TABLE[data.details.level - 1];
          data.attributes.AttackBonusRanged.base = bfrpg.Cleric_ATTACK_BONUS_TABLE[data.details.level - 1];
          break;
        case "Magic-User":
          data.attributes.AttackBonusMelee.base = bfrpg.MagicUser_ATTACK_BONUS_TABLE[data.details.level - 1];
          data.attributes.AttackBonusRanged.base = bfrpg.MagicUser_ATTACK_BONUS_TABLE[data.details.level - 1];
          break;
        case "Fighter":
          data.attributes.AttackBonusMelee.base = bfrpg.Fighter_ATTACK_BONUS_TABLE[data.details.level - 1];
          data.attributes.AttackBonusRanged.base = bfrpg.Fighter_ATTACK_BONUS_TABLE[data.details.level - 1];
          break;
        case "Thief":
          data.attributes.AttackBonusMelee.base = bfrpg.Thief_ATTACK_BONUS_TABLE[data.details.level - 1];
          data.attributes.AttackBonusRanged.base = bfrpg.Thief_ATTACK_BONUS_TABLE[data.details.level - 1];
          break;
        case "Fighter/Magic-User":
          data.attributes.AttackBonusMelee.base = bfrpg.FighterMagicUser_ATTACK_BONUS_TABLE[data.details.level - 1];
          data.attributes.AttackBonusRanged.base = bfrpg.FighterMagicUser_ATTACK_BONUS_TABLE[data.details.level - 1];
          break;
        case "Magic-User/Thief":
          data.attributes.AttackBonusMelee.base = bfrpg.MagicUserThief_ATTACK_BONUS_TABLE[data.details.level - 1];
          data.attributes.AttackBonusRanged.base = bfrpg.MagicUserThief_ATTACK_BONUS_TABLE[data.details.level - 1];
          break;
        default:
          data.attributes.AttackBonusMelee.base = 0;
          data.attributes.AttackBonusRanged.base = 0;
      } 
      switch(data.details.race) { //The character's race
        case "dwarf":
          data.attributes.AttackBonusRanged.racemod = 0;
          break;
        case "elf":
          data.attributes.AttackBonusRanged.racemod = 0;
          break;
        case "halfling":
          data.attributes.AttackBonusRanged.racemod = 1;
          break;
        case "human":
          data.attributes.AttackBonusRanged.racemod = 0;
          break;
        default:
          data.attributes.AttackBonusRanged.racemod = 0;
      } 
      data.attributes.AttackBonusMelee.value = data.attributes.AttackBonusMelee.base + data.attributes.AttackBonusMelee.miscmod;  // + data.abilities.str.mod;
      data.attributes.AttackBonusRanged.value = data.attributes.AttackBonusRanged.base + data.attributes.AttackBonusRanged.miscmod + data.attributes.AttackBonusRanged.racemod;  // + data.abilities.dex.mod;
      data.attributes.DamageBonus.value = data.attributes.DamageBonus.miscmod + data.abilities.str.mod;
      // ====================

      // ====================
      // Weapon & Armor Proficiencies
      switch(classitem[0].name) { //The character class
        case "Cleric":
          data.traits.weaponProf.value = ["blunt"];
          data.traits.armorProf.value = ["all"];
          break;
        case "Magic-User":
          data.traits.weaponProf.value = ["dagger"];
          data.traits.armorProf.value = ["none"];
          break;
        case "Fighter":
          data.traits.weaponProf.value = ["all"];
          data.traits.armorProf.value = ["all"];
          break;
        case "Thief":
          data.traits.weaponProf.value = ["all"];
          data.traits.armorProf.value = ["leather"];
          break;
        case "Fighter/Magic-User":
          data.traits.weaponProf.value = ["all"];
          data.traits.armorProf.value = ["all"];
          break;
        case "Magic-User/Thief":
          data.traits.weaponProf.value = ["all"];
          data.traits.armorProf.value = ["leather"];
          break;
        default:
          data.traits.weaponProf.value = [];
          data.traits.armorProf.value = [];
      }
      // ====================


      // ====================
      // Skills
      let i = 0;
      switch(classitem[0].name) { //The character class
        case "Cleric":
          for (let [id, abl] of Object.entries(data.classAbilities.turnUndead)) {
            abl.value = bfrpg.Cleric_TURN_UNDEAD_TABLE[data.details.level - 1][i];
            i ++;
          }
          i = 0;
        case "Thief":
          for (let [id, abl] of Object.entries(data.classAbilities.thiefSkills)) {
            abl.value = bfrpg.Thief_ABILITY_TABLE[data.details.level - 1][i];
            i ++;
          }
          i = 0;
        case "Magic-User/Thief":
          for (let [id, abl] of Object.entries(data.classAbilities.thiefSkills)) {
            abl.value = bfrpg.Thief_ABILITY_TABLE[data.details.level - 1][i];
            i ++;
          }
          i = 0;
        default:
          break;
      } 
      // ====================

      // ====================
      // Hit Dice
      switch(classitem[0].name) { //The character class
        case "Cleric":
          data.details.hitDice.value = bfrpg.Cleric_HIT_DICE[data.details.level - 1];
          break;
        case "Magic-User":
          data.details.hitDice.value = bfrpg.MagicUser_HIT_DICE[data.details.level - 1];
          break;
        case "Fighter":
          if (data.details.race == "elf" || data.details.race == "halfling"){
            data.details.hitDice.value = bfrpg.Fighter_Halfling_HIT_DICE[data.details.level - 1];
          }
          else {
            data.details.hitDice.value = bfrpg.Fighter_HIT_DICE[data.details.level - 1];
          }
          break;
        case "Thief":
          data.details.hitDice.value = bfrpg.Thief_HIT_DICE[data.details.level - 1];
          break;
        case "Fighter/Magic-User":
          data.details.hitDice.value = bfrpg.FighterMagicUser_HIT_DICE[data.details.level - 1];
          break;
        case "Magic-User/Thief":
          data.details.hitDice.value = bfrpg.MagicUserThief_HIT_DICE[data.details.level - 1];
          break;
        default:
          data.details.hitDice.value = "";
          break;
      } 
      data.details.hitDice.conmod = data.details.level * data.abilities.con.mod;
      // ====================

      // Character Sheet Alert Messages
      data.messages = [];        // Initialize the messages array (it might not exist)
      data.messages.length = 0;  // Clear the messages array
      if (data.details.xp.value >= data.details.xp.max) {
         data.messages.push("Level Up!");
      }
      switch(classitem[0].name) { //The character class
        case "Cleric":
          if (data.abilities.wis.value < 9) {
            data.messages.push("Cleric class not allowed. WIS must be > 8");
          }
          break;
        case "Magic-User":
          if (data.abilities.int.value < 9) {
            data.messages.push("Magic-User class not allowed. INT must be > 8");
          }
          break;
        case "Fighter":
          if (data.abilities.str.value < 9) {
            data.messages.push("Fighter class not allowed. STR must be > 8");
          }
          break;
        case "Thief":
          if (data.abilities.dex.value < 9) {
            data.messages.push("Thief class not allowed. DEX must be > 8");
          }
          break;
        case "Fighter/Magic-User":
          if (data.abilities.dex.value < 9) {
            data.messages.push("Fighter/Magic-User class not allowed. STR & INT must be >  8");
          }
          break;
        case "Magic-User/Thief":
          if (data.abilities.dex.value < 9) {
            data.messages.push("Magic-User/Thief class not allowed. INT & DEX must be > 8");
          }
          break;
        default:
          break;
      } 
      switch(data.details.race) { //The character's race
        case "dwarf":
          if (data.abilities.con.value < 9 || data.abilities.cha.value > 17) {
            data.messages.push("Dwarf race not allowed. CON must be > 8 and CHA must be < 18");
          }
          // ToDo weapon restrictions "No weapons over 4' in length for Dwarf"

          break;
        case "elf":
          if (data.abilities.int.value < 9 || data.abilities.con.value > 17) {
            data.messages.push("Elf race not allowed. INT must be > 8 and CON must be < 18");
          }
          break;
        case "halfling":
          if (data.abilities.dex.value < 9 || data.abilities.str.value > 17) {
            data.messages.push("Halfling race not allowed. DEX must be > 8 and STR must be < 18");
          }
          // ToDo weapon restrictions "Halflings cannot use L sized weapons."
          // ToDo weapon restrictions "M sized weapons require both hands for Halfling. Shield not allowed."

          break;
        case "human":
          break;
        default:
          break;
      } 

    }

  }


  /* -------------------------------------------- */

  /**
   * Return the amount of experience required to gain a certain character level.
   * @param level {Number}  The desired level
   * @return {Number}       The XP required
   */
  getLevelExp(level, charClass) {
    // const levels = CONFIG.bfrpg.CHARACTER_EXP_LEVELS;
    let levels = [];
    switch(charClass) { //The character class
      case "Cleric":
        levels = CONFIG.bfrpg.Cleric_EXP_LEVELS;
        break;
      case "Magic-User":
        levels = CONFIG.bfrpg.MagicUser_EXP_LEVELS;
        break;
      case "Fighter":
        levels = CONFIG.bfrpg.Fighter_EXP_LEVELS;
        break;
      case "Thief":
        levels = CONFIG.bfrpg.Thief_EXP_LEVELS;
        break;
      case "Fighter/Magic-User":
        levels = CONFIG.bfrpg.FighterMagicUser_EXP_LEVELS;
        break;
      case "Magic-User/Thief":
        levels = CONFIG.bfrpg.MagicUserThief_EXP_LEVELS;
        break;
      default:
    } 

    return levels[Math.min(level, levels.length - 1)];
  }

  /* -------------------------------------------- */

  /**
   * Return the amount of experience granted by killing a creature of a certain CR.
   * @param cr {Number}     The creature's challenge rating
   * @return {Number}       The amount of experience granted per kill
   */
  getCRExp(cr) {
    // if (cr < 1.0) return Math.max(200 * cr, 10);
    let crInt = Math.floor(cr);
    let crIntBonus = Math.floor((cr % 1) * 10);
    let xpReward = (CONFIG.bfrpg.HD_EXP_LEVELS[crInt] + (crIntBonus * CONFIG.bfrpg.HD_EXP_BONUS_LEVELS[crInt]));
    return xpReward;
  }

  /* -------------------------------------------- */

  /** @override */
  getRollData() {
    const data = super.getRollData();
    data.classes = this.data.items.reduce((obj, i) => {
      if ( i.type === "class" ) {
        obj[i.name.slugify({strict: true})] = i.data;
      }
      return obj;
    }, {});
    data.prof = this.data.data.attributes.prof || 0;
    return data;
  }

  /* -------------------------------------------- */

  /**
   * Return the features which a character is awarded for each class level
   * @param {string} className        The class name being added
   * @param {string} subclassName     The subclass of the class being added, if any
   * @param {number} level            The number of levels in the added class
   * @param {number} priorLevel       The previous level of the added class
   * @return {Promise<ItemBFRPG[]>}     Array of ItemBFRPG entities
   */
  static async getClassFeatures({className="", subclassName="", level=1, priorLevel=0}={}) {
    className = className.toLowerCase();
    subclassName = subclassName.slugify();

    // Get the configuration of features which may be added
    const clsConfig = CONFIG.bfrpg.classFeatures[className];
    if (!clsConfig) return [];

    // Acquire class features
    let ids = [];
    for ( let [l, f] of Object.entries(clsConfig.features || {}) ) {
      l = parseInt(l);
      if ( (l <= level) && (l > priorLevel) ) ids = ids.concat(f);
    }

    // Acquire subclass features
    const subConfig = clsConfig.subclasses[subclassName] || {};
    for ( let [l, f] of Object.entries(subConfig.features || {}) ) {
      l = parseInt(l);
      if ( (l <= level) && (l > priorLevel) ) ids = ids.concat(f);
    }

    // Load item data for all identified features
    const features = await Promise.all(ids.map(id => fromUuid(id)));

    // Class spells should always be prepared
    for ( const feature of features ) {
      if ( feature.type === "spell" ) {
        const preparation = feature.data.data.preparation;
        preparation.mode = "always";
        preparation.prepared = true;
      }
    }
    return features;
  }

  /* -------------------------------------------- */

  /** @override */
  async updateEmbeddedEntity(embeddedName, data, options={}) {
    const createItems = embeddedName === "OwnedItem" ? await this._createClassFeatures(data) : [];
    let updated = await super.updateEmbeddedEntity(embeddedName, data, options);
    if ( createItems.length ) await this.createEmbeddedEntity("OwnedItem", createItems);
    return updated;
  }

  /* -------------------------------------------- */

  /**
   * Create additional class features in the Actor when a class item is updated.
   * @private
   */
  async _createClassFeatures(updated) {
    let toCreate = [];
    for (let u of updated instanceof Array ? updated : [updated]) {
      const item = this.items.get(u._id);
      if (!item || (item.data.type !== "class")) continue;
      const updateData = expandObject(u);
      const config = {
        className: updateData.name || item.data.name,
        subclassName: updateData.data.subclass || item.data.data.subclass,
        level: getProperty(updateData, "data.levels"),
        priorLevel: item ? item.data.data.levels : 0
      }

      // Get and create features for an increased class level
      let changed = false;
      if ( config.level && (config.level > config.priorLevel)) changed = true;
      if ( config.subclassName !== item.data.data.subclass ) changed = true;

      // Get features to create
      if ( changed ) {
        const existing = new Set(this.items.map(i => i.name));
        const features = await ActorBFRPG.getClassFeatures(config);
        for ( let f of features ) {
          if ( !existing.has(f.name) ) toCreate.push(f);
        }
      }
    }
    return toCreate
  }

  /* -------------------------------------------- */
  /*  Data Preparation Helpers                    */
  /* -------------------------------------------- */

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;

    // Determine character level and available hit dice based on owned Class items
    const [level, hd] = actorData.items.reduce((arr, item) => {
      if ( item.type === "class" ) {
        const classLevels = parseInt(item.data.levels) || 1;
        arr[0] += classLevels;
        arr[1] += classLevels - (parseInt(item.data.hitDiceUsed) || 0);
      }
      return arr;
    }, [0, 0]);
    data.details.level = level;
    data.attributes.hd = hd;

    // Character proficiency bonus
    data.attributes.prof = Math.floor((level + 7) / 4);

    let classitem = actorData.items.filter(i => i.type === "class");
    if (classitem.length > 0){
      let charClass = classitem[0].name;

      // Experience required for next level
      const xp = data.details.xp;
      xp.max = this.getLevelExp(level || 1, charClass);
      const prior = this.getLevelExp(level - 1 || 0, charClass);
      const required = xp.max - prior;
      const pct = Math.round((xp.value - prior) * 100 / required);
      xp.pct = Math.clamped(pct, 0, 100);
    }
  }

  /* -------------------------------------------- */

  /**
   * Prepare NPC type specific data
   */
  _prepareNPCData(actorData) {
    const data = actorData.data;

    // Kill Experience
    data.details.xp.value = this.getCRExp(data.details.cr);

    // Proficiency
    data.attributes.prof = Math.floor((Math.max(data.details.cr, 1) + 7) / 4);

    // Spellcaster Level
    if ( data.attributes.spellcasting && !Number.isNumeric(data.details.spellLevel) ) {
      data.details.spellLevel = Math.max(data.details.cr, 1);
    }

    // ====================
    // BFRPG Mods
    // ====================

    // Ability Modifiers
    for (let [id, abl] of Object.entries(data.abilities)) {
      abl.mod = bfrpg.abilityModifierTable[abl.value - 1];
    }

    // Attack Bonuses
    data.attributes.AttackBonusMelee.value = data.attributes.AttackBonus.value;  // + data.abilities.str.mod;
    data.attributes.AttackBonusRanged.value = data.attributes.AttackBonus.value;  // + data.abilities.dex.mod;

    // Saving Throws
    switch(data.attributes.SaveClass) { //The NPC "Save As" Class
      case "cleric":
        data.saves.poison.value = bfrpg.Cleric_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][0];
        data.saves.wands.value = bfrpg.Cleric_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][1];
        data.saves.paralysis.value = bfrpg.Cleric_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][2];
        data.saves.breath.value = bfrpg.Cleric_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][3];
        data.saves.spells.value = bfrpg.Cleric_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][4];
        break;
      case "magicuser":
        data.saves.poison.value = bfrpg.MagicUser_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][0];
        data.saves.wands.value = bfrpg.MagicUser_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][1];
        data.saves.paralysis.value = bfrpg.MagicUser_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][2];
        data.saves.breath.value = bfrpg.MagicUser_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][3];
        data.saves.spells.value = bfrpg.MagicUser_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][4];
        break;
      case "fighter":
        data.saves.poison.value = bfrpg.Fighter_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][0];
        data.saves.wands.value = bfrpg.Fighter_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][1];
        data.saves.paralysis.value = bfrpg.Fighter_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][2];
        data.saves.breath.value = bfrpg.Fighter_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][3];
        data.saves.spells.value = bfrpg.Fighter_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][4];
        break;
      case "thief":
        data.saves.poison.value = bfrpg.Thief_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][0];
        data.saves.wands.value = bfrpg.Thief_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][1];
        data.saves.paralysis.value = bfrpg.Thief_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][2];
        data.saves.breath.value = bfrpg.Thief_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][3];
        data.saves.spells.value = bfrpg.Thief_SAVING_THROW_TABLE[data.attributes.SaveLevel.value - 1][4];
        break;
      default:
        data.saves.poison.value = 20;
        data.saves.wands.value = 20;
        data.saves.paralysis.value = 20;
        data.saves.breath.value = 20;
        data.saves.spells.value = 20;
    } 

    // Initiative
    //data.attributes.init.prof = 0;
    data.attributes.init.mod = 0;
    data.attributes.init.bonus = data.abilities.dex.mod;
    data.attributes.init.value = data.attributes.init.bonus + data.attributes.init.mod;
    data.attributes.init.total = data.attributes.init.value;


  }

  /* -------------------------------------------- */

  /**
   * Prepare vehicle type-specific data
   * @param actorData
   * @private
   */
  _prepareVehicleData(actorData) {}

  /* -------------------------------------------- */

  /**
   * Prepare skill checks.
   * @param actorData
   * @param bonuses Global bonus data.
   * @param checkBonus Ability check specific bonus.
   * @param originalSkills A transformed actor's original actor's skills.
   * @private
   */
  _prepareSkills(actorData, bonuses, checkBonus, originalSkills) {
    if (actorData.type === 'vehicle') return;

    const data = actorData.data;
    const flags = actorData.flags.bfrpg || {};

    // Skill modifiers
    const feats = bfrpg.characterFlags;
    const athlete = flags.remarkableAthlete;
    const joat = flags.jackOfAllTrades;
    const observant = flags.observantFeat;
    const skillBonus = Number.isNumeric(bonuses.skill) ? parseInt(bonuses.skill) :  0;
    let round = Math.floor;
    for (let [id, skl] of Object.entries(data.skills)) {
      skl.value = parseFloat(skl.value || 0);

      // Apply Remarkable Athlete or Jack of all Trades
      let multi = skl.value;
      if ( athlete && (skl.value === 0) && feats.remarkableAthlete.abilities.includes(skl.ability) ) {
        multi = 0.5;
        round = Math.ceil;
      }
      if ( joat && (skl.value === 0 ) ) multi = 0.5;

      // Retain the maximum skill proficiency when skill proficiencies are merged
      if ( originalSkills ) {
        skl.value = Math.max(skl.value, originalSkills[id].value);
      }

      // Compute modifier
      skl.bonus = checkBonus + skillBonus;
      skl.mod = data.abilities[skl.ability].mod;
      skl.prof = round(multi * data.attributes.prof);
      skl.total = skl.mod + skl.prof + skl.bonus;

      // Compute passive bonus
      const passive = observant && (feats.observantFeat.skills.includes(id)) ? 5 : 0;
      skl.passive = 10 + skl.total + passive;
    }
  }

  /* -------------------------------------------- */

  /**
   * Compute the spellcasting DC for all item abilities which use spell DC scaling
   * @param {object} actorData    The actor data being prepared
   * @private
   */
  _computeSpellcastingDC(actorData) {

    // Compute the spellcasting DC
    const data = actorData.data;
    data.attributes.spelldc = data.attributes.spellcasting ? data.abilities[data.attributes.spellcasting].dc : 10;

    // Apply spellcasting DC to any spell items which use it
    for ( let i of this.items ) {
      const save = i.data.data.save;
      if ( save?.ability ) {
        if ( save.scaling === "spell" ) save.dc = data.attributes.spelldc;
        else if ( save.scaling !== "flat" ) save.dc = data.abilities[save.scaling]?.dc ?? 10;
        const ability = CONFIG.bfrpg.abilities[save.ability];
        i.labels.save = game.i18n.format("bfrpg.SaveDC", {dc: save.dc || "", ability});
      }
    }
  }

  /* -------------------------------------------- */

  /**
   * Prepare data related to the spell-casting capabilities of the Actor
   * @private
   */
  _computeSpellcastingProgression (actorData) {
    if (actorData.type === 'vehicle') return;
    const spells = actorData.data.spells;
    const isNPC = actorData.type === 'npc';

    // Translate the list of classes into spell-casting progression
    const progression = {
      total: 0,
      slot: 0,
      pact: 0
    };

    // Keep track of the last seen caster in case we're in a single-caster situation.
    let caster = null;

    // Tabulate the total spell-casting progression
    const classes = this.data.items.filter(i => i.type === "class");
    for ( let cls of classes ) {
      const d = cls.data;
      if ( d.spellcasting === "none" ) continue;
      const levels = d.levels;
      const prog = d.spellcasting;

      // Accumulate levels
      if ( prog !== "pact" ) {
        caster = cls;
        progression.total++;
      }
      switch (prog) {
        case 'third': progression.slot += Math.floor(levels / 3); break;
        case 'half': progression.slot += Math.floor(levels / 2); break;
        case 'full': progression.slot += levels; break;
        case 'artificer': progression.slot += Math.ceil(levels / 2); break;
        case 'pact': progression.pact += levels; break;
      }
    }

    // EXCEPTION: single-classed non-full progression rounds up, rather than down
    const isSingleClass = (progression.total === 1) && (progression.slot > 0);
    if (!isNPC && isSingleClass && ['half', 'third'].includes(caster.data.spellcasting) ) {
      const denom = caster.data.spellcasting === 'third' ? 3 : 2;
      progression.slot = Math.ceil(caster.data.levels / denom);
    }

    // EXCEPTION: NPC with an explicit spell-caster level
    if (isNPC && actorData.data.details.spellLevel) {
      progression.slot = actorData.data.details.spellLevel;
    }

    // Look up the number of slots per level from the progression table
    const levels = Math.clamped(progression.slot, 0, 20);
    //const slots = bfrpg.SPELL_SLOT_TABLE[levels - 1] || [];
    let slots = [];
    
    let classitem = actorData.items.filter(i => i.type === "class");
    if (classitem.length > 0){
      switch(classitem[0].name) { //The character class
      case "Cleric":
        slots = bfrpg.Cleric_SPELL_SLOT_TABLE[levels - 1] || [];
        break;
      case "Magic-User":
        slots = bfrpg.MagicUser_SPELL_SLOT_TABLE[levels - 1] || [];
        break;
      case "Fighter":
        slots = [];
        break;
      case "Thief":
        slots = [];
        break;
      case "Fighter/Magic-User":
        slots = bfrpg.FighterMagicUser_SPELL_SLOT_TABLE[levels - 1] || [];
        break;
      case "Magic-User/Thief":
        slots = bfrpg.MagicUserThief_SPELL_SLOT_TABLE[levels - 1] || [];
        break;
      default:
      }
    }  

    for ( let [n, lvl] of Object.entries(spells) ) {
      let i = parseInt(n.slice(-1));
      if ( Number.isNaN(i) ) continue;
      if ( Number.isNumeric(lvl.override) ) lvl.max = Math.max(parseInt(lvl.override), 1);
      else lvl.max = slots[i-1] || 0;
      lvl.value = Math.min(parseInt(lvl.value), lvl.max);
    }

    // Determine the Actor's pact magic level (if any)
    let pl = Math.clamped(progression.pact, 0, 20);
    spells.pact = spells.pact || {};
    if ( (pl === 0) && isNPC && Number.isNumeric(spells.pact.override) ) pl = actorData.data.details.spellLevel;

    // Determine the number of Warlock pact slots per level
    if ( pl > 0) {
      spells.pact.level = Math.ceil(Math.min(10, pl) / 2);
      if ( Number.isNumeric(spells.pact.override) ) spells.pact.max = Math.max(parseInt(spells.pact.override), 1);
      else spells.pact.max = Math.max(1, Math.min(pl, 2), Math.min(pl - 8, 3), Math.min(pl - 13, 4));
      spells.pact.value = Math.min(spells.pact.value, spells.pact.max);
    } else {
      spells.pact.max = parseInt(spells.pact.override) || 0
      spells.pact.level = spells.pact.max > 0 ? 1 : 0;
    }
  }

  /* -------------------------------------------- */

  /**
   * Compute the level and percentage of encumbrance for an Actor.
   *
   * Optionally include the weight of carried currency across all denominations by applying the standard rule
   * from the PHB pg. 143
   * @param {Object} actorData      The data object for the Actor being rendered
   * @returns {{max: number, value: number, pct: number}}  An object describing the character's encumbrance level
   * @private
   */
  _computeEncumbrance(actorData) {

    // Get the total weight from items
    const physicalItems = ["weapon", "equipment", "consumable", "tool", "backpack", "loot"];
    let weight = actorData.items.reduce((weight, i) => {
      if ( !physicalItems.includes(i.type) ) return weight;
      const q = i.data.quantity || 0;
      const w = i.data.weight || 0;
      return weight + (q * w);
    }, 0);

    // [Optional] add Currency Weight
    if ( game.settings.get("bfrpg", "currencyWeight") ) {
      const currency = actorData.data.currency;
      const numCoins = Object.values(currency).reduce((val, denom) => val += Math.max(denom, 0), 0);
      weight += numCoins / CONFIG.bfrpg.encumbrance.currencyPerWeight;
    }

    // Determine the encumbrance size class
    let mod = {
      tiny: 0.5,
      sm: 1,
      med: 1,
      lg: 2,
      huge: 4,
      grg: 8
    }[actorData.data.traits.size] || 1;
    if ( this.getFlag("bfrpg", "powerfulBuild") ) mod = Math.min(mod * 2, 8);

    // Compute Encumbrance percentage
    weight = weight.toNearest(0.1);
    //const max = actorData.data.abilities.str.value * CONFIG.bfrpg.encumbrance.strMultiplier * mod;
    let max = 0;
    let threshold = 0;
    if ( actorData.data.details.race == "halfling" ) {
      max = bfrpg.encumbranceHeavyHalfling[actorData.data.abilities.str.value - 1];
      threshold = bfrpg.encumbranceLightHalfling[actorData.data.abilities.str.value - 1];
    } else {
      max = bfrpg.encumbranceHeavy[actorData.data.abilities.str.value - 1];
      threshold = bfrpg.encumbranceLight[actorData.data.abilities.str.value - 1];
    }
    const pct = Math.clamped((weight * 100) / max, 0, 100);
    return { value: weight, max, pct, encumbered: weight > threshold, threshold };
    //return { value: weight.toNearest(0.1), max, pct, encumbered: pct > (2/3) };
  }

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers
  /* -------------------------------------------- */

  /** @override */
  static async create(data, options={}) {
    data.token = data.token || {};
    if ( data.type === "character" ) {
      mergeObject(data.token, {
        vision: true,
        dimSight: 30,
        brightSight: 0,
        actorLink: true,
        disposition: 1
      }, {overwrite: false});
    }
    return super.create(data, options);
  }

  /* -------------------------------------------- */

  /** @override */
  async update(data, options={}) {

    // Apply changes in Actor size to Token width/height
    const newSize = getProperty(data, "data.traits.size");
    if ( newSize && (newSize !== getProperty(this.data, "data.traits.size")) ) {
      let size = CONFIG.bfrpg.tokenSizes[newSize];
      if ( this.isToken ) this.token.update({height: size, width: size});
      else if ( !data["token.width"] && !hasProperty(data, "token.width") ) {
        data["token.height"] = size;
        data["token.width"] = size;
      }
    }

    // Reset death save counters
    if ( (this.data.data.attributes.hp.value <= 0) && (getProperty(data, "data.attributes.hp.value") > 0) ) {
      setProperty(data, "data.attributes.death.success", 0);
      setProperty(data, "data.attributes.death.failure", 0);
    }

    // Perform the update
    return super.update(data, options);
  }

  /* -------------------------------------------- */

  /** @override */
  async createOwnedItem(itemData, options) {

    // Assume NPCs are always proficient with weapons and always have spells prepared
//    if ( !this.isPC ) {
    if ( !this.hasPlayerOwner ) {
      let t = itemData.type;
      let initial = {};
      if ( t === "weapon" ) initial["data.proficient"] = true;
      if ( ["weapon", "equipment"].includes(t) ) initial["data.equipped"] = true;
      if ( t === "spell" ) initial["data.prepared"] = true;
      mergeObject(itemData, initial);
    }
    return super.createOwnedItem(itemData, options);
  }


  /* -------------------------------------------- */
  /*  Gameplay Mechanics                          */
  /* -------------------------------------------- */

  /** @override */
  async modifyTokenAttribute(attribute, value, isDelta, isBar) {
    if ( attribute === "attributes.hp" ) {
      const hp = getProperty(this.data.data, attribute);
      const delta = isDelta ? (-1 * value) : (hp.value + hp.temp) - value;
      return this.applyDamage(delta);
    }
    return super.modifyTokenAttribute(attribute, value, isDelta, isBar);
  }

  /* -------------------------------------------- */

  /**
   * Apply a certain amount of damage or healing to the health pool for Actor
   * @param {number} amount       An amount of damage (positive) or healing (negative) to sustain
   * @param {number} multiplier   A multiplier which allows for resistance, vulnerability, or healing
   * @return {Promise<Actor>}     A Promise which resolves once the damage has been applied
   */
  async applyDamage(amount=0, multiplier=1) {
    amount = Math.floor(parseInt(amount) * multiplier);
    const hp = this.data.data.attributes.hp;

    // Deduct damage from temp HP first
    const tmp = parseInt(hp.temp) || 0;
    const dt = amount > 0 ? Math.min(tmp, amount) : 0;

    // Remaining goes to health
    const tmpMax = parseInt(hp.tempmax) || 0;
    const dh = Math.clamped(hp.value - (amount - dt), 0, hp.max + tmpMax);

    // Update the Actor
    const updates = {
      "data.attributes.hp.temp": tmp - dt,
      "data.attributes.hp.value": dh
    };
    return this.update(updates);
  }

  /* -------------------------------------------- */

  /**
   * Cast a Spell, consuming a spell slot of a certain level
   * @param {ItemBFRPG} item   The spell being cast by the actor
   * @param {Event} event   The originating user interaction which triggered the cast
   */
  async useSpell(item, {configureDialog=true}={}) {
    if ( item.data.type !== "spell" ) throw new Error("Wrong Item type");
    const itemData = item.data.data;

    // Configure spellcasting data
    let lvl = itemData.level;
    const usesSlots = (lvl > 0) && CONFIG.bfrpg.spellUpcastModes.includes(itemData.preparation.mode);
    const limitedUses = !!itemData.uses.per;
    let consumeSlot = `spell${lvl}`;
    let consumeUse = false;
    let placeTemplate = false;

    // Configure spell slot consumption and measured template placement from the form
    if ( configureDialog && (usesSlots || item.hasAreaTarget || limitedUses) ) {
      const usage = await AbilityUseDialog.create(item);
      if ( usage === null ) return;

      // Determine consumption preferences
      consumeSlot = Boolean(usage.get("consumeSlot"));
      consumeUse = Boolean(usage.get("consumeUse"));
      placeTemplate = Boolean(usage.get("placeTemplate"));

      // Determine the cast spell level
      const isPact = usage.get('level') === 'pact';
      const lvl = isPact ? this.data.data.spells.pact.level : parseInt(usage.get("level"));
      if ( lvl !== item.data.data.level ) {
        const upcastData = mergeObject(item.data, {"data.level": lvl}, {inplace: false});
        item = item.constructor.createOwned(upcastData, this);
      }

      // Denote the spell slot being consumed
      if ( consumeSlot ) consumeSlot = isPact ? "pact" : `spell${lvl}`;
    }

    // Update Actor data
    if ( usesSlots && consumeSlot && (lvl > 0) ) {
      const slots = parseInt(this.data.data.spells[consumeSlot]?.value);
      if ( slots === 0 || Number.isNaN(slots) ) {
        return ui.notifications.error(game.i18n.localize("bfrpg.SpellCastNoSlots"));
      }
      await this.update({
        [`data.spells.${consumeSlot}.value`]: Math.max(slots - 1, 0)
      });
    }

    // Update Item data
    if ( limitedUses && consumeUse ) {
      const uses = parseInt(itemData.uses.value || 0);
      if ( uses <= 0 ) ui.notifications.warn(game.i18n.format("bfrpg.ItemNoUses", {name: item.name}));
      await item.update({"data.uses.value": Math.max(parseInt(item.data.data.uses.value || 0) - 1, 0)})
    }

    // Initiate ability template placement workflow if selected
    if ( placeTemplate && item.hasAreaTarget ) {
      const template = AbilityTemplate.fromItem(item);
      if ( template ) template.drawPreview();
      if ( this.sheet.rendered ) this.sheet.minimize();
    }

    // Invoke the Item roll
    return item.roll();
  }

  /* -------------------------------------------- */

  /**
   * Roll a Skill Check
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {string} skillId      The skill id (e.g. "ins")
   * @param {Object} options      Options which configure how the skill check is rolled
   * @return {Promise<Roll>}      A Promise which resolves to the created Roll instance
   */
  rollSkill(skillId, options={}) {
    const skl = this.data.data.skills[skillId];
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};

    // Compose roll parts and data
    const parts = ["@mod"];
    const data = {mod: skl.mod + skl.prof};

    // Ability test bonus
    if ( bonuses.check ) {
      data["checkBonus"] = bonuses.check;
      parts.push("@checkBonus");
    }

    // Skill check bonus
    if ( bonuses.skill ) {
      data["skillBonus"] = bonuses.skill;
      parts.push("@skillBonus");
    }

    // Add provided extra roll parts now because they will get clobbered by mergeObject below
    if (options.parts?.length > 0) {
      parts.push(...options.parts);
    }

    // Reliable Talent applies to any skill check we have full or better proficiency in
    const reliableTalent = (skl.value >= 1 && this.getFlag("bfrpg", "reliableTalent"));

    // Roll and return
    const rollData = mergeObject(options, {
      parts: parts,
      data: data,
      title: game.i18n.format("bfrpg.SkillPromptTitle", {skill: CONFIG.bfrpg.skills[skillId]}),
      halflingLucky: this.getFlag("bfrpg", "halflingLucky"),
      reliableTalent: reliableTalent,
      fastForward: true,
      messageData: {"flags.bfrpg.roll": {type: "skill", skillId }}
    });
    rollData.speaker = options.speaker || ChatMessage.getSpeaker({actor: this});
    return d20Roll(rollData);
  }

  /* -------------------------------------------- */

  /**
   * Roll a generic ability test or saving throw.
   * Prompt the user for input on which variety of roll they want to do.
   * @param {String}abilityId     The ability id (e.g. "str")
   * @param {Object} options      Options which configure how ability tests or saving throws are rolled
   */
  rollAbility(abilityId, options={}) {
  /*  const label = CONFIG.bfrpg.abilities[abilityId];
    new Dialog({
      title: game.i18n.format("bfrpg.AbilityPromptTitle", {ability: label}),
      content: `<p>${game.i18n.format("bfrpg.AbilityPromptText", {ability: label})}</p>`,
      buttons: {
        test: {
          label: game.i18n.localize("bfrpg.ActionAbil"),
          callback: () => this.rollAbilityTest(abilityId, options)
        },
        save: {
          label: game.i18n.localize("bfrpg.ActionSave"),
          callback: () => this.rollAbilitySave(abilityId, options)
        }
      }
    }).render(true); */
    this.rollAbilityTest(abilityId, options);
  }

  /* -------------------------------------------- */

  /**
   * Roll an Ability Test
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {String} abilityId    The ability ID (e.g. "str")
   * @param {Object} options      Options which configure how ability tests are rolled
   * @return {Promise<Roll>}      A Promise which resolves to the created Roll instance
   */
  rollAbilityTest(abilityId, options={}) {
    const label = CONFIG.bfrpg.abilities[abilityId];
    const abl = this.data.data.abilities[abilityId];

    // Construct parts
    const parts = ["@mod"];
    const data = {mod: abl.mod};

    // Add feat-related proficiency bonuses
    const feats = this.data.flags.bfrpg || {};
    if ( feats.remarkableAthlete && bfrpg.characterFlags.remarkableAthlete.abilities.includes(abilityId) ) {
      parts.push("@proficiency");
      data.proficiency = Math.ceil(0.5 * this.data.data.attributes.prof);
    }
    else if ( feats.jackOfAllTrades ) {
      parts.push("@proficiency");
      data.proficiency = Math.floor(0.5 * this.data.data.attributes.prof);
    }

    // Add global actor bonus
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};
    if ( bonuses.check ) {
      parts.push("@checkBonus");
      data.checkBonus = bonuses.check;
    }

    // Add provided extra roll parts now because they will get clobbered by mergeObject below
    if (options.parts?.length > 0) {
      parts.push(...options.parts);
    }

    // Roll and return
    const rollData = mergeObject(options, {
      parts: parts,
      data: data,
      title: game.i18n.format("bfrpg.AbilityPromptTitle", {ability: label, target: this.data.data.attributes.checkTarget}),
      halflingLucky: feats.halflingLucky,
      fastForward: true,
      messageData: {"flags.bfrpg.roll": {type: "ability", abilityId }}
    });
    rollData.speaker = options.speaker || ChatMessage.getSpeaker({actor: this});
    return d20Roll(rollData);
  }

  /* -------------------------------------------- */

  /**
   * Roll an Ability Saving Throw
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {String} abilityId    The ability ID (e.g. "str")
   * @param {Object} options      Options which configure how ability tests are rolled
   * @return {Promise<Roll>}      A Promise which resolves to the created Roll instance
   */
  rollAbilitySave(saveId, options={}) {
    const label = CONFIG.bfrpg.saves[saveId];
    const save = this.data.data.saves[saveId];

    // Construct parts
    /*
    const parts = ["@mod"];
    const data = {mod: save.miscmod};
    */
   const parts = [];
   const data = {};


    // Include proficiency bonus
    if ( save.prof > 0 ) {
      parts.push("@prof");
      data.prof = save.prof;
    }

    // Include a global actor ability save bonus
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};
    if ( bonuses.save ) {
      parts.push("@saveBonus");
      data.saveBonus = bonuses.save;
    }

    // Add provided extra roll parts now because they will get clobbered by mergeObject below
    if (options.parts?.length > 0) {
      parts.push(...options.parts);
    }

    // Roll and return
    const rollData = mergeObject(options, {
      parts: parts,
      data: data,
      title: game.i18n.format("bfrpg.SavePromptTitle", {ability: label, target: save.value}),
      halflingLucky: this.getFlag("bfrpg", "halflingLucky"),
      fastForward: true,
      messageData: {"flags.bfrpg.roll": {type: "save", saveId }}
    });
    rollData.speaker = options.speaker || ChatMessage.getSpeaker({actor: this});
    return d20Roll(rollData);
  }

  /* -------------------------------------------- */

  /**
   * Roll a Thief Skill Check percentile die
   * @param {String} thiefSkillId    The thief skill ID (e.g. "hide")
   * @param {Object} options      Options which configure how check are rolled
   * @return {Promise<Roll>}      A Promise which resolves to the created Roll instance
   */
  async rollThiefSkill(thiefSkillId, options={}) {
    const label = CONFIG.bfrpg.thiefSkills[thiefSkillId];
    const skill = this.data.data.classAbilities.thiefSkills[thiefSkillId];

    // Call the roll helper utility
    const roll = await damageRoll({
      event: new Event("thiefSkill"),
      parts: [`1d100`],
      data: duplicate(this.data.data),
      title: game.i18n.format("bfrpg.ThiefSkillPromptTitle", {thiefSkill: label, target: skill.value}),
      speaker: ChatMessage.getSpeaker({actor: this}),
      rollMode: "blindroll",  //"roll": all players & GM, "gmroll": player & GM, "blindroll": GM only, "selfroll": player only
      allowcritical: false,
      fastForward: true,
      dialogOptions: {width: 350},
      messageData: {"flags.bfrpg.roll": {type: "thiefSkill", thiefSkillId }}
    });
    if ( !roll ) return null;
    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Roll Turn Undead Check 1d20 roll for check, then 2d6 for HD affected
   * @param {String} turnUndeadId    The turn ID (e.g. "zombie")
   * @param {Object} options      Options which configure how check are rolled
   * @return {Promise<Roll>}      A Promise which resolves to the created Roll instance
   */
  async rollTurnUndead(turnUndeadId, options={}) {
    const label = CONFIG.bfrpg.turnUndead[turnUndeadId];
    const skill = this.data.data.classAbilities.turnUndead[turnUndeadId];

    // Call the roll helper utility for the d20 Turn Undead Check
    const roll = await damageRoll({
      event: new Event("turnUndead"),
      parts: [`1d20`],
      data: duplicate(this.data.data),
      title: game.i18n.format("bfrpg.TurnUndeadPromptTitle", {undeadType: label, target: skill.value}),
      speaker: ChatMessage.getSpeaker({actor: this}),
      rollMode: "roll",  //"roll": all players & GM, "gmroll": player & GM, "blindroll": GM only, "selfroll": player only
      allowcritical: false,
      fastForward: true,
      dialogOptions: {width: 350},
      messageData: {"flags.bfrpg.roll": {type: "turnUndead", turnUndeadId }}
    });

    // Call the roll helper utility for the 2d6 Turn Undead - Hit Dice Affected
    const roll_supplemtary = await damageRoll({
      event: new Event("turnUndeadAffected"),
      parts: [`2d6`],
      data: duplicate(this.data.data),
      title: game.i18n.format("bfrpg.TurnUndeadAffected"),
      speaker: ChatMessage.getSpeaker({actor: this}),
      rollMode: "blindroll",  //"roll": all players & GM, "gmroll": player & GM, "blindroll": GM only, "selfroll": player only
      allowcritical: false,
      fastForward: true,
      dialogOptions: {width: 350},
      messageData: {"flags.bfrpg.roll": {type: "turnUndeadAffected", turnUndeadId }}
    });
    if ( !roll ) return null;
    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Roll a Morale Check 2d6
   * @param {String} rolltype     TBD
   * @param {Object} options      Options which configure how check are rolled
   * @return {Promise<Roll>}      A Promise which resolves to the created Roll instance
   */
  async rollMorale(rolltype, options={}) {
    const morale = this.data.data.attributes.Morale;

    // Call the roll helper utility
    const roll = await damageRoll({
      event: new Event("morale"),
      parts: [`2d6`],
      data: duplicate(this.data.data),
      title: game.i18n.format("bfrpg.MoraleCheckPromptTitle", {target: morale.value}),
      speaker: ChatMessage.getSpeaker({actor: this}),
      rollMode: "blindroll",  //"roll": all players & GM, "gmroll": player & GM, "blindroll": GM only, "selfroll": player only
      allowcritical: false,
      fastForward: true,
      dialogOptions: {width: 350},
      messageData: {"flags.bfrpg.roll": {type: "morale"}}
    });
    if ( !roll ) return null;
    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Level Up the character
   * @param {Object} options        Additional options which modify the roll
   * @return {Promise<Roll|null>}   A Promise which resolves to the Roll instance
   */
  async LevelUp(options={}) {
    if (this.data.data.details.xp.value > this.data.data.details.xp.max) {
      let classIndex = this.data.items.findIndex(i => i.type === "class");
      let classLevel = this.data.items[classIndex].data.levels;
      classLevel++;
      const itemId = this.data.items[classIndex]._id;
      await this.updateEmbeddedEntity("OwnedItem", {_id: itemId, data: {levels: classLevel}});
    }
  }


  /* -------------------------------------------- */


  /**
   * Perform a death saving throw, rolling a d20 plus any global save bonuses
   * @param {Object} options        Additional options which modify the roll
   * @return {Promise<Roll|null>}   A Promise which resolves to the Roll instance
   */
  async rollDeathSave(options={}) {

    // Display a warning if we are not at zero HP or if we already have reached 3
    const death = this.data.data.attributes.death;
    if ( (this.data.data.attributes.hp.value > 0) || (death.failure >= 3) || (death.success >= 3)) {
      ui.notifications.warn(game.i18n.localize("bfrpg.DeathSaveUnnecessary"));
      return null;
    }

    // Evaluate a global saving throw bonus
    const parts = [];
    const data = {};
    const speaker = options.speaker || ChatMessage.getSpeaker({actor: this});

    // Diamond Soul adds proficiency
    if ( this.getFlag("bfrpg", "diamondSoul") ) {
      parts.push("@prof");
      data.prof = this.data.data.attributes.prof;
    }

    // Include a global actor ability save bonus
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};
    if ( bonuses.save ) {
      parts.push("@saveBonus");
      data.saveBonus = bonuses.save;
    }

    // Evaluate the roll
    const rollData = mergeObject(options, {
      parts: parts,
      data: data,
      title: game.i18n.localize("bfrpg.DeathSavingThrow"),
      speaker: speaker,
      halflingLucky: this.getFlag("bfrpg", "halflingLucky"),
      targetValue: 10,
      fastForward: true,
      messageData: {"flags.bfrpg.roll": {type: "death"}}
    });
    rollData.speaker = speaker;
    const roll = await d20Roll(rollData);
    if ( !roll ) return null;

    // Take action depending on the result
    const success = roll.total >= 10;
    const d20 = roll.dice[0].total;

    // Save success
    if ( success ) {
      let successes = (death.success || 0) + 1;

      // Critical Success = revive with 1hp
      if ( d20 === 20 ) {
        await this.update({
          "data.attributes.death.success": 0,
          "data.attributes.death.failure": 0,
          "data.attributes.hp.value": 1
        });
        await ChatMessage.create({content: game.i18n.format("bfrpg.DeathSaveCriticalSuccess", {name: this.name}), speaker});
      }

      // 3 Successes = survive and reset checks
      else if ( successes === 3 ) {
        await this.update({
          "data.attributes.death.success": 0,
          "data.attributes.death.failure": 0
        });
        await ChatMessage.create({content: game.i18n.format("bfrpg.DeathSaveSuccess", {name: this.name}), speaker});
      }

      // Increment successes
      else await this.update({"data.attributes.death.success": Math.clamped(successes, 0, 3)});
    }

    // Save failure
    else {
      let failures = (death.failure || 0) + (d20 === 1 ? 2 : 1);
      await this.update({"data.attributes.death.failure": Math.clamped(failures, 0, 3)});
      if ( failures >= 3 ) {  // 3 Failures = death
        await ChatMessage.create({content: game.i18n.format("bfrpg.DeathSaveFailure", {name: this.name}), speaker});
      }
    }

    // Return the rolled result
    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Roll a hit die of the appropriate type, gaining hit points equal to the die roll plus your CON modifier
   * @param {string} [denomination]   The hit denomination of hit die to roll. Example "d8".
   *                                  If no denomination is provided, the first available HD will be used
   * @param {boolean} [dialog]        Show a dialog prompt for configuring the hit die roll?
   * @return {Promise<Roll|null>}     The created Roll instance, or null if no hit die was rolled
   */
  async rollHitDie(denomination, {dialog=true}={}) {

    // If no denomination was provided, choose the first available
    let cls = null;
    if ( !denomination ) {
      cls = this.itemTypes.class.find(c => c.data.data.hitDiceUsed < c.data.data.levels);
      if ( !cls ) return null;
      denomination = cls.data.data.hitDice;
    }

    // Otherwise locate a class (if any) which has an available hit die of the requested denomination
    else {
      cls = this.items.find(i => {
        const d = i.data.data;
        return (d.hitDice === denomination) && ((d.hitDiceUsed || 0) < (d.levels || 1));
      });
    }

    // If no class is available, display an error notification
    if ( !cls ) {
      ui.notifications.error(game.i18n.format("bfrpg.HitDiceWarn", {name: this.name, formula: denomination}));
      return null;
    }

    // Prepare roll data
    const parts = [`1${denomination}`, "@abilities.con.mod"];
    const title = game.i18n.localize("bfrpg.HitDiceRoll");
    const rollData = duplicate(this.data.data);

    // Call the roll helper utility
    const roll = await damageRoll({
      event: new Event("hitDie"),
      parts: parts,
      data: rollData,
      title: title,
      speaker: ChatMessage.getSpeaker({actor: this}),
      allowcritical: false,
      fastForward: true,
      // fastForward: !dialog,
      dialogOptions: {width: 350},
      messageData: {"flags.bfrpg.roll": {type: "hitDie"}}
    });
    if ( !roll ) return null;

    // Adjust actor data
    await cls.update({"data.hitDiceUsed": cls.data.data.hitDiceUsed + 1});
    const hp = this.data.data.attributes.hp;
    const dhp = Math.min(hp.max - hp.value, roll.total);
    await this.update({"data.attributes.hp.value": hp.value + dhp});
    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Cause this Actor to take a Short Rest
   * During a Short Rest resources and limited item uses may be recovered
   * @param {boolean} dialog  Present a dialog window which allows for rolling hit dice as part of the Short Rest
   * @param {boolean} chat    Summarize the results of the rest workflow as a chat message
   * @param {boolean} autoHD  Automatically spend Hit Dice if you are missing 3 or more hit points
   * @param {boolean} autoHDThreshold   A number of missing hit points which would trigger an automatic HD roll
   * @return {Promise}        A Promise which resolves once the short rest workflow has completed
   */
  async shortRest({dialog=true, chat=true, autoHD=false, autoHDThreshold=3}={}) {

    // Take note of the initial hit points and number of hit dice the Actor has
    const hp = this.data.data.attributes.hp;
    const hd0 = this.data.data.attributes.hd;
    const hp0 = hp.value;
    let newDay = false;

    // Display a Dialog for rolling hit dice
    if ( dialog ) {
      try {
        newDay = await ShortRestDialog.shortRestDialog({actor: this, canRoll: hd0 > 0});
      } catch(err) {
        return;
      }
    }

    // Automatically spend hit dice
    else if ( autoHD ) {
      while ( (hp.value + autoHDThreshold) <= hp.max ) {
        const r = await this.rollHitDie(undefined, {dialog: false});
        if ( r === null ) break;
      }
    }

    // Note the change in HP and HD which occurred
    const dhd = this.data.data.attributes.hd - hd0;
    const dhp = this.data.data.attributes.hp.value - hp0;

    // Recover character resources
    const updateData = {};
    for ( let [k, r] of Object.entries(this.data.data.resources) ) {
      if ( r.max && r.sr ) {
        updateData[`data.resources.${k}.value`] = r.max;
      }
    }

    // Recover pact slots.
    const pact = this.data.data.spells.pact;
    updateData['data.spells.pact.value'] = pact.override || pact.max;
    await this.update(updateData);

    // Recover item uses
    const recovery = newDay ? ["sr", "day"] : ["sr"];
    const items = this.items.filter(item => item.data.data.uses && recovery.includes(item.data.data.uses.per));
    const updateItems = items.map(item => {
      return {
        _id: item._id,
        "data.uses.value": item.data.data.uses.max
      };
    });
    await this.updateEmbeddedEntity("OwnedItem", updateItems);

    // Display a Chat Message summarizing the rest effects
    if ( chat ) {

      // Summarize the rest duration
      let restFlavor;
      switch (game.settings.get("bfrpg", "restVariant")) {
        case 'normal': restFlavor = game.i18n.localize("bfrpg.ShortRestNormal"); break;
        case 'gritty': restFlavor = game.i18n.localize(newDay ? "bfrpg.ShortRestOvernight" : "bfrpg.ShortRestGritty"); break;
        case 'epic':  restFlavor = game.i18n.localize("bfrpg.ShortRestEpic"); break;
      }

      // Summarize the health effects
      let srMessage = "bfrpg.ShortRestResultShort";
      if ((dhd !== 0) && (dhp !== 0)) srMessage = "bfrpg.ShortRestResult";

      // Create a chat message
      ChatMessage.create({
        user: game.user._id,
        speaker: {actor: this, alias: this.name},
        flavor: restFlavor,
        content: game.i18n.format(srMessage, {name: this.name, dice: -dhd, health: dhp})
      });
    }

    // Return data summarizing the rest effects
    return {
      dhd: dhd,
      dhp: dhp,
      updateData: updateData,
      updateItems: updateItems,
      newDay: newDay
    }
  }

  /* -------------------------------------------- */

  /**
   * Take a long rest, recovering HP, HD, resources, and spell slots
   * @param {boolean} dialog  Present a confirmation dialog window whether or not to take a long rest
   * @param {boolean} chat    Summarize the results of the rest workflow as a chat message
   * @param {boolean} newDay  Whether the long rest carries over to a new day
   * @return {Promise}        A Promise which resolves once the long rest workflow has completed
   */
  async longRest({dialog=true, chat=true, newDay=true}={}) {
    const data = this.data.data;

    // Maybe present a confirmation dialog
    if ( dialog ) {
      try {
        newDay = await LongRestDialog.longRestDialog({actor: this});
      } catch(err) {
        return;
      }
    }

    // Recover hit points to full, and eliminate any existing temporary HP
    const dhp = data.attributes.hp.max - data.attributes.hp.value;
    const updateData = {
      "data.attributes.hp.value": data.attributes.hp.max,
      "data.attributes.hp.temp": 0,
      "data.attributes.hp.tempmax": 0
    };

    // Recover character resources
    for ( let [k, r] of Object.entries(data.resources) ) {
      if ( r.max && (r.sr || r.lr) ) {
        updateData[`data.resources.${k}.value`] = r.max;
      }
    }

    // Recover spell slots
    for ( let [k, v] of Object.entries(data.spells) ) {
      if ( !v.max && !v.override ) continue;
      updateData[`data.spells.${k}.value`] = v.override || v.max;
    }

    // Recover pact slots.
    const pact = data.spells.pact;
    updateData['data.spells.pact.value'] = pact.override || pact.max;

    // Determine the number of hit dice which may be recovered
    let recoverHD = Math.max(Math.floor(data.details.level / 2), 1);
    let dhd = 0;

    // Sort classes which can recover HD, assuming players prefer recovering larger HD first.
    const updateItems = this.items.filter(item => item.data.type === "class").sort((a, b) => {
      let da = parseInt(a.data.data.hitDice.slice(1)) || 0;
      let db = parseInt(b.data.data.hitDice.slice(1)) || 0;
      return db - da;
    }).reduce((updates, item) => {
      const d = item.data.data;
      if ( (recoverHD > 0) && (d.hitDiceUsed > 0) ) {
        let delta = Math.min(d.hitDiceUsed || 0, recoverHD);
        recoverHD -= delta;
        dhd += delta;
        updates.push({_id: item.id, "data.hitDiceUsed": d.hitDiceUsed - delta});
      }
      return updates;
    }, []);

    // Iterate over owned items, restoring uses per day and recovering Hit Dice
    const recovery = newDay ? ["sr", "lr", "day"] : ["sr", "lr"];
    for ( let item of this.items ) {
      const d = item.data.data;
      if ( d.uses && recovery.includes(d.uses.per) ) {
        updateItems.push({_id: item.id, "data.uses.value": d.uses.max});
      }
      else if ( d.recharge && d.recharge.value ) {
        updateItems.push({_id: item.id, "data.recharge.charged": true});
      }
    }

    // Perform the updates
    await this.update(updateData);
    if ( updateItems.length ) await this.updateEmbeddedEntity("OwnedItem", updateItems);

    // Display a Chat Message summarizing the rest effects
    let restFlavor;
    switch (game.settings.get("bfrpg", "restVariant")) {
      case 'normal': restFlavor = game.i18n.localize(newDay ? "bfrpg.LongRestOvernight" : "bfrpg.LongRestNormal"); break;
      case 'gritty': restFlavor = game.i18n.localize("bfrpg.LongRestGritty"); break;
      case 'epic':  restFlavor = game.i18n.localize("bfrpg.LongRestEpic"); break;
    }

    // Determine the chat message to display
    if ( chat ) {
      let lrMessage = "bfrpg.LongRestResultShort";
      if((dhp !== 0) && (dhd !== 0)) lrMessage = "bfrpg.LongRestResult";
      else if ((dhp !== 0) && (dhd === 0)) lrMessage = "bfrpg.LongRestResultHitPoints";
      else if ((dhp === 0) && (dhd !== 0)) lrMessage = "bfrpg.LongRestResultHitDice";
      ChatMessage.create({
        user: game.user._id,
        speaker: {actor: this, alias: this.name},
        flavor: restFlavor,
        content: game.i18n.format(lrMessage, {name: this.name, health: dhp, dice: dhd})
      });
    }

    // Return data summarizing the rest effects
    return {
      dhd: dhd,
      dhp: dhp,
      updateData: updateData,
      updateItems: updateItems,
      newDay: newDay
    }
  }

  /* -------------------------------------------- */

  /**
   * Convert all carried currency to the highest possible denomination to reduce the number of raw coins being
   * carried by an Actor.
   * @return {Promise<ActorBFRPG>}
   */
  convertCurrency() {
    const curr = duplicate(this.data.data.currency);
    const convert = CONFIG.bfrpg.currencyConversion;
    for ( let [c, t] of Object.entries(convert) ) {
      let change = Math.floor(curr[c] / t.each);
      curr[c] -= (change * t.each);
      curr[t.into] += change;
    }
    return this.update({"data.currency": curr});
  }

  /* -------------------------------------------- */

  /**
   * Transform this Actor into another one.
   *
   * @param {Actor} target The target Actor.
   * @param {boolean} [keepPhysical] Keep physical abilities (str, dex, con)
   * @param {boolean} [keepMental] Keep mental abilities (int, wis, cha)
   * @param {boolean} [keepSaves] Keep saving throw proficiencies
   * @param {boolean} [keepSkills] Keep skill proficiencies
   * @param {boolean} [mergeSaves] Take the maximum of the save proficiencies
   * @param {boolean} [mergeSkills] Take the maximum of the skill proficiencies
   * @param {boolean} [keepClass] Keep proficiency bonus
   * @param {boolean} [keepFeats] Keep features
   * @param {boolean} [keepSpells] Keep spells
   * @param {boolean} [keepItems] Keep items
   * @param {boolean} [keepBio] Keep biography
   * @param {boolean} [keepVision] Keep vision
   * @param {boolean} [transformTokens] Transform linked tokens too
   */
  async transformInto(target, { keepPhysical=false, keepMental=false, keepSaves=false, keepSkills=false,
    mergeSaves=false, mergeSkills=false, keepClass=false, keepFeats=false, keepSpells=false,
    keepItems=false, keepBio=false, keepVision=false, transformTokens=true}={}) {

    // Ensure the player is allowed to polymorph
    const allowed = game.settings.get("bfrpg", "allowPolymorphing");
    if ( !allowed && !game.user.isGM ) {
      return ui.notifications.warn(game.i18n.localize("bfrpg.PolymorphWarn"));
    }

    // Get the original Actor data and the new source data
    const o = duplicate(this.data);
    o.flags.bfrpg = o.flags.bfrpg || {};
    o.flags.bfrpg.transformOptions = {mergeSkills, mergeSaves};
    const source = duplicate(target.data);

    // Prepare new data to merge from the source
    const d = {
      type: o.type, // Remain the same actor type
      name: `${o.name} (${source.name})`, // Append the new shape to your old name
      data: source.data, // Get the data model of your new form
      items: source.items, // Get the items of your new form
      token: source.token, // New token configuration
      img: source.img, // New appearance
      permission: o.permission, // Use the original actor permissions
      folder: o.folder, // Be displayed in the same sidebar folder
      flags: o.flags // Use the original actor flags
    };

    // Additional adjustments
    delete d.data.resources; // Don't change your resource pools
    delete d.data.currency; // Don't lose currency
    delete d.data.bonuses; // Don't lose global bonuses
    delete d.token.actorId; // Don't reference the old actor ID
    d.token.actorLink = o.token.actorLink; // Keep your actor link
    d.token.name = d.name; // Token name same as actor name
    d.data.details.alignment = o.data.details.alignment; // Don't change alignment
    d.data.attributes.exhaustion = o.data.attributes.exhaustion; // Keep your prior exhaustion level
    d.data.attributes.inspiration = o.data.attributes.inspiration; // Keep inspiration
    d.data.spells = o.data.spells; // Keep spell slots

    // Handle wildcard
    if ( source.token.randomImg ) {
      const images = await target.getTokenImages();
      d.token.img = images[0];
    }

    // Keep Token configurations
    const tokenConfig = ["displayName", "vision", "actorLink", "disposition", "displayBars", "bar1", "bar2"];
    if ( keepVision ) {
      tokenConfig.push(...['dimSight', 'brightSight', 'dimLight', 'brightLight', 'vision', 'sightAngle']);
    }
    for ( let c of tokenConfig ) {
      d.token[c] = o.token[c];
    }

    // Transfer ability scores
    const abilities = d.data.abilities;
    for ( let k of Object.keys(abilities) ) {
      const oa = o.data.abilities[k];
      const prof = abilities[k].proficient;
      if ( keepPhysical && ["str", "dex", "con"].includes(k) ) abilities[k] = oa;
      else if ( keepMental && ["int", "wis", "cha"].includes(k) ) abilities[k] = oa;
      if ( keepSaves ) abilities[k].proficient = oa.proficient;
      else if ( mergeSaves ) abilities[k].proficient = Math.max(prof, oa.proficient);
    }

    // Transfer skills
    if ( keepSkills ) d.data.skills = o.data.skills;
    else if ( mergeSkills ) {
      for ( let [k, s] of Object.entries(d.data.skills) ) {
        s.value = Math.max(s.value, o.data.skills[k].value);
      }
    }

    // Keep specific items from the original data
    d.items = d.items.concat(o.items.filter(i => {
      if ( i.type === "class" ) return keepClass;
      else if ( i.type === "feat" ) return keepFeats;
      else if ( i.type === "spell" ) return keepSpells;
      else return keepItems;
    }));

    // Transfer classes for NPCs
    if (!keepClass && d.data.details.cr) {
      d.items.push({
        type: 'class',
        name: game.i18n.localize('bfrpg.PolymorphTmpClass'),
        data: { levels: d.data.details.cr }
      });
    }

    // Keep biography
    if (keepBio) d.data.details.biography = o.data.details.biography;

    // Keep senses
    if (keepVision) d.data.traits.senses = o.data.traits.senses;

    // Set new data flags
    if ( !this.isPolymorphed || !d.flags.bfrpg.originalActor ) d.flags.bfrpg.originalActor = this.id;
    d.flags.bfrpg.isPolymorphed = true;

    // Update unlinked Tokens in place since they can simply be re-dropped from the base actor
    if (this.isToken) {
      const tokenData = d.token;
      tokenData.actorData = d;
      delete tokenData.actorData.token;
      return this.token.update(tokenData);
    }

    // Update regular Actors by creating a new Actor with the Polymorphed data
    await this.sheet.close();
    Hooks.callAll('bfrpg.transformActor', this, target, d, {
      keepPhysical, keepMental, keepSaves, keepSkills, mergeSaves, mergeSkills,
      keepClass, keepFeats, keepSpells, keepItems, keepBio, keepVision, transformTokens
    });
    const newActor = await this.constructor.create(d, {renderSheet: true});

    // Update placed Token instances
    if ( !transformTokens ) return;
    const tokens = this.getActiveTokens(true);
    const updates = tokens.map(t => {
      const newTokenData = duplicate(d.token);
      if ( !t.data.actorLink ) newTokenData.actorData = newActor.data;
      newTokenData._id = t.data._id;
      newTokenData.actorId = newActor.id;
      return newTokenData;
    });
    return canvas.scene.updateEmbeddedEntity("Token", updates);
  }

  /* -------------------------------------------- */

  /**
   * If this actor was transformed with transformTokens enabled, then its
   * active tokens need to be returned to their original state. If not, then
   * we can safely just delete this actor.
   */
  async revertOriginalForm() {
    if ( !this.isPolymorphed ) return;
    if ( !this.owner ) {
      return ui.notifications.warn(game.i18n.localize("bfrpg.PolymorphRevertWarn"));
    }

    // If we are reverting an unlinked token, simply replace it with the base actor prototype
    if ( this.isToken ) {
      const baseActor = game.actors.get(this.token.data.actorId);
      const prototypeTokenData = duplicate(baseActor.token);
      prototypeTokenData.actorData = null;
      return this.token.update(prototypeTokenData);
    }

    // Obtain a reference to the original actor
    const original = game.actors.get(this.getFlag('bfrpg', 'originalActor'));
    if ( !original ) return;

    // Get the Tokens which represent this actor
    if ( canvas.ready ) {
      const tokens = this.getActiveTokens(true);
      const tokenUpdates = tokens.map(t => {
        const tokenData = duplicate(original.data.token);
        tokenData._id = t.id;
        tokenData.actorId = original.id;
        return tokenData;
      });
      canvas.scene.updateEmbeddedEntity("Token", tokenUpdates);
    }

    // Delete the polymorphed Actor and maybe re-render the original sheet
    const isRendered = this.sheet.rendered;
    if ( game.user.isGM ) await this.delete();
    original.sheet.render(isRendered);
    return original;
  }

  /* -------------------------------------------- */

  /**
   * Add additional system-specific sidebar directory context menu options for Actor entities
   * @param {jQuery} html         The sidebar HTML
   * @param {Array} entryOptions  The default array of context menu options
   */
  static addDirectoryContextOptions(html, entryOptions) {
    entryOptions.push({
      name: 'bfrpg.PolymorphRestoreTransformation',
      icon: '<i class="fas fa-backward"></i>',
      callback: li => {
        const actor = game.actors.get(li.data('entityId'));
        return actor.revertOriginalForm();
      },
      condition: li => {
        const allowed = game.settings.get("bfrpg", "allowPolymorphing");
        if ( !allowed && !game.user.isGM ) return false;
        const actor = game.actors.get(li.data('entityId'));
        return actor && actor.isPolymorphed;
      }
    });
  }

  /* -------------------------------------------- */
  /*  DEPRECATED METHODS                          */
  /* -------------------------------------------- */

  /**
   * @deprecated since bfrpg 0.97
   */
  getSpellDC(ability) {
    console.warn(`The ActorBFRPG#getSpellDC(ability) method has been deprecated in favor of ActorBFRPG#data.data.abilities[ability].dc`);
    return this.data.data.abilities[ability]?.dc;
  }
}
