
/**
 * Override the default Initiative formula to customize special behaviors of the system.
 * Apply advantage, proficiency, or bonuses where appropriate
 * Apply the dexterity score as a decimal tiebreaker if requested
 * See Combat._getInitiativeFormula for more detail.
 */
export const _getInitiativeFormula = function(combatant) {
  const actor = combatant.actor;
  if ( !actor ) return "1d12";
  const init = actor.data.data.attributes.init;

  let nd = 1;
  let mods = "";
  
  if (actor.getFlag("bfrpg", "halflingLucky")) mods += "r=1";
  if (actor.getFlag("bfrpg", "initiativeAdv")) {
    nd = 2;
    mods += "kh";
  }

  const parts = [`${nd}d12${mods}`, init.mod, (init.prof !== 0) ? init.prof : null, (init.bonus !== 0) ? init.bonus : null];

  // Optionally apply Dexterity tiebreaker
  const tiebreaker = game.settings.get("bfrpg", "initiativeDexTiebreaker");
  if ( tiebreaker ) parts.push(actor.data.data.abilities.dex.value / 100);
  return parts.filter(p => p !== null).join(" + ");
};

/**
 * When the Combat encounter updates - re-render open Actor sheets for combatants in the encounter.
 */
Hooks.on("updateCombat", (combat, data, options, userId) => {
  const updateTurn = ("turn" in data) || ("round" in data);
  if ( !updateTurn ) return;
  for ( let t of combat.turns ) {
    const a = t.actor;
    if ( t.actor ) t.actor.sheet.render(false);
  }
});
