/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Shared Partials
    "systems/bfrpg/templates/actors/parts/active-effects.html",

    // Actor Sheet Partials
    "systems/bfrpg/templates/actors/parts/actor-traits.html",
    "systems/bfrpg/templates/actors/parts/actor-inventory.html",
    "systems/bfrpg/templates/actors/parts/actor-features.html",
    "systems/bfrpg/templates/actors/parts/actor-spellbook.html",

    // Item Sheet Partials
    "systems/bfrpg/templates/items/parts/item-action.html",
    "systems/bfrpg/templates/items/parts/item-activation.html",
    "systems/bfrpg/templates/items/parts/item-description.html",
    "systems/bfrpg/templates/items/parts/item-mountable.html"
  ]);
};
