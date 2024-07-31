import AnimonCharacterSheet from '/systems/animon/module/sheets/AnimonCharacterSheet.js';

export default class VariantAnimonCharacterSheet extends AnimonCharacterSheet {

  /** @override */
  get template() {
    return "modules/animon-variant-rules/templates/sheets/" + this.actor.type + "-sheet.hbs";
  }

  /** @override */
  async getData() {
    let data = super.getData();

    data = await this._prepareVariantData(this.actor.type, await data);

    return data;
}

async _prepareVariantData(type, data) {
  switch(type) {
    case 'child':
      data.data.system.limits = { level: game.settings.get('animon-variant-rules', 'maxLevel') };
      break;
    case 'animon':
      data.data.system.limits = { advancement: game.settings.get('animon-variant-rules', 'maxBoosts')};
      const advancement = data.data.system.advancement;
      //Initialize values if unset.
      ['damage', 'maxHP', 'dodge', 'initiative'].map(key => {
        if (advancement[key] === undefined) {
          // const update = `system.advancement.${key}`;
          // this.actor.update({ [update]: advancement[`${key}1`] + advancement[`${key}2`]});
          data.actor.system.advancement[key] = advancement[`${key}1`] + advancement[`${key}2`];
          data.data.system.advancement[key] = advancement[`${key}1`] + advancement[`${key}2`];
        }
      });

      // data.data.system.advancement.damage = advancement.damage || advancement.damage1 + advancement.damage2;
      // data.data.system.advancement.maxHP = advancement.maxHP || advancement.maxHP1 + advancement.maxHP2;
      // data.data.system.advancement.dodge = advancement.dodge || advancement.dodge1 + advancement.dodge2;
      // data.data.system.advancement.initiative = advancement.initiative || advancement.initiative1 + advancement.initiative2;
      break;
    case 'npc':
      break;
  }

  return data;
}


  _onUpdateDamage(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let power = parseFloat(element.value);
    let damage = 0;
    let advancement = this.actor.system.advancement.damage || 0;

    switch (element.dataset.stage) {
      case "1":
        damage = power + advancement;
        this.actor.update({ "system.fledgling.damage": damage });
        break;
      case "2":
        damage = 2 * power + advancement;
        this.actor.update({ "system.basic.damage": damage });
        break;
      case "3":
        damage = 2 * power + advancement;
        this.actor.update({ "system.super.damage": damage });
        break;
      case "4":
        damage = 3 * power + advancement;
        this.actor.update({ "system.ultra.damage": damage });
        break;
      case "5":
        damage = 4 * power + advancement;
        this.actor.update({ "system.giga.damage": damage });
        break;
    }
  }

  _onAdvanceDamage(event) {
    event.preventDefault();
    let damage = 0;
    let advancement = this.actor.system.advancement.damage || 0;

    damage = this.actor.system.fledgling.stats.power + advancement;
    this.actor.update({ "system.fledgling.damage": damage });

    damage = this.actor.system.basic.stats.power * 2 + advancement;
    this.actor.update({ "system.basic.damage": damage });

    damage = this.actor.system.super.stats.power * 2 + advancement;
    this.actor.update({ "system.super.damage": damage });

    damage = this.actor.system.ultra.stats.power * 3 + advancement;
    this.actor.update({ "system.ultra.damage": damage });

    damage = this.actor.system.giga.stats.power * 4 + advancement;
    this.actor.update({ "system.giga.damage": damage });
  }

  _onUpdateHitPoints(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let heart = parseFloat(element.value);
    let hitPoints = 0;
    let advancement = this.actor.system.advancement.maxHP || 0;

    switch (element.dataset.stage) {
      case "1":
        hitPoints = 3 * heart + advancement;
        this.actor.update({ "system.fledgling.wounds.max": hitPoints });
        break;
      case "2":
        hitPoints = 5 + 3 * heart + advancement;
        this.actor.update({ "system.basic.wounds.max": hitPoints });
        break;
      case "3":
        hitPoints = 10 + 4 * heart + advancement;
        this.actor.update({ "system.super.wounds.max": hitPoints });
        break;
      case "4":
        hitPoints = 15 + 5 * heart + advancement;
        this.actor.update({ "system.ultra.wounds.max": hitPoints });
        break;
      case "5":
        hitPoints = 20 + 6 * heart + advancement;
        this.actor.update({ "system.giga.wounds.max": hitPoints });
        break;
    }
  }

  _onAdvanceHitPoints(event) {
    event.preventDefault();
    let hitPoints = 0;
    let advancement = this.actor.system.advancement.maxHP || 0;
    let difference = this.actor.system.wounds.max - this.actor.system.wounds.value;
    let currentHitPoints = 0;

    hitPoints = 3 * this.actor.system.fledgling.stats.heart + advancement;
    this.actor.update({ "system.fledgling.wounds.max": hitPoints });
    if (this.actor.system.stage == "1") {
      currentHitPoints = hitPoints
    }

    hitPoints = 5 + 3 * this.actor.system.basic.stats.heart + advancement;
    this.actor.update({ "system.basic.wounds.max": hitPoints });
    if (this.actor.system.stage == "2") {
      currentHitPoints = hitPoints
    }

    hitPoints = 10 + 4 * this.actor.system.super.stats.heart + advancement;
    this.actor.update({ "system.super.wounds.max": hitPoints });
    if (this.actor.system.stage == "3") {
      currentHitPoints = hitPoints
    }

    hitPoints = 15 + 5 * this.actor.system.ultra.stats.heart + advancement;
    this.actor.update({ "system.ultra.wounds.max": hitPoints });
    if (this.actor.system.stage == "4") {
      currentHitPoints = hitPoints
    }

    hitPoints = 20 + 6 * this.actor.system.giga.stats.heart + advancement;
    this.actor.update({ "system.giga.wounds.max": hitPoints });
    if (this.actor.system.stage == "5") {
      currentHitPoints = hitPoints
    }

    this.actor.update({ "system.wounds.max": currentHitPoints });
    this.actor.update({ "system.wounds.value": currentHitPoints - difference });
  }

