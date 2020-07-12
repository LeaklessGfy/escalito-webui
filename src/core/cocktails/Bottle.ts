import { Ingredient, IngredientKey } from '../../entities/static/Ingredient';
import { SelectController } from '../controllers/SelectControllers';
import { IScene } from '../scenes/IScene';
import { Point } from '../sprites/Point';
import { SpriteKey } from '../sprites/SpriteKey';

export class Bottle {
  private readonly _sprite: Phaser.GameObjects.Sprite;
  private readonly _emitter: Phaser.GameObjects.Particles.ParticleEmitter & {
    source?: Ingredient;
  };

  private readonly _ingredient: Ingredient;
  private readonly _initialPosition: Point;

  private _fullStock: number;
  private _currentStock: number;
  private _isFlowing: boolean;

  constructor(
    sprite: Phaser.GameObjects.Sprite,
    emitter: Phaser.GameObjects.Particles.ParticleEmitter,
    ingredient: Ingredient,
    stock: number
  ) {
    this._sprite = sprite;
    this._emitter = emitter;

    this._ingredient = ingredient;
    this._initialPosition = { x: sprite.x, y: sprite.y };

    this._fullStock = stock;
    this._currentStock = stock;
    this._isFlowing = false;
  }

  public turnOn(position: Point): void {
    const x = position.x + this._sprite.displayHeight / 2;
    const y = position.y + this._sprite.displayWidth / 2;

    this._sprite.setRotation(80);
    this._sprite.setPosition(x, y);
    this._isFlowing = true;

    //if (this._currentStock > 0) {
    // play particule system
    this._emitter.start();
    this._emitter.setTint(this._ingredient.color);
    this._emitter.setPosition(position.x, y + 10);
    this._emitter.source = this._ingredient;
    //}
  }

  public turnOff(): void {
    this._sprite.setRotation(0);
    this._sprite.setPosition(this._initialPosition.x, this._initialPosition.y);
    this._isFlowing = false;

    this._emitter.stop();
    this._emitter.source = undefined;
  }

  public charge() {
    this._currentStock = this._fullStock;
  }

  public update(scene: IScene) {
    if (!scene.input.activePointer.isDown && this._isFlowing) {
      this.turnOff();
    }
  }

  public static buildRum(
    scene: IScene,
    emitter: Phaser.GameObjects.Particles.ParticleEmitter
  ): Bottle {
    const { x, y } = scene.settings.bottlePosition;
    const sprite = scene.add.sprite(x, y, SpriteKey.RumBottle);
    sprite.setY(y - sprite.displayHeight / 2).setName('Rum');

    const ingredient = scene.store.ingredients.get(IngredientKey.Rum);
    const stock = scene.inventory.getGlobalIngredientStock(IngredientKey.Rum);

    if (ingredient === undefined) {
      throw new Error('Ingredient is not defiend globally');
    }

    const bottle = new Bottle(sprite, emitter, ingredient, stock);
    const position = {
      x: scene.settings.middleWidth,
      y: 0
    };

    sprite.setInteractive();
    sprite.on('pointerdown', () => {
      bottle.turnOn(position);
    });

    const selectCtr = scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(scene, sprite);

    return bottle;
  }
}
