export const registerSystemSettings = function() {

  /**
   * Track the system version upon which point a migration was last applied
   */
  game.settings.register("bfrpg", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  /**
   * Register resting variants
   */
  game.settings.register("bfrpg", "restVariant", {
    name: "SETTINGS.BFRPGRestN",
    hint: "SETTINGS.BFRPGRestL",
    scope: "world",
    config: true,
    default: "normal",
    type: String,
    choices: {
      "normal": "SETTINGS.BFRPGRestPHB",
      "gritty": "SETTINGS.BFRPGRestGritty",
      "epic": "SETTINGS.BFRPGRestEpic",
    }
  });

  /**
   * Register diagonal movement rule setting
   */
  game.settings.register("bfrpg", "diagonalMovement", {
    name: "SETTINGS.BFRPGDiagN",
    hint: "SETTINGS.BFRPGDiagL",
    scope: "world",
    config: true,
    default: "555",
    type: String,
    choices: {
      "555": "SETTINGS.BFRPGDiagPHB",
      "5105": "SETTINGS.BFRPGDiagDMG",
      "EUCL": "SETTINGS.BFRPGDiagEuclidean",
    },
    onChange: rule => canvas.grid.diagonalRule = rule
  });

  /**
   * Register Initiative formula setting
   */
  game.settings.register("bfrpg", "initiativeDexTiebreaker", {
    name: "SETTINGS.BFRPGInitTBN",
    hint: "SETTINGS.BFRPGInitTBL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  /**
   * Require Currency Carrying Weight
   */
  game.settings.register("bfrpg", "currencyWeight", {
    name: "SETTINGS.BFRPGCurWtN",
    hint: "SETTINGS.BFRPGCurWtL",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  /**
   * Option to disable XP bar for session-based or story-based advancement.
   */
  game.settings.register("bfrpg", "disableExperienceTracking", {
    name: "SETTINGS.BFRPGNoExpN",
    hint: "SETTINGS.BFRPGNoExpL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  /**
   * Option to automatically collapse Item Card descriptions
   */
  game.settings.register("bfrpg", "autoCollapseItemCards", {
    name: "SETTINGS.BFRPGAutoCollapseCardN",
    hint: "SETTINGS.BFRPGAutoCollapseCardL",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: s => {
      ui.chat.render();
    }
  });

  /**
   * Option to allow GMs to restrict polymorphing to GMs only.
   */
  game.settings.register('bfrpg', 'allowPolymorphing', {
    name: 'SETTINGS.BFRPGAllowPolymorphingN',
    hint: 'SETTINGS.BFRPGAllowPolymorphingL',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean
  });

  /**
   * Remember last-used polymorph settings.
   */
  game.settings.register('bfrpg', 'polymorphSettings', {
    scope: 'client',
    default: {
      keepPhysical: false,
      keepMental: false,
      keepSaves: false,
      keepSkills: false,
      mergeSaves: false,
      mergeSkills: false,
      keepClass: false,
      keepFeats: false,
      keepSpells: false,
      keepItems: false,
      keepBio: false,
      keepVision: true,
      transformTokens: true
    }
  });
};
