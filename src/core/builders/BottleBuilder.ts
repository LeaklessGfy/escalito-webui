import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IEmitter } from '../../entities/game/IEmitter';
import { IPoint } from '../../entities/game/IPoint';
import { IScene } from '../../entities/game/IScene';
import { IngredientKey } from '../../entities/static/Ingredient';
import { Bottle } from '../cocktails/Bottle';
import { BarController } from '../controllers/BarController';
import { SelectController } from '../controllers/SelectController';
import { Bar } from '../sprites/Bar';
import { SpriteKey } from '../sprites/SpriteKey';

export const IngredientToSprite: { [key in IngredientKey]: SpriteKey } = {
  [IngredientKey.Rum]: SpriteKey.BottleRum,
  [IngredientKey.Cola]: SpriteKey.BottleCola,
  [IngredientKey.Lemonade]: SpriteKey.BottleLemonade,
  [IngredientKey.Lemon]: SpriteKey.BottleRum,
  [IngredientKey.Strawberry]: SpriteKey.BottleRum
};

export class BottleBuilder {
  private readonly _scene: IScene;

  public readonly emitter: IEmitter;
  public ingredient!: IngredientExtended;
  public nb!: number;
  public sprite!: Phaser.GameObjects.Sprite;
  public stockBar!: Bar;

  public constructor(scene: IScene, emitter: IEmitter) {
    this._scene = scene;
    this.emitter = emitter;
  }

  public get barCtr(): BarController {
    return this._scene.getController<BarController>(BarController.KEY);
  }

  public get glassPosition(): IPoint {
    return this._scene.settings.middleDimension;
  }

  public build(ingredient: IngredientExtended, nb: number): Bottle {
    this.ingredient = ingredient;
    this.nb = nb;
    this.buildSprite();
    this.buildStockBar();

    return new Bottle(this);
  }

  private buildSprite() {
    const { x, y } = this._scene.settings.bottle;
    const sprite = this._scene.add.sprite(
      x,
      y,
      IngredientToSprite[this.ingredient.provided.base.key]
    );

    sprite
      .setX(x + (10 + sprite.displayWidth) * this.nb)
      .setY(y - sprite.displayHeight / 2)
      .setName(this.ingredient.provided.base.name)
      .setInteractive();

    const ctr = this._scene.getController<SelectController>(
      SelectController.KEY
    );
    ctr.addSelect(this._scene, sprite);

    this.sprite = sprite;
  }

  private buildStockBar() {
    const background = this._scene.add.graphics().setDepth(2);
    const foreground = this._scene.add.graphics().setDepth(3);

    this.stockBar = new Bar(background, foreground);
  }
}