  _onUpdateDodge(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let dodge = parseFloat(element.value) + (this.actor.system.advancement.dodge || 0);

    switch (element.dataset.stage) {
      case "1":
        this.actor.update({ "system.fledgling.dodge": dodge });
        break;
      case "2":
        this.actor.update({ "system.basic.dodge": dodge });
        break;
      case "3":
        this.actor.update({ "system.super.dodge": dodge });
        break;
      case "4":
        this.actor.update({ "system.ultra.dodge": dodge });
        break;
      case "5":
        this.actor.update({ "system.giga.dodge": dodge });
        break;
    }
  }

  _onAdvanceDodge(event) {
    event.preventDefault();
    let dodge = 0;
    let advancement = this.actor.system.advancement.dodge || 0;

    dodge = this.actor.system.fledgling.stats.agility + advancement;
    this.actor.update({ "system.fledgling.dodge": dodge });

    dodge = this.actor.system.basic.stats.agility + advancement;
    this.actor.update({ "system.basic.dodge": dodge });

    dodge = this.actor.system.super.stats.agility + advancement;
    this.actor.update({ "system.super.dodge": dodge });

    dodge = this.actor.system.ultra.stats.agility + advancement;
    this.actor.update({ "system.ultra.dodge": dodge });

    dodge = this.actor.system.giga.stats.agility + advancement;
    this.actor.update({ "system.giga.dodge": dodge });
  }

  _onUpdateInitiative(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let initiative = parseFloat(element.value) + (this.actor.system.advancement.initiative || 0);

    switch (element.dataset.stage) {
      case "1":
        this.actor.update({ "system.fledgling.initiative": initiative });
        this.actor.update({ "system.fledgling.sigUses.max": initiative });
        if (this.actor.system.stage == "1") {
          this.actor.update({ "system.initiative": initiative });
        }
        break;
      case "2":
        this.actor.update({ "system.basic.initiative": initiative });
        this.actor.update({ "system.basic.sigUses.max": initiative });
        if (this.actor.system.stage == "2") {
          this.actor.update({ "system.initiative": initiative });
        }
        break;
      case "3":
        this.actor.update({ "system.super.initiative": initiative });
        this.actor.update({ "system.super.sigUses.max": initiative });
        if (this.actor.system.stage == "3") {
          this.actor.update({ "system.initiative": initiative });
        }
        break;
      case "4":
        this.actor.update({ "system.ultra.initiative": initiative });
        this.actor.update({ "system.ultra.sigUses.max": initiative });
        if (this.actor.system.stage == "4") {
          this.actor.update({ "system.initiative": initiative });
        }
        break;
      case "5":
        this.actor.update({ "system.giga.initiative": initiative });
        this.actor.update({ "system.giga.sigUses.max": initiative });
        if (this.actor.system.stage == "5") {
          this.actor.update({ "system.initiative": initiative });
        }
        break;
    }
  }

  _onAdvanceInitiative(event) {
    event.preventDefault();
    let initiative = 0;
    let advancement = this.actor.system.advancement.initiative || 0;

    initiative = this.actor.system.fledgling.stats.brains + advancement;
    this.actor.update({ "system.fledgling.initiative": initiative });
    this.actor.update({ "system.fledgling.sigUses.max": initiative });

    initiative = this.actor.system.basic.stats.brains + advancement;
    this.actor.update({ "system.basic.initiative": initiative });
    this.actor.update({ "system.basic.sigUses.max": initiative });

    initiative = this.actor.system.super.stats.brains + advancement;
    this.actor.update({ "system.super.initiative": initiative });
    this.actor.update({ "system.super.sigUses.max": initiative });

    initiative = this.actor.system.ultra.stats.brains + advancement;
    this.actor.update({ "system.ultra.initiative": initiative });
    this.actor.update({ "system.ultra.sigUses.max": initiative });

    initiative = this.actor.system.giga.stats.brains + advancement;
    this.actor.update({ "system.giga.initiative": initiative });
    this.actor.update({ "system.giga.sigUses.max": initiative });
  }

  // /** @override */
  // _onUpdateBondLevel(event) {
  //   event.preventDefault();
  //   const limits = {
  //     min: 1,
  //     max: game.settings.get('animon-variant-rules', 'maxLevel')
  //   };

  //   let element = event.currentTarget;
  //   let bondLevel = parseFloat(element.value);
  //   let changed = false;

  //   if (bondLevel < limits.min) {
  //     bondLevel = limits.min;
  //     changed = true;
  //   }
  //   else if (bondLevel > limits.max) {
  //     bondLevel = limits.max;
  //     changed = true;
  //   }

  //   if (changed) {
  //     console.log(this.actor, bondLevel);
  //     this.actor.update({ "system.bondLevel": bondLevel });
  //   }

  //   super._onUpdateBondLevel(event);
  // }
}