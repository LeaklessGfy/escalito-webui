import { IngredientExtended } from '../../entities/dynamic/IngredientExtended';
import { IEmitter } from '../../entities/game/IEmitter';
import { IIngredientGameObject } from '../../entities/game/IIngredientGameObject';
import { IPoint } from '../../entities/game/IPoint';
import { IScene } from '../../entities/game/IScene';
import { Ingredient } from '../../entities/static/Ingredient';
import { ProviderKey } from '../../entities/static/Provider';
import { BottleBuilder } from '../builders/BottleBuilder';
import { Bar } from '../sprites/Bar';

export class Bottle implements IIngredientGameObject {
  private static readonly STOCK_BAR_HEIGHT: number = 5;

  private readonly _ingredient: Ingredient;
  private readonly _sprite: Phaser.GameObjects.Sprite;
  private readonly _emitter: IEmitter;
  private readonly _stockBar: Bar;
  private readonly _providers: Map<ProviderKey, IngredientExtended>;
  private readonly _initialPosition: IPoint;
  private readonly _glassPosition: IPoint;

  private _currentAmount: number;
  private _isFlowing: boolean;

  public constructor(builder: BottleBuilder) {
    this._ingredient = builder.ingredient.provided.base;
    this._sprite = builder.sprite;
    this._emitter = builder.emitter;
    this._stockBar = builder.stockBar;
    this._providers = new Map();
    this._initialPosition = { x: this._sprite.x, y: this._sprite.y };
    this._glassPosition = {
      x: builder.glassPosition.x + this._sprite.displayHeight / 2,
      y: builder.glassPosition.y - this._sprite.displayWidth * 2
    };

    this._currentAmount =
      builder.ingredient.provided.base.amount * builder.ingredient.stock;
    this._isFlowing = false;

    this._sprite.on('pointerdown', () => {
      this.turnOn();
    });

    this._stockBar.show({
      x: this._sprite.x - this._sprite.displayWidth / 2,
      y: this._sprite.y + this._sprite.displayHeight / 2.5,
      width: this._sprite.width,
      height: Bottle.STOCK_BAR_HEIGHT
    });

    this._providers.set(
      builder.ingredient.provided.providerKey,
      builder.ingredient
    );
  }

  public turnOn(): void {
    this._isFlowing = true;
  }

  public turnOff(): void {
    this._isFlowing = false;
    this._emitter.stop();
  }

  public update(scene: IScene): void {
    this._emitter.checkCollision(scene, this._ingredient);

    if (this._emitter.isEmitting()) {
      this._currentAmount -= 1;
      this.updateStockBar();
    }

    if (this._isFlowing) {
      if (!scene.input.activePointer.isDown) {
        return this.turnOff();
      }

      this.flow();
    } else {
      this.unflow();
    }
  }

  public addProvided(ingredient: IngredientExtended): void {
    if (ingredient.provided.base !== this._ingredient) {
      throw new Error(
        'Can not add provided ingredient on different ingredient'
      );
    }

    this._currentAmount += this._ingredient.amount;
    // calculate quality average etc ...

    const clone = ingredient.clone(ingredient.stock + 1);
    this._providers.set(ingredient.provided.providerKey, clone);

    this.updateStockBar();
  }

  public removeProvided(ingredient: IngredientExtended): void {
    if (ingredient.provided.base !== this._ingredient) {
      throw new Error(
        'Can not remove provided ingredient on different ingredient'
      );
    }

    const info = this._providers.get(ingredient.provided.providerKey);

    if (info === undefined) {
      throw new Error('Can not remove unexisting provided ingredient');
    }

    const total = this.getTotal();
    const defaultAmount = this._ingredient.amount;
    const totalAmount = defaultAmount * total;
    const currentAmount = this._currentAmount;
    const providerPercent = info.stock / total;

    const diffTotalAmount = totalAmount - currentAmount;
    const diffPercentAmount = diffTotalAmount * providerPercent;

    const nextPercentAmount = currentAmount - currentAmount * providerPercent;
    const nextAmount = nextPercentAmount + diffPercentAmount;

    this._currentAmount = nextAmount;

    this._providers.delete(ingredient.provided.providerKey);

    this.updateStockBar();
  }

  public shouldDestroy(): boolean {
    return this.getTotal() < 1;
  }

  public destroy(): void {
    this._sprite.destroy();
    this._stockBar.destroy();
  }

  private getTotal(): number {
    return Array.from(this._providers.values()).reduce(
      (p, c) => p + c.stock,
      0
    );
  }

  private flow(): void {
    if (this._sprite.angle > -80) {
      this._sprite.angle -= 5;
    }

    if (this.moveTo(this._glassPosition)) {
      const point = {
        x: this._glassPosition.x - this._sprite.displayHeight / 2,
        y: this._glassPosition.y + 10
      };
      this._emitter.start(this._ingredient, point);
    }
  }

  private unflow(): void {
    if (this._sprite.angle < 0) {
      this._sprite.angle += 5;
    }

    this.moveTo(this._initialPosition);
  }

  private moveTo(point: IPoint): boolean {
    const { x, y } = this._sprite;
    let move = true;

    if (Math.abs(x - point.x) > 3) {
      const dirX = point.x < x ? -1 : 1;
      this._sprite.setX(x + 5 * dirX);
      move = false;
    }

    if (Math.abs(y - point.y) > 1) {
      const dirY = point.y < y ? -1 : 1;
      this._sprite.setY(y + 2 * dirY);
      move = false;
    }

    return move;
  }

  private updateStockBar() {
    const total = this.getTotal() * this._ingredient.amount;
    const percent = (this._currentAmount / total) * 100;
    this._stockBar.update(percent);
  }
}
