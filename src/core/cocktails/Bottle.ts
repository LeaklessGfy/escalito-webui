import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IEmitter } from '../../entities/game/IEmitter';
import { IPoint } from '../../entities/game/IPoint';
import { IScene } from '../../entities/game/IScene';
import { IngredientGameObject } from '../../entities/game/IngredientGameObject';
import { BottleBuilder } from '../builders/BottleBuilder';
import { Bar } from '../sprites/Bar';

export class Bottle implements IngredientGameObject {
  private static readonly STOCK_BAR_HEIGHT: number = 5;

  private readonly _ingredient: IngredientExtended;
  private readonly _sprite: Phaser.GameObjects.Sprite;
  private readonly _emitter: IEmitter;
  private readonly _stockBar: Bar;

  private _initialPosition?: IPoint;
  private _glassPosition?: IPoint;

  private _currentStock: number;
  private _isFlowing: boolean;

  constructor(builder: BottleBuilder) {
    this._ingredient = builder.ingredient;
    this._sprite = builder.sprite;
    this._emitter = builder.emitter;
    this._stockBar = builder.stockBar;

    this._currentStock = builder.ingredient.stock;
    this._isFlowing = false;

    this._sprite.on('pointerdown', () => {
      this.turnOn({ x: 0, y: 0 });
    });

    this._stockBar.show({
      x: this._sprite.x,
      y: this._sprite.y,
      width: this._sprite.width,
      height: Bottle.STOCK_BAR_HEIGHT
    });
  }

  public turnOn(position: IPoint): void {
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
    this._emitter.checkCollision(scene, this._ingredient, () => {
      this.removeStock(1);
    });

    if (this._emitter.isEmitting()) {
      this.removeStock(0.01);
    }

    if (this._isFlowing) {
      this.flow(scene);
    } else {
      this.unflow(scene);
    }
  }

  public removeStock(nb: number): void {
    this._currentStock -= nb;
    const percent = (this._currentStock / this._ingredient.stock) * 100;
    this._stockBar.update(percent);
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

    if (!hasArrived) {
      const point = {
        x: this._glassPosition.x - this._sprite.displayHeight / 2,
        y: this._glassPosition.y + 10
      };
      this._emitter.start(this._ingredient, point);
    }
  }

  private unflow(scene: IScene): void {
    if (this._initialPosition === undefined) {
      return;
    }

    if (this._sprite.angle < 0) {
      this._sprite.angle += 5;
    }

    this.moveTo(this._initialPosition);
  }

  private moveTo(point: IPoint): boolean {
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
}
