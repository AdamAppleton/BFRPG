/**
 * The Basic Fantasy RPG game system for Foundry Virtual Tabletop
 * Forked from DnD5e 0.96 by Atropos
 * Author: ChipMonkster
 * Software License: GNU GPLv3
 * Game System: https://www.basicfantasy.org
 * Repository: https://gitlab.com/~~~~/bfrpg
 * Issue Tracker: https://gitlab.com/~~~~~/bfrpg/issues
 */

// Import Modules
import { bfrpg } from "./module/config.js";
import { registerSystemSettings } from "./module/settings.js";
import { preloadHandlebarsTemplates } from "./module/templates.js";
import { _getInitiativeFormula } from "./module/combat.js";
import { measureDistances, getBarAttribute } from "./module/canvas.js";

// Import Entities
import ActorBFRPG from "./module/actor/entity.js";
import ItemBFRPG from "./module/item/entity.js";

// Import Applications
import AbilityTemplate from "./module/pixi/ability-template.js";
import AbilityUseDialog from "./module/apps/ability-use-dialog.js";
import ActorSheetFlags from "./module/apps/actor-flags.js";
import ActorSheetBFRPGCharacter from "./module/actor/sheets/character.js";
import ActorSheetBFRPGNPC from "./module/actor/sheets/npc.js";
import ActorSheetBFRPGVehicle from "./module/actor/sheets/vehicle.js";
import ItemSheetBFRPG from "./module/item/sheet.js";
import ShortRestDialog from "./module/apps/short-rest.js";
import TraitSelector from "./module/apps/trait-selector.js";
import MovementConfig from "./module/apps/movement-config.js";

