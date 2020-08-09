import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IngredientKey } from '../../entities/static/Ingredient';
import { Bottle } from '../cocktails/Bottle';
import { IEmitter } from '../cocktails/IEmitter';
import { BarController } from '../controllers/BarController';
import { SelectController } from '../controllers/SelectControllers';
import { IScene } from '../scenes/IScene';
import { Bar } from '../sprites/Bar';
import { SpriteKey } from '../sprites/SpriteKey';

export const IngredientToSprite: { [key in IngredientKey]: SpriteKey } = {
  [IngredientKey.Rum]: SpriteKey.RumBottle,
  [IngredientKey.Cola]: SpriteKey.RumBottle,
  [IngredientKey.Lemonade]: SpriteKey.RumBottle,
  [IngredientKey.Lemon]: SpriteKey.RumBottle,
  [IngredientKey.Strawberry]: SpriteKey.RumBottle
};

export class BottleBuilder {
  private readonly _scene: IScene;
  private readonly _ingredient: IngredientExtended;
  private readonly _emitter: IEmitter;

  private _sprite?: Phaser.GameObjects.Sprite;
  private _stockBar?: Bar;

  constructor(
    scene: IScene,
    ingredient: IngredientExtended,
    emitter: IEmitter
  ) {
    this._scene = scene;
    this._ingredient = ingredient;
    this._emitter = emitter;
  }

  public get sprite(): Phaser.GameObjects.Sprite {
    if (this._sprite === undefined) {
      throw new Error('Can not access sprite on un-build builder');
    }
    return this._sprite;
  }

  public get stockBar(): Bar {
    if (this._stockBar === undefined) {
      throw new Error('Can not access stock bar on un-build builder');
    }
    return this._stockBar;
  }

  public get ingredient(): IngredientExtended {
    return this._ingredient;
  }

  public get emitter(): IEmitter {
    return this._emitter;
  }

  public get barCtr(): BarController {
    return this._scene.getController<BarController>(BarController.KEY);
  }

  public build(): Bottle {
    this.buildSprite();
    this.buildStockBar();

    return new Bottle(this);
  }

  private buildSprite() {
    const { x, y } = this._scene.settings.bottlePosition;
    const sprite = this._scene.add.sprite(
      x,
      y,
      IngredientToSprite[this._ingredient.provided.base.key]
    );

    sprite
      .setY(y - sprite.displayHeight / 2)
      .setName(this._ingredient.provided.base.name)
      .setInteractive();

    const ctr = this._scene.getController<SelectController>(
      SelectController.KEY
    );
    ctr.addSelect(this._scene, sprite);

    this._sprite = sprite;
  }

  private buildStockBar() {
    const background = this._scene.add.graphics().setDepth(2);
    const foreground = this._scene.add.graphics().setDepth(3);

    this._stockBar = new Bar(background, foreground);
  }
}
