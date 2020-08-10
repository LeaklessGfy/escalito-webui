import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IController } from '../../entities/game/IController';
import { IEmitter } from '../../entities/game/IEmitter';
import { IScene } from '../../entities/game/IScene';
import { IngredientGameObject } from '../../entities/game/IngredientGameObject';
import { IngredientKey } from '../../entities/static/Ingredient';
import { Store } from '../../store';
import { IngredientBuilder } from '../builders/IngredientBuilder';
import { LiquidEmitter } from '../cocktails/LiquidEmitter';
import { SpriteKey } from '../sprites/SpriteKey';
import { BarController } from './BarController';

export class IngredientController implements IController {
  public static readonly KEY = Symbol();

  private readonly _ingredients: Map<
    IngredientKey,
    IngredientGameObject
  > = new Map();

  public preload(scene: IScene): void {
    scene.load.image(SpriteKey.RumBottle, 'assets/bottle.rum.png');
  }

  public create(scene: IScene): void {
    const particle = scene.add.particles(SpriteKey.Square);
    const baseEmitter = particle.createEmitter({
      x: scene.settings.middleWidth,
      y: 10,
      active: true,
      on: false,
      gravityY: scene.settings.height
    });

    const barCtr = scene.getController<BarController>(BarController.KEY);
    const liquidEmitter = new LiquidEmitter(barCtr, baseEmitter);

    scene.inventory.ingredients$.subscribe(change => {
      if (change === undefined) {
        return;
      }

      switch (change.type) {
        case 'add':
        case 'update':
          return this.createOrUpdateIngredient(
            scene,
            liquidEmitter,
            change.newValue
          );
        case 'remove':
          return this.removeIngredient(change.oldValue);
      }
    });
  }

  public update(scene: IScene, delta: number): void {
    for (const ingredient of this._ingredients.values()) {
      ingredient.update(scene);
    }
  }

  public daily(scene: IScene, store: Store, day: number): void {}

  private createOrUpdateIngredient(
    scene: IScene,
    emitter: IEmitter,
    ingredient: IngredientExtended
  ) {
    console.log(ingredient);
    if (!this._ingredients.has(ingredient.provided.base.key)) {
      return this.createIngredient(scene, emitter, ingredient);
    }
    return this.updateIngredient(ingredient);
  }

  private createIngredient(
    scene: IScene,
    emitter: IEmitter,
    ingredient: IngredientExtended
  ) {
    const gameObject = new IngredientBuilder(
      scene,
      emitter,
      ingredient
    ).build();

    this._ingredients.set(ingredient.provided.base.key, gameObject);
  }

  private updateIngredient(ingredient: IngredientExtended) {
    const gameObject = this._ingredients.get(ingredient.provided.base.key);
    if (gameObject === undefined) {
      throw new Error('Can not update unexisting ingredient');
    }

    // Be careful, stock is the absolute value, so 'addStock' is not add but update
    gameObject.addProvided(ingredient.provided);
  }

  private removeIngredient(ingredient: IngredientExtended) {
    const gameObject = this._ingredients.get(ingredient.provided.base.key);
    if (gameObject === undefined) {
      throw new Error('Can not remove unexisting ingredient');
    }

    gameObject.removeProvided(ingredient.provided);

    if (gameObject.shouldDestroy()) {
      gameObject.destroy();
      this._ingredients.delete(ingredient.provided.base.key);
    }
  }
}
