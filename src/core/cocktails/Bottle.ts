import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { BarController } from '../controllers/BarController';
import { SelectController } from '../controllers/SelectControllers';
import { IScene } from '../scenes/IScene';
import { Point } from '../sprites/Point';
import { SpriteKey } from '../sprites/SpriteKey';
import { GameIngredient } from './GameIngredient';

export class Bottle implements GameIngredient {
  private readonly _sprite: Phaser.GameObjects.Sprite;
  private readonly _ingredient: IngredientExtended;
  private readonly _emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private readonly _barCtr: BarController;

  private _initialPosition?: Point;
  private _glassPosition?: Point;

  private _currentStock: number;
  private _isFlowing: boolean;

  constructor(
    sprite: Phaser.GameObjects.Sprite,
    ingredient: IngredientExtended,
    emitter: Phaser.GameObjects.Particles.ParticleEmitter,
    barCtr: BarController
  ) {
    this._sprite = sprite;
    this._ingredient = ingredient;
    this._emitter = emitter;
    this._barCtr = barCtr;

    this._currentStock = ingredient.stock;
    this._isFlowing = false;
  }

  public turnOn(position: Point): void {
    this._isFlowing = true;
    this._initialPosition = { x: this._sprite.x, y: this._sprite.y };
    this._glassPosition = {
      x: position.x + this._sprite.displayHeight / 2,
      y: position.y + this._sprite.displayWidth / 1.2
    };
  }

  public turnOff(): void {
    this._isFlowing = false;
    this._emitter.stop();
  }

  public charge(): void {
    this._currentStock = this._ingredient.stock;
  }

  public update(scene: IScene): void {
    const glass = this._barCtr.glass;

    if (glass !== undefined) {
      this._emitter.forEachAlive(p => {
        if (glass.body.hitTest(p.x, p.y)) {
          glass.addIngredient(this._ingredient.provided.base);
          this.removeStock(1);
          p.lifeCurrent = 0;
        }
      }, scene);
    }

    if (this._isFlowing) {
      this.flow(scene);
    } else {
      this.unflow(scene);
    }
  }

  public removeStock(nb: number): void {
    this._currentStock -= 1;
  }

  private flow(scene: IScene) {
    if (!scene.input.activePointer.isDown) {
      return this.turnOff();
    }

    if (this._glassPosition === undefined) {
      return;
    }

    if (this._sprite.angle > -80) {
      this._sprite.angle -= 5;
    }

    const hasArrived = this.moveTo(this._glassPosition);

    if (hasArrived) {
      this._emitter.setTint(this._ingredient.provided.base.color);
      this._emitter.setPosition(
        this._glassPosition.x - this._sprite.displayHeight / 2,
        this._glassPosition.y + 10
      );
      this._emitter.start();
    }
  }

  private unflow(scene: IScene) {
    if (this._initialPosition === undefined) {
      return;
    }

    if (this._sprite.angle < 0) {
      this._sprite.angle += 5;
    }

    this.moveTo(this._initialPosition);
  }

  private moveTo(point: Point): boolean {
    const { x, y } = this._sprite;
    let move = false;

    if (Math.abs(x - point.x) > 2) {
      const dirX = point.x < x ? -1 : 1;
      this._sprite.setX(x + 5 * dirX);
      move = true;
    }

    if (Math.abs(y - point.y) > 1) {
      const dirY = point.y < y ? -1 : 1;
      this._sprite.setY(y + 2 * dirY);
      move = true;
    }

    return move;
  }

  public static build(
    scene: IScene,
    ingredient: IngredientExtended,
    emitter: Phaser.GameObjects.Particles.ParticleEmitter
  ): Bottle {
    const { x, y } = scene.settings.bottlePosition;
    const sprite = scene.add.sprite(x, y, SpriteKey.RumBottle);
    const barCtr = scene.getController<BarController>(BarController.KEY);
    const bottle = new Bottle(sprite, ingredient, emitter, barCtr);

    sprite
      .setY(y - sprite.displayHeight / 2)
      .setName(ingredient.provided.base.name)
      .setInteractive()
      .on('pointerdown', () => {
        bottle.turnOn({ x: scene.settings.middleWidth, y: 0 });
      });

    const selectCtr = scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(scene, sprite);

    return bottle;
  }
}
