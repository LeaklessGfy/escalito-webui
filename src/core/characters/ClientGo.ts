import { IBehavioral } from '../../entities/game/IBehavioral';
import { IPoint } from '../../entities/game/IPoint';
import { Client } from '../../entities/static/Client';
import { Order } from '../../entities/static/Order';
import { ClientBuilder } from '../builders/ClientBuilder';
import { Glass } from '../cocktails/Glass';
import { Bar } from '../sprites/Bar';
import { Producer } from '../utils/Interfaces';
import { TintHelper } from '../utils/TintHelper';
import { AbstractCharacter } from './AbstractCharacter';

export class ClientGo extends AbstractCharacter implements IBehavioral {
  private static readonly WAITING_BAR_HEIGHT: number = 5;
  private static readonly BAR_OVERFLOW_DIST: number = 4;

  private readonly _client: Client;
  private readonly _waitingBar: Bar;
  private readonly _orderText: Phaser.GameObjects.Text;
  private readonly _cashText: Phaser.GameObjects.Text;
  private readonly _createCollider: Function;
  private readonly _increment: Producer<number>;
  private readonly _createOrder: Producer<Order | undefined>;

  private _timeAwaited: number;
  private _satisfaction: number;
  private _order?: Order;

  public constructor(builder: ClientBuilder) {
    super(builder.sprite, builder.spriteKey);

    this._client = builder.client;
    this._waitingBar = builder.waitingBar;
    this._orderText = builder.orderText;
    this._cashText = builder.cashText;
    this._createCollider = builder.createCollider;
    this._increment = builder.increment;
    this._createOrder = builder.createOrder;

    this._timeAwaited = 0;
    this._satisfaction = 0;
  }

  public get satisfaction(): number {
    return this._satisfaction;
  }

  public get satisfied(): boolean {
    return this._satisfaction > this._client.satisfactionThreshold;
  }

  public get order(): Order {
    if (this._order === undefined) {
      throw new Error('Order is undefined and should not be queried');
    }
    return this._order;
  }

  public set satisfaction(satisfaction: number) {
    this._satisfaction = satisfaction;
    this._sprite.tint = TintHelper.getTint(satisfaction);
  }

  public update(delta: number) {
    super.update(delta);
    if (this._state.waiting) {
      this.stepWait(delta);
    }
  }

  public behave(leader: IPoint | undefined, bar: IPoint, spawn: IPoint): void {
    if (this._state.leaving) {
      throw new Error('Client should not behave while leaving');
    }

    if (this._state.moving || this._state.waiting) {
      return;
    }

    if (this._state.exhausted) {
      this.serve(undefined);
      return this.leaveTo(spawn);
    } else if (this._state.served) {
      return this.leaveTo(spawn);
    }

    let next = bar;
    let dist = ClientGo.BAR_OVERFLOW_DIST;

    if (leader !== undefined) {
      next = leader;
      dist = this._sprite.displayWidth;
    }

    if (!this.isNear(next, dist)) {
      return this.moveTo(next, dist);
    }

    if (this._order === undefined && this.isNear(bar, 4)) {
      if (this.askOrder()) {
        this.await();
      } else {
        this._state.exhaust();
      }
    } else {
      // maybe await in queue ?
    }
  }

  public askOrder(): boolean {
    if (this._order !== undefined) {
      throw new Error('Client has already order');
    }

    this._order = this._createOrder();

    if (this._order === undefined) {
      return false;
    }

    this._orderText.setPosition(this._sprite.x, this._sprite.y);
    this._orderText.setText(this._order.title);
    /*this._orderText.on('pointerdown', () => {
      this._timeAwaited -= 1000;
    });*/

    this._createCollider();

    return true;
  }

  public await(): void {
    if (this._state.waiting) {
      throw new Error('Client is already awaiting');
    }

    this._state.wait();
    this._timeAwaited = 0;

    const { x, y } = this._sprite;

    this._waitingBar.show({
      x: x - this._sprite.displayWidth / 2,
      y: y + this._sprite.displayHeight / 2,
      width: this._sprite.displayWidth,
      height: ClientGo.WAITING_BAR_HEIGHT
    });
  }

  public serve(glass?: Glass) {
    if (this._order === undefined) {
      throw new Error('Client can not be served if no order was ask');
    }

    this._state.serve();
    this.satisfaction = this.computeSatisfaction(glass);
    const price = this._increment();

    const text = '+' + price + '$';
    const measurement = this._cashText.context.measureText(text);

    const x = this._sprite.x - measurement.width / 2;
    const y =
      this._sprite.y +
      this._sprite.displayHeight / 2 -
      this._cashText.displayHeight / 2;

    this._cashText.setPosition(x, y);
    this._cashText.setText(text);

    this._order = undefined;
    this._orderText.destroy();
    this._waitingBar.destroy();
  }

  private stepWait(delta: number): void {
    this._timeAwaited += delta;

    if (this._client.patience === -1) {
      return;
    }

    const percent = 100 - (this._timeAwaited / this._client.patience) * 100;
    this._waitingBar.update(percent);

    if (this._timeAwaited < this._client.patience) {
      return;
    }

    this._state.exhaust();
  }

  private computeSatisfaction(glass?: Glass): number {
    if (glass === undefined) {
      return 0;
    }

    if (this._order === undefined) {
      throw new Error('Can not compute satisfaction if no order');
    }

    const satisfactions: number[] = [];
    const actualRecipe = glass.recipe;

    for (const [key, expected] of this._order.recipe.entries()) {
      const actual = actualRecipe.get(key) ?? 0;
      const satisfaction = this.computeDifference(expected, actual);
      satisfactions.push(satisfaction);
    }

    for (const key of actualRecipe.keys()) {
      if (!this._order.recipe.has(key)) {
        satisfactions.push(0);
      }
    }

    return satisfactions.reduce((p, n) => p + n, 0) / satisfactions.length;
  }

  private computeDifference(expected: number, actual: number) {
    var difference = actual - expected;
    var differencePercentage = (difference / expected) * 100;

    if (differencePercentage > 10) {
      return 110;
    }

    return 100 + differencePercentage;
  }
}
