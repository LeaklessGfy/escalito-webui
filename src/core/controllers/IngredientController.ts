import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IController } from '../../entities/game/IController';
import { IIngredientGameObject } from '../../entities/game/IIngredientGameObject';
import { IScene } from '../../entities/game/IScene';
import { IngredientKey } from '../../entities/static/Ingredient';
import { IngredientBuilder } from '../builders/IngredientBuilder';
import { LiquidEmitter } from '../cocktails/LiquidEmitter';
import { SpriteKey, toPath } from '../sprites/SpriteKey';
import { BarController } from './BarController';

export class IngredientController implements IController {
  public static readonly KEY = Symbol();

  private readonly _ingredients: Map<
    IngredientKey,
    IIngredientGameObject
  > = new Map();

  private _ingredientBuilder!: IngredientBuilder;

  /** Interface **/
  public preload(scene: IScene): void {
    scene.load.image(SpriteKey.BottleRum, toPath(SpriteKey.BottleRum));
    scene.load.image(SpriteKey.BottleCola, toPath(SpriteKey.BottleCola));
    scene.load.image(
      SpriteKey.BottleLemonade,
      toPath(SpriteKey.BottleLemonade)
    );
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

    this._ingredientBuilder = new IngredientBuilder(
      scene,
      liquidEmitter,
      liquidEmitter
    );

    scene.inventory.ingredients$.subscribe(change => {
      switch (change.type) {
        case 'add':
        case 'update':
          return this.createOrUpdateIngredient(change.newValue);
        case 'remove':
          return this.removeIngredient(change.oldValue);
      }
    });
    scene.inventory.initIngredients();
  }

  public update(scene: IScene, delta: number): void {
    for (const ingredient of this._ingredients.values()) {
      ingredient.update(scene);
    }
  }

  public rescale(): void {}

  /** Custom **/
  private createOrUpdateIngredient(ingredient: IngredientExtended) {
    if (!this._ingredients.has(ingredient.provided.base.key)) {
      return this.createIngredient(ingredient);
    }
    return this.updateIngredient(ingredient);
  }

  private createIngredient(ingredient: IngredientExtended) {
    const gameObject = this._ingredientBuilder.build(
      ingredient,
      this._ingredients.size
    );
    this._ingredients.set(ingredient.provided.base.key, gameObject);
  }

  private updateIngredient(ingredient: IngredientExtended) {
    const gameObject = this._ingredients.get(ingredient.provided.base.key);
    if (gameObject === undefined) {
      throw new Error('Can not update unexisting ingredient');
    }
    gameObject.addProvided(ingredient);
  }

  private removeIngredient(ingredient: IngredientExtended) {
    const gameObject = this._ingredients.get(ingredient.provided.base.key);
    if (gameObject === undefined) {
      throw new Error('Can not remove unexisting ingredient');
    }
    gameObject.removeProvided(ingredient);
    if (gameObject.isEmpty()) {
      gameObject.destroy();
      this._ingredients.delete(ingredient.provided.base.key);
    }
  }
}