// Import Helpers
import * as chat from "./module/chat.js";
import * as dice from "./module/dice.js";
import * as macros from "./module/macros.js";
import * as migrations from "./module/migration.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", function() {
  console.log(`bfrpg | Initializing the bfrpg Game System\n${bfrpg.ASCII}`);

  // Create a namespace within the game global
  game.bfrpg = {
    applications: {
      AbilityUseDialog,
      ActorSheetFlags,
      ActorSheetBFRPGCharacter,
      ActorSheetBFRPGNPC,
      ActorSheetBFRPGVehicle,
      ItemSheetBFRPG,
      ShortRestDialog,
      TraitSelector,
      MovementConfig
    },
    canvas: {
      AbilityTemplate
    },
    config: bfrpg,
    dice: dice,
    entities: {
      ActorBFRPG,
      ItemBFRPG,
    },
    macros: macros,
    migrations: migrations,
    rollItemMacro: macros.rollItemMacro
  };

  // Record Configuration Values
  CONFIG.bfrpg = bfrpg;
  CONFIG.Actor.entityClass = ActorBFRPG;
  CONFIG.Item.entityClass = ItemBFRPG;
  CONFIG.time.roundTime = 6;

  // Register System Settings
  registerSystemSettings();

  // Patch Core Functions
  CONFIG.Combat.initiative.formula = "1d20 + @attributes.init.mod + @attributes.init.prof + @attributes.init.bonus";
  Combat.prototype._getInitiativeFormula = _getInitiativeFormula;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("bfrpg", ActorSheetBFRPGCharacter, {
    types: ["character"],
    makeDefault: true,
    label: "bfrpg.SheetClassCharacter"
  });
  Actors.registerSheet("bfrpg", ActorSheetBFRPGNPC, {
    types: ["npc"],
    makeDefault: true,
    label: "bfrpg.SheetClassNPC"
  });
  Actors.registerSheet('bfrpg', ActorSheetBFRPGVehicle, {
    types: ['vehicle'],
    makeDefault: true,
    label: "bfrpg.SheetClassVehicle"
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("bfrpg", ItemSheetBFRPG, {
    makeDefault: true,
    label: "bfrpg.SheetClassItem"
  });

  // Preload Handlebars Templates
  preloadHandlebarsTemplates();
});


/* -------------------------------------------- */
/*  Foundry VTT Setup                           */
/* -------------------------------------------- */

/**
 * This function runs after game data has been requested and loaded from the servers, so entities exist
 */
Hooks.once("setup", function() {

  // Localize CONFIG objects once up-front
  const toLocalize = [
    "abilities", "abilityAbbreviations", "abilityActivationTypes", "abilityConsumptionTypes", "actorSizes", "alignments",
    "conditionTypes", "consumableTypes", "cover", "currencies", "damageResistanceTypes", // "armorProficiencies", 
    "damageTypes", "distanceUnits", "equipmentTypes", "healingTypes", "itemActionTypes", "languages",
    "limitedUsePeriods", "movementUnits", "polymorphSettings", "proficiencyLevels", "senses", "skills",
    "spellComponents", "spellLevels", "spellPreparationModes", "spellScalingModes", "spellSchools", "targetTypes",
    "timePeriods", "toolProficiencies", "weaponProperties", "weaponTypes", "races", "gender", "saves"  // "weaponProficiencies", 
  ];

  // Exclude some from sorting where the default order matters
  const noSort = [
    "abilities", "alignments", "currencies", "distanceUnits", "movementUnits", "itemActionTypes", "proficiencyLevels",
    "limitedUsePeriods", "spellComponents", "spellLevels", "spellPreparationModes", "weaponTypes", "saves"
  ];

  // Localize and sort CONFIG objects
  for ( let o of toLocalize ) {
    const localized = Object.entries(CONFIG.bfrpg[o]).map(e => {
      return [e[0], game.i18n.localize(e[1])];
    });
    if ( !noSort.includes(o) ) localized.sort((a, b) => a[1].localeCompare(b[1]));
    CONFIG.bfrpg[o] = localized.reduce((obj, e) => {
      obj[e[0]] = e[1];
      return obj;
    }, {});
  }
});

/* -------------------------------------------- */

/**
 * Once the entire VTT framework is initialized, check to see if we should perform a data migration
 */
Hooks.once("ready", function() {

  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => macros.createBFRPGMacro(data, slot));

  // Determine whether a system migration is required and feasible
  if ( !game.user.isGM ) return;
  const currentVersion = game.settings.get("bfrpg", "systemMigrationVersion");
  const NEEDS_MIGRATION_VERSION = "0.00";
  const COMPATIBLE_MIGRATION_VERSION = 1.00;
  const needsMigration = currentVersion && isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion);
  if ( !needsMigration ) return;

  // Perform the migration
  if ( currentVersion && isNewerVersion(COMPATIBLE_MIGRATION_VERSION, currentVersion) ) {
    const warning = `Your BFRPG system data is from too old a Foundry version and cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.`;
    ui.notifications.error(warning, {permanent: true});
  }
  migrations.migrateWorld();
});

/* -------------------------------------------- */
/*  Canvas Initialization                       */
/* -------------------------------------------- */

Hooks.on("canvasInit", function() {

  // Extend Diagonal Measurement
  canvas.grid.diagonalRule = game.settings.get("bfrpg", "diagonalMovement");
  SquareGrid.prototype.measureDistances = measureDistances;

  // Extend Token Resource Bars
  Token.prototype.getBarAttribute = getBarAttribute;
});


/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */

Hooks.on("renderChatMessage", (app, html, data) => {

  // Display action buttons
  chat.displayChatActionButtons(app, html, data);

  // Highlight critical success or failure die
  chat.highlightCriticalSuccessFailure(app, html, data);

  // Optionally collapse the content
  if (game.settings.get("bfrpg", "autoCollapseItemCards")) html.find(".card-content").hide();
});
Hooks.on("getChatLogEntryContext", chat.addChatMessageContextOptions);
Hooks.on("renderChatLog", (app, html, data) => ItemBFRPG.chatListeners(html));
Hooks.on("renderChatPopout", (app, html, data) => ItemBFRPG.chatListeners(html));
Hooks.on('getActorDirectoryEntryContext', ActorBFRPG.addDirectoryContextOptions);

// TODO I should remove this
Handlebars.registerHelper('getProperty', function (data, property) {
  return getProperty(data, property);
});
