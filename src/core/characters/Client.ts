import { Order } from '../../entities/static/Order';
import { ClientBuilder } from '../builders/ClientBuilder';
import { Glass } from '../cocktails/Glass';
import { Point } from '../sprites/Point';
import { Producer } from '../utils/Interfaces';
import { TintHelper } from '../utils/TintHelper';
import { AbstractCharacter } from './AbstractCharacter';
import { IBehavioral } from './IBehavioral';

export class Client extends AbstractCharacter implements IBehavioral {
  private static readonly WAITING_BOX_HEIGHT: number = 5;

  private readonly _waitingBox: Phaser.GameObjects.Graphics;
  private readonly _waitingBar: Phaser.GameObjects.Graphics;
  private readonly _orderText: Phaser.GameObjects.Text;
  private readonly _createCollider: Function;
  private readonly _increment: Function;
  private readonly _createOrder: Producer<Order | undefined>;

  private _patience: number;
  private _timeAwaited: number;
  private _satisfaction: number;
  private _satisfactionThreshold: number;
  private _order?: Order;

  private _waitingPos: Point = { x: 0, y: 0 };

  constructor(builder: ClientBuilder) {
    super(builder.sprite, builder.spriteKey);

    this._waitingBox = builder.waitingBox;
    this._waitingBar = builder.waitingBar;
    this._orderText = builder.orderText;
    this._createCollider = builder.createCollider;
    this._increment = builder.increment;
    this._createOrder = builder.createOrder;

    this._patience = builder.patience;
    this._timeAwaited = 0;
    this._satisfaction = 0;
    this._satisfactionThreshold = builder.satisfactionThreshold;
  }

  public get satisfaction(): number {
    return this._satisfaction;
  }

  public get satisfied(): boolean {
    return this._satisfaction > this._satisfactionThreshold;
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

  public behave(next: Point, bar: Point, spawn: Point): void {
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

    if (!this.isNear(next, 4)) {
      return this.moveTo(next, 4);
    }

    if (this._order === undefined && this.isNear(bar, 4)) {
      if (!this.askOrder()) {
        this.satisfaction = 0;
        this.leaveTo(spawn);
      } else {
        this.await();
      }
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
    this._orderText.on('pointerdown', () => {
      this._timeAwaited -= 1000;
    });
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
    this._waitingPos = {
      x: x - this._sprite.displayWidth / 2,
      y: y + this._sprite.displayHeight / 2
    };

    this._waitingBox.fillStyle(0xffffff, 1);
    this._waitingBox.fillRect(
      this._waitingPos.x,
      this._waitingPos.y,
      this._sprite.displayWidth,
      Client.WAITING_BOX_HEIGHT
    );

    this._waitingBar.fillStyle(TintHelper.getTint(100), 1);
    this._waitingBar.fillRect(
      this._waitingPos.x,
      this._waitingPos.y,
      this._sprite.displayWidth,
      Client.WAITING_BOX_HEIGHT
    );
  }

  public serve(glass?: Glass) {
    if (this._order === undefined) {
      throw new Error('Client can not be served if no order was ask');
    }

    this._state.serve();
    this.satisfaction = this.computeSatisfaction(glass);
    this._increment();
    this._order = undefined;
    this._orderText.destroy();
    this._waitingBox.clear().destroy();
    this._waitingBar.clear().destroy();
  }

  private stepWait(delta: number): void {
    this._timeAwaited += delta;

    if (this._patience === -1) {
      return;
    }

    const percent = 100 - (this._timeAwaited / this._patience) * 100;
    const color = TintHelper.getTint(percent);
    const width = (percent / 100) * this._sprite.displayWidth;

    this._waitingBar.clear();
    this._waitingBar.fillStyle(color, 1);
    this._waitingBar.fillRect(
      this._waitingPos.x,
      this._waitingPos.y,
      width,
      Client.WAITING_BOX_HEIGHT
    );

    if (this._timeAwaited < this._patience) {
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
