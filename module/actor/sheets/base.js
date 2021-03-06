import ItemBFRPG from "../../item/entity.js";
import TraitSelector from "../../apps/trait-selector.js";
import ActorSheetFlags from "../../apps/actor-flags.js";
import MovementConfig from "../../apps/movement-config.js";
import {bfrpg} from '../../config.js';
import {onManageActiveEffect, prepareActiveEffectCategories} from "../../effects.js";

/**
 * Extend the basic ActorSheet class to suppose system-specific logic and functionality.
 * This sheet is an Abstract layer which is not used.
 * @extends {ActorSheet}
 */
export default class ActorSheetBFRPG extends ActorSheet {
  constructor(...args) {
    super(...args);

    /**
     * Track the set of item filters which are applied
     * @type {Set}
     */
    this._filters = {
      inventory: new Set(),
      spellbook: new Set(),
      features: new Set(),
      effects: new Set()
    };
  }

  /* -------------------------------------------- */

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      scrollY: [
        ".inventory .inventory-list",
        ".features .inventory-list",
        ".spellbook .inventory-list",
        ".effects .inventory-list"
      ],
      tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "description"}]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get template() {
    if ( !game.user.isGM && this.actor.limited ) return "systems/bfrpg/templates/actors/limited-sheet.html";
    return `systems/bfrpg/templates/actors/${this.actor.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {

    // Basic data
    let isOwner = this.entity.owner;
    const data = {
      owner: isOwner,
      limited: this.entity.limited,
      options: this.options,
      editable: this.isEditable,
      cssClass: isOwner ? "editable" : "locked",
      isCharacter: this.entity.data.type === "character",
      isNPC: this.entity.data.type === "npc",
      isVehicle: this.entity.data.type === 'vehicle',
      config: CONFIG.bfrpg,
    };

    // The Actor and its Items
    data.actor = duplicate(this.actor.data);
    data.items = this.actor.items.map(i => {
      i.data.labels = i.labels;
      return i.data;
    });
    data.items.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    data.data = data.actor.data;
    data.labels = this.actor.labels || {};
    data.filters = this._filters;

    // Ability Scores
    for ( let [a, abl] of Object.entries(data.actor.data.abilities)) {
      abl.icon = this._getProficiencyIcon(abl.proficient);
      abl.hover = CONFIG.bfrpg.proficiencyLevels[abl.proficient];
      abl.label = CONFIG.bfrpg.abilities[a];
    }

    // Skills
    if (data.actor.data.skills) {
      for ( let [s, skl] of Object.entries(data.actor.data.skills)) {
        skl.ability = CONFIG.bfrpg.abilityAbbreviations[skl.ability];
        skl.icon = this._getProficiencyIcon(skl.value);
        skl.hover = CONFIG.bfrpg.proficiencyLevels[skl.value];
        skl.label = CONFIG.bfrpg.skills[s];
      }
    }

    // Saves
    if (data.actor.data.saves) {
      for ( let [s, sav] of Object.entries(data.actor.data.saves)) {
        sav.label = CONFIG.bfrpg.saves[s];
      }
    }

    // Class Abilities
    if (data.actor.data.classAbilities.turnUndead) {
      for ( let [s, turn] of Object.entries(data.actor.data.classAbilities.turnUndead)) {
        turn.label = CONFIG.bfrpg.turnUndead[s];
      }
    }
    if (data.actor.data.classAbilities.thiefSkills) {
      for ( let [s, tskl] of Object.entries(data.actor.data.classAbilities.thiefSkills)) {
        tskl.label = CONFIG.bfrpg.thiefSkills[s];
      }
    }

    
    // Movement speeds
    data.movement = this._getMovementSpeed(data.actor);

    // Update traits
    this._prepareTraits(data.actor.data.traits);

    // Prepare owned items
    this._prepareItems(data);

    // Prepare active effects
    data.effects = prepareActiveEffectCategories(this.entity.effects);

    // Return data to the sheet
    return data
  }

  /* -------------------------------------------- */

  /**
   * Prepare the display of movement speed data for the Actor
   * @param {object} actorData
   * @returns {{primary: string, special: string}}
   * @private
   */
  _getMovementSpeed(actorData) {
    const movement = actorData.data.attributes.movement;
    const speeds = [
      [movement.burrow, `${game.i18n.localize("bfrpg.MovementBurrow")} ${movement.burrow}`],
      [movement.climb, `${game.i18n.localize("bfrpg.MovementClimb")} ${movement.climb}`],
      [movement.fly, `${game.i18n.localize("bfrpg.MovementFly")} ${movement.fly}` + (movement.hover ? ` (${game.i18n.localize("bfrpg.MovementHover")})` : "")],
      [movement.turn, `${game.i18n.localize("bfrpg.MovementTurn")} ${movement.turn}`],
      [movement.swim, `${game.i18n.localize("bfrpg.MovementSwim")} ${movement.swim}`]
    ].filter(s => !!s[0]).sort((a, b) => b[0] - a[0]);
    return {
      primary: `${movement.walk || 0} ${movement.units}`,
      special: speeds.length ? speeds.map(s => s[1]).join(", ") : ""
    }
  }

  /* -------------------------------------------- */

  /**
   * Prepare the data structure for traits data like languages, resistances & vulnerabilities, and proficiencies
   * @param {object} traits   The raw traits data object from the actor data
   * @private
   */
  _prepareTraits(traits) {
    const map = {
      //"dr": CONFIG.bfrpg.damageResistanceTypes,
      //"di": CONFIG.bfrpg.damageResistanceTypes,
      //"dv": CONFIG.bfrpg.damageResistanceTypes,
      //"ci": CONFIG.bfrpg.conditionTypes,
      "damageResistance": CONFIG.bfrpg.damageResistanceTypes,
      "damageImmunity": CONFIG.bfrpg.damageResistanceTypes,
      "damageVulnerability": CONFIG.bfrpg.damageResistanceTypes,
      "conditionImmunity": CONFIG.bfrpg.conditionTypes,
      "languages": CONFIG.bfrpg.languages,
      "armorProf": CONFIG.bfrpg.ArmorProficiencies,
      "weaponProf": CONFIG.bfrpg.WeaponProficiencies,
      "specialAttack": CONFIG.bfrpg.SpecialAttacks,
      "specialDefense": CONFIG.bfrpg.SpecialDefenses,
      "racialAbility": CONFIG.bfrpg.RacialAbilities,
      "miscTrait": CONFIG.bfrpg.MiscTraits
      //"toolProf": CONFIG.bfrpg.toolProficiencies
    };
    for ( let [t, choices] of Object.entries(map) ) {
      const trait = traits[t];
      if ( !trait ) continue;
      let values = [];
      if ( trait.value ) {
        values = trait.value instanceof Array ? trait.value : [trait.value];
      }
      trait.selected = values.reduce((obj, t) => {
        obj[t] = choices[t];
        return obj;
      }, {});

      // Add custom entry
      if ( trait.custom ) {
        trait.custom.split(";").forEach((c, i) => trait.selected[`custom${i+1}`] = c.trim());
      }
      trait.cssClass = !isObjectEmpty(trait.selected) ? "" : "inactive";
    }
  }

  /* -------------------------------------------- */

  /**
   * Insert a spell into the spellbook object when rendering the character sheet
   * @param {Object} data     The Actor data being prepared
   * @param {Array} spells    The spell data being prepared
   * @private
   */
  _prepareSpellbook(data, spells) {
    const owner = this.actor.owner;
    const levels = data.data.spells;
    const spellbook = {};

    // Define some mappings
    const sections = {
      "atwill": -20,
      "innate": -10,
      "pact": 0.5
    };

    // Label spell slot uses headers
    const useLabels = {
      "-20": "-",
      "-10": "-",
      "0": "&infin;"
    };

    // Format a spellbook entry for a certain indexed level
    const registerSection = (sl, i, label, {prepMode="prepared", value, max, override}={}) => {
      spellbook[i] = {
        order: i,
        label: label,
        usesSlots: i > 0,
        canCreate: owner,
        canPrepare: (data.actor.type === "character") && (i >= 1),
        spells: [],
        uses: useLabels[i] || value || 0,
        slots: useLabels[i] || max || 0,
        override: override || 0,
        dataset: {"type": "spell", "level": prepMode in sections ? 1 : i, "preparation.mode": prepMode},
        prop: sl
      };
    };

    // Determine the maximum spell level which has a slot
    const maxLevel = Array.fromRange(10).reduce((max, i) => {
      if ( i === 0 ) return max;
      const level = levels[`spell${i}`];
      if ( (level.max || level.override ) && ( i > max ) ) max = i;
      return max;
    }, 0);

    // Level-based spellcasters have cantrips and leveled slots
    if ( maxLevel > 0 ) {
      registerSection("spell0", 0, CONFIG.bfrpg.spellLevels[0]);
      for (let lvl = 1; lvl <= maxLevel; lvl++) {
        const sl = `spell${lvl}`;
        registerSection(sl, lvl, CONFIG.bfrpg.spellLevels[lvl], levels[sl]);
      }
    }

    // Pact magic users have cantrips and a pact magic section
    if ( levels.pact && levels.pact.max ) {
      if ( !spellbook["0"] ) registerSection("spell0", 0, CONFIG.bfrpg.spellLevels[0]);
      const l = levels.pact;
      const config = CONFIG.bfrpg.spellPreparationModes.pact;
      registerSection("pact", sections.pact, config, {
        prepMode: "pact",
        value: l.value,
        max: l.max,
        override: l.override
      });
    }

    // Iterate over every spell item, adding spells to the spellbook by section
    spells.forEach(spell => {
      const mode = spell.data.preparation.mode || "prepared";
      let s = spell.data.level || 0;
      const sl = `spell${s}`;

      // Specialized spellcasting modes (if they exist)
      if ( mode in sections ) {
        s = sections[mode];
        if ( !spellbook[s] ){
          const l = levels[mode] || {};
          const config = CONFIG.bfrpg.spellPreparationModes[mode];
          registerSection(mode, s, config, {
            prepMode: mode,
            value: l.value,
            max: l.max,
            override: l.override
          });
        }
      }

      // Sections for higher-level spells which the caster "should not" have, but spell items exist for
      else if ( !spellbook[s] ) {
        registerSection(sl, s, CONFIG.bfrpg.spellLevels[s], {levels: levels[sl]});
      }

      // Add the spell to the relevant heading
      spellbook[s].spells.push(spell);
    });

    // Sort the spellbook by section level
    const sorted = Object.values(spellbook);
    sorted.sort((a, b) => a.order - b.order);
    return sorted;
  }

  /* -------------------------------------------- */

  /**
   * Determine whether an Owned Item will be shown based on the current set of filters
   * @return {boolean}
   * @private
   */
  _filterItems(items, filters) {
    return items.filter(item => {
      const data = item.data;

      // Action usage
      for ( let f of ["action", "bonus", "reaction"] ) {
        if ( filters.has(f) ) {
          if ((data.activation && (data.activation.type !== f))) return false;
        }
      }

      // Spell-specific filters
      if ( filters.has("ritual") ) {
        if (data.components.ritual !== true) return false;
      }
      if ( filters.has("concentration") ) {
        if (data.components.concentration !== true) return false;
      }
      if ( filters.has("prepared") ) {
        if ( data.level === 0 || ["innate", "always"].includes(data.preparation.mode) ) return true;
        if ( this.actor.data.type === "npc" ) return true;
        return data.preparation.prepared;
      }

      // Equipment-specific filters
      if ( filters.has("equipped") ) {
        if ( data.equipped !== true ) return false;
      }
      return true;
    });
  }

  /* -------------------------------------------- */

  /**
   * Get the font-awesome icon used to display a certain level of skill proficiency
   * @private
   */
  _getProficiencyIcon(level) {
    const icons = {
      0: '<i class="far fa-circle"></i>',
      0.5: '<i class="fas fa-adjust"></i>',
      1: '<i class="fas fa-check"></i>',
      2: '<i class="fas fa-check-double"></i>'
    };
    return icons[level];
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers
  /* -------------------------------------------- */

  /**
   * Activate event listeners using the prepared sheet HTML
   * @param html {HTML}   The prepared HTML object ready to be rendered into the DOM
   */
  activateListeners(html) {

    // Activate Item Filters
    const filterLists = html.find(".filter-list");
    filterLists.each(this._initializeFilterItemList.bind(this));
    filterLists.on("click", ".filter-item", this._onToggleFilter.bind(this));

    // Item summaries
    html.find('.item .item-name.rollable h4').click(event => this._onItemSummary(event));

    // Editable Only Listeners
    if ( this.isEditable ) {

      // Input focus and update
      const inputs = html.find("input");
      inputs.focus(ev => ev.currentTarget.select());
      inputs.addBack().find('[data-dtype="Number"]').change(this._onChangeInputDelta.bind(this));

      // Ability Proficiency
      html.find('.ability-proficiency').click(this._onToggleAbilityProficiency.bind(this));

      // Toggle Skill Proficiency
      html.find('.skill-proficiency').on("click contextmenu", this._onCycleSkillProficiency.bind(this));

      // Trait Selector
      html.find('.trait-selector').click(this._onTraitSelector.bind(this));

      // Configure Special Flags
      html.find('.configure-movement').click(this._onMovementConfig.bind(this));
      html.find('.configure-flags').click(this._onConfigureFlags.bind(this));

      // Owned Item management
      html.find('.item-create').click(this._onItemCreate.bind(this));
      html.find('.item-edit').click(this._onItemEdit.bind(this));
      html.find('.item-delete').click(this._onItemDelete.bind(this));
      html.find('.item-uses input').click(ev => ev.target.select()).change(this._onUsesChange.bind(this));
      html.find('.slot-max-override').click(this._onSpellSlotOverride.bind(this));

      // Active Effect management
      html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.entity));
    }

    // Owner Only Listeners
    if ( this.actor.owner ) {

      // Ability Checks
      html.find('.ability-name').click(this._onRollAbilityTest.bind(this));

      // Saving Throw
      html.find('.save-name').click(this._onRollSavingThrow.bind(this));

      // Roll Skill Checks
      html.find('.skill-name').click(this._onRollSkillCheck.bind(this));

      // Item Rolling
      html.find('.item .item-image').click(event => this._onItemRoll(event));
      html.find('.item .item-recharge').click(event => this._onItemRecharge(event));

      // Turn Undead Check
      html.find('.turnUndead-name').click(this._onRollTurnUndeadCheck.bind(this));

      // Thief Skill Checks
      html.find('.thiefSkill-name').click(this._onRollThiefSkillCheck.bind(this));

      // Morale Check
      html.find('.morale-name').click(this._onRollMoraleCheck.bind(this));

      
    }

    // Otherwise remove rollable classes
    else {
      html.find(".rollable").each((i, el) => el.classList.remove("rollable"));
    }

    // Handle default listeners last so system listeners are triggered first
    super.activateListeners(html);
  }

  /* -------------------------------------------- */

  /**
   * Iinitialize Item list filters by activating the set of filters which are currently applied
   * @private
   */
  _initializeFilterItemList(i, ul) {
    const set = this._filters[ul.dataset.filter];
    const filters = ul.querySelectorAll(".filter-item");
    for ( let li of filters ) {
      if ( set.has(li.dataset.filter) ) li.classList.add("active");
    }
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /**
   * Handle input changes to numeric form fields, allowing them to accept delta-typed inputs
   * @param event
   * @private
   */
  _onChangeInputDelta(event) {
    const input = event.target;
    const value = input.value;
    if ( ["+", "-"].includes(value[0]) ) {
      let delta = parseFloat(value);
      input.value = getProperty(this.actor.data, input.name) + delta;
    } else if ( value[0] === "=" ) {
      input.value = value.slice(1);
    }
  }

  /* -------------------------------------------- */

  /**
   * Handle click events for the Traits tab button to configure special Character Flags
   */
  _onConfigureFlags(event) {
    event.preventDefault();
    new ActorSheetFlags(this.actor).render(true);
  }

  /* -------------------------------------------- */

  /**
   * Handle cycling proficiency in a Skill
   * @param {Event} event   A click or contextmenu event which triggered the handler
   * @private
   */
  _onCycleSkillProficiency(event) {
    event.preventDefault();
    const field = $(event.currentTarget).siblings('input[type="hidden"]');

    // Get the current level and the array of levels
    const level = parseFloat(field.val());
    const levels = [0, 1, 0.5, 2];
    let idx = levels.indexOf(level);

    // Toggle next level - forward on click, backwards on right
    if ( event.type === "click" ) {
      field.val(levels[(idx === levels.length - 1) ? 0 : idx + 1]);
    } else if ( event.type === "contextmenu" ) {
      field.val(levels[(idx === 0) ? levels.length - 1 : idx - 1]);
    }

    // Update the field value and save the form
    this._onSubmit(event);
  }

  /* -------------------------------------------- */

  /** @override */
  async _onDropActor(event, data) {
    const canPolymorph = game.user.isGM || (this.actor.owner && game.settings.get('bfrpg', 'allowPolymorphing'));
    if ( !canPolymorph ) return false;

    // Get the target actor
    let sourceActor = null;
    if (data.pack) {
      const pack = game.packs.find(p => p.collection === data.pack);
      sourceActor = await pack.getEntity(data.id);
    } else {
      sourceActor = game.actors.get(data.id);
    }
    if ( !sourceActor ) return;

    // Define a function to record polymorph settings for future use
    const rememberOptions = html => {
      const options = {};
      html.find('input').each((i, el) => {
        options[el.name] = el.checked;
      });
      const settings = mergeObject(game.settings.get('bfrpg', 'polymorphSettings') || {}, options);
      game.settings.set('bfrpg', 'polymorphSettings', settings);
      return settings;
    };

    // Create and render the Dialog
    return new Dialog({
      title: game.i18n.localize('bfrpg.PolymorphPromptTitle'),
      content: {
        options: game.settings.get('bfrpg', 'polymorphSettings'),
        i18n: bfrpg.polymorphSettings,
        isToken: this.actor.isToken
      },
      default: 'accept',
      buttons: {
        accept: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('bfrpg.PolymorphAcceptSettings'),
          callback: html => this.actor.transformInto(sourceActor, rememberOptions(html))
        },
        wildshape: {
          icon: '<i class="fas fa-paw"></i>',
          label: game.i18n.localize('bfrpg.PolymorphWildShape'),
          callback: html => this.actor.transformInto(sourceActor, {
            keepMental: true,
            mergeSaves: true,
            mergeSkills: true,
            transformTokens: rememberOptions(html).transformTokens
          })
        },
        polymorph: {
          icon: '<i class="fas fa-pastafarianism"></i>',
          label: game.i18n.localize('bfrpg.Polymorph'),
          callback: html => this.actor.transformInto(sourceActor, {
            transformTokens: rememberOptions(html).transformTokens
          })
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('Cancel')
        }
      }
    }, {
      classes: ['dialog', 'bfrpg'],
      width: 600,
      template: 'systems/bfrpg/templates/apps/polymorph-prompt.html'
    }).render(true);
  }

  /* -------------------------------------------- */

  /** @override */
  async _onDropItemCreate(itemData) {

    // Create a Consumable spell scroll on the Inventory tab
    if ( (itemData.type === "spell") && (this._tabs[0].active === "inventory") ) {
      const scroll = await ItemBFRPG.createScrollFromSpell(itemData);
      itemData = scroll.data;
    }

    // Create the owned item as normal
    return super._onDropItemCreate(itemData);
  }

  /* -------------------------------------------- */

  /**
   * Handle enabling editing for a spell slot override value
   * @param {MouseEvent} event    The originating click event
   * @private
   */
  async _onSpellSlotOverride (event) {
    const span = event.currentTarget.parentElement;
    const level = span.dataset.level;
    const override = this.actor.data.data.spells[level].override || span.dataset.slots;
    const input = document.createElement("INPUT");
    input.type = "text";
    input.name = `data.spells.${level}.override`;
    input.value = override;
    input.placeholder = span.dataset.slots;
    input.dataset.dtype = "Number";

    // Replace the HTML
    const parent = span.parentElement;
    parent.removeChild(span);
    parent.appendChild(input);
  }

  /* -------------------------------------------- */

  /**
   * Change the uses amount of an Owned Item within the Actor
   * @param {Event} event   The triggering click event
   * @private
   */
  async _onUsesChange(event) {
      event.preventDefault();
      const itemId = event.currentTarget.closest(".item").dataset.itemId;
      const item = this.actor.getOwnedItem(itemId);
      const uses = Math.clamped(0, parseInt(event.target.value), item.data.data.uses.max);
      event.target.value = uses;
      return item.update({ 'data.uses.value': uses });
  }

  /* -------------------------------------------- */

  /**
   * Handle rolling of an item from the Actor sheet, obtaining the Item instance and dispatching to it's roll method
   * @private
   */
  _onItemRoll(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.getOwnedItem(itemId);

    // Roll spells through the actor
    if ( item.data.type === "spell" ) {
      return this.actor.useSpell(item, {configureDialog: !event.shiftKey});
    }

    // Otherwise roll the Item directly
    else return item.roll();
  }

  /* -------------------------------------------- */

  /**
   * Handle attempting to recharge an item usage by rolling a recharge check
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemRecharge(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.getOwnedItem(itemId);
    return item.rollRecharge();
  };

  /* -------------------------------------------- */

  /**
   * Handle rolling of an item from the Actor sheet, obtaining the Item instance and dispatching to it's roll method
   * @private
   */
  _onItemSummary(event) {
    event.preventDefault();
    let li = $(event.currentTarget).parents(".item"),
        item = this.actor.getOwnedItem(li.data("item-id")),
        chatData = item.getChatData({secrets: this.actor.owner});

    // Toggle summary
    if ( li.hasClass("expanded") ) {
      let summary = li.children(".item-summary");
      summary.slideUp(200, () => summary.remove());
    } else {
      let div = $(`<div class="item-summary">${chatData.description.value}</div>`);
      let props = $(`<div class="item-properties"></div>`);
      chatData.properties.forEach(p => props.append(`<span class="tag">${p}</span>`));
      div.append(props);
      li.append(div.hide());
      div.slideDown(200);
    }
    li.toggleClass("expanded");
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;
    const itemData = {
      name: game.i18n.format("bfrpg.ItemNew", {type: type.capitalize()}),
      type: type,
      data: duplicate(header.dataset)
    };
    delete itemData.data["type"];
    return this.actor.createOwnedItem(itemData);
  }

  /* -------------------------------------------- */

  /**
   * Handle editing an existing Owned Item for the Actor
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemEdit(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.getOwnedItem(li.dataset.itemId);
    item.sheet.render(true);
  }

  /* -------------------------------------------- */

  /**
   * Handle deleting an existing Owned Item for the Actor
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemDelete(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    this.actor.deleteOwnedItem(li.dataset.itemId);
  }

  /* -------------------------------------------- */

  /**
   * Handle rolling an Ability check, either a test or a saving throw
   * @param {Event} event   The originating click event
   * @private
   */
  _onRollAbilityTest(event) {
    event.preventDefault();
    let ability = event.currentTarget.parentElement.dataset.ability;
    this.actor.rollAbilityTest(ability, {event: event});
    //this.actor.rollAbility(ability, {event: event});
  }


  /* -------------------------------------------- */

  /**
   * Handle rolling a Saving Throw
   * @param {Event} event   The originating click event
   * @private
   */
  _onRollSavingThrow(event) {
    event.preventDefault();
    let save = event.currentTarget.parentElement.dataset.save;
    this.actor.rollAbilitySave(save, {event: event});
  }

  /* -------------------------------------------- */

  /**
   * Handle rolling a Skill check
   * @param {Event} event   The originating click event
   * @private
   */
  _onRollSkillCheck(event) {
    event.preventDefault();
    const skill = event.currentTarget.parentElement.dataset.skill;
    this.actor.rollSkill(skill, {event: event});
  }

  /* -------------------------------------------- */

  /**
   * Handle rolling a Thief Skill check
   * @param {Event} event   The originating click event
   * @private
   */
  _onRollThiefSkillCheck(event) {
    event.preventDefault();
    const thiefskill = event.currentTarget.parentElement.dataset.thiefskill;
    this.actor.rollThiefSkill(thiefskill, {event: event});
  }

  /* -------------------------------------------- */

  /**
   * Handle rolling a Turn Undead check
   * @param {Event} event   The originating click event
   * @private
   */
  _onRollTurnUndeadCheck(event) {
    event.preventDefault();
    const turnundead = event.currentTarget.parentElement.dataset.turnundead;
    this.actor.rollTurnUndead(turnundead, {event: event});
  }

  /* -------------------------------------------- */


  /**
   * Handle rolling a Morale check
   * @param {Event} event   The originating click event
   * @private
   */
  _onRollMoraleCheck(event) {
    event.preventDefault();
    const rolltype = event.currentTarget.parentElement.dataset.morale;
    this.actor.rollMorale(rolltype, {event: event});
  }

  /* -------------------------------------------- */


  /**
   * Handle toggling Ability score proficiency level
   * @param {Event} event     The originating click event
   * @private
   */
  _onToggleAbilityProficiency(event) {
    event.preventDefault();
    const field = event.currentTarget.previousElementSibling;
    this.actor.update({[field.name]: 1 - parseInt(field.value)});
  }

  /* -------------------------------------------- */

  /**
   * Handle toggling of filters to display a different set of owned items
   * @param {Event} event     The click event which triggered the toggle
   * @private
   */
  _onToggleFilter(event) {
    event.preventDefault();
    const li = event.currentTarget;
    const set = this._filters[li.parentElement.dataset.filter];
    const filter = li.dataset.filter;
    if ( set.has(filter) ) set.delete(filter);
    else set.add(filter);
    this.render();
  }

  /* -------------------------------------------- */

  /**
   * Handle spawning the TraitSelector application which allows a checkbox of multiple trait options
   * @param {Event} event   The click event which originated the selection
   * @private
   */
  _onTraitSelector(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const label = a.parentElement.querySelector("label");
    const choices = CONFIG.bfrpg[a.dataset.options];
    const options = { name: a.dataset.target, title: label.innerText, choices };
    new TraitSelector(this.actor, options).render(true)
  }

  /* -------------------------------------------- */

  /**
   * Handle spawning the TraitSelector application which allows a checkbox of multiple trait options
   * @param {Event} event   The click event which originated the selection
   * @private
   */
  _onMovementConfig(event) {
    event.preventDefault();
    new MovementConfig(this.object).render(true);
  }

  /* -------------------------------------------- */

  /** @override */
  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();

    // Add button to revert polymorph
    if ( !this.actor.isPolymorphed || this.actor.isToken ) return buttons;
    buttons.unshift({
      label: 'bfrpg.PolymorphRestoreTransformation',
      class: "restore-transformation",
      icon: "fas fa-backward",
      onclick: ev => this.actor.revertOriginalForm()
    });
    return buttons;
  }
}