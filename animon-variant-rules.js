import AnimonCharacterSheet from '/systems/animon/module/sheets/AnimonCharacterSheet.js';
import UpdatedAnimonCharacterSheet from '/modules/animon-damage-update/module/sheets/AnimonCharacterSheet.js';
import VariantAnimonCharacterSheet from './module/sheets/AnimonCharacterSheet.js';

Hooks.once("init", () => {
  console.log('Animon | Registering Variant Rules');
  
  game.settings.register('animon-variant-rules', 'maxLevel', {
    name: 'Max Level Override',
    hint: 'Extend play beyond level 10. (0 to set no limit.)',
    scope: 'world',
    config: true,
    default: 10,
    type: Number,
  });

  game.settings.register('animon-variant-rules', 'maxBoosts', {
    name: 'Max Score Improvements.',
    hint: 'Set Maximum number of Score Improvements. (0 to set no limit.)',
    scope: 'world',
    config: true,
    default: 2,
    type: Number,
  });

  console.log('Animon | Updating Character Sheets to use Variant Rules');

  Actors.unregisterSheet('animon', AnimonCharacterSheet);
  Actors.unregisterSheet('animon', UpdatedAnimonCharacterSheet);

  DocumentSheetConfig.registerSheet(Actors, "animon", VariantAnimonCharacterSheet, {
    label: "Variant Animon Sheet",
    types: ["animon", "child"],
    makeDefault: true
  });

  console.log('Animon | Registering Variant Rules Handlebars Helpers');
  
  Handlebars.registerHelper('advancementLimits', () => {
    const limits = {
      min: 0,
      max: game.settings.get('animon-variant-rules', 'maxBoosts')
    };

    return limits;
    // return Handlebars.SafeString(JSON.stringify(limits));
  });

  Handlebars.registerHelper('levelLimits', (options) => {
    const limits = {
      min: 1,
      max: game.settings.get('animon-variant-rules', 'maxLevel')
    };

    return limits;
    // return options.fn(limits);
    // return Handlebars.SafeString(JSON.stringify(limits));
  });

  //preloadHandlebarsTemplates();
});