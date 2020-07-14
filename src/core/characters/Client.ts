import { Order } from '../../entities/static/Order';
import { Glass } from '../cocktails/Glass';
import { BarController } from '../controllers/BarController';
import { MainController } from '../controllers/MainController';
import { IScene } from '../scenes/IScene';
import { Point } from '../sprites/Point';
import { SpriteKey } from '../sprites/SpriteKey';
import { TintHelper } from '../utils/TintHelper';
import { AbstractCharacter } from './AbstractCharacter';
import { IBehavioral } from './IBehavioral';

export class Client extends AbstractCharacter implements IBehavioral {
  private static readonly PATIENCE: number = 2000;
  private static readonly SATISFACTION_THRESHOLD: number = 20;
  private static readonly WAITING_BOX_WIDTH: number = 100;
  private static readonly WAITING_BOX_HEIGHT: number = 20;
  private static readonly STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
    color: '#FFF',
    fontFamily: 'Arial Black',
    fontSize: '10px',
    backgroundColor: '#000',
    padding: {
      x: 5,
      y: 2
    }
  };

  private readonly _waitingBox: Phaser.GameObjects.Graphics;
  private readonly _waitingBar: Phaser.GameObjects.Graphics;
  private readonly _orderText: Phaser.GameObjects.Text;
  private readonly _createCollider: Function;
  private readonly _increment: Function;

  private _patience: number = 0;
  private _timeAwaited: number = 0;
  private _satisfaction: number = 0;

  private _order?: Order;

  private _onExhaust?: Function;
  private _createOrder: () => Order | undefined = () => undefined;

  constructor(
    scene: IScene,
    sprite: Phaser.GameObjects.Sprite,
    texture: SpriteKey
  ) {
    super(sprite, texture);

    this._waitingBox = scene.add.graphics();
    this._waitingBar = scene.add.graphics();
    this._orderText = scene.add
      .text(this._sprite.x, this._sprite.y, '', Client.STYLE)
      .setDepth(2)
      .setInteractive()
      .on('pointerdown', () => {});

    this._createCollider = () => {
      const barCtr = scene.getController<BarController>(BarController.KEY);
      if (barCtr.glass === undefined) {
        throw new Error('Glass is undefined');
      }
      const collider = scene.physics.add.collider(
        this._sprite,
        barCtr.glass.sprite,
        () => {
          this.serve(barCtr.glass);
          collider.destroy();
        }
      );
    };

    this._increment = () => {
      const mainCtr = scene.getController<MainController>(MainController.KEY);
      mainCtr.increment(this, this._order as Order);
    };
  }

  public get satisfaction(): number {
    return this._satisfaction;
  }

  public get satisfied(): boolean {
    return this._satisfaction > Client.SATISFACTION_THRESHOLD;
  }

  public set satisfaction(satisfaction: number) {
    this._satisfaction = satisfaction;
    this._sprite.tint = TintHelper.getTint(satisfaction);
  }

  public set createOrder(createOrder: () => Order | undefined) {
    this._createOrder = createOrder;
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

    this._orderText.setText(this._order.title);
    this._createCollider();

    return true;
  }

  public await(): void {
    if (this._state.waiting) {
      throw new Error('Client is already awaiting');
    }

    this._state.wait();
    this._patience = -1;
    this._timeAwaited = 0;

    const { x, y } = this._sprite;

    this._waitingBox.fillStyle(0xfff, 1);
    this._waitingBox.fillRect(
      x,
      y,
      Client.WAITING_BOX_WIDTH,
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
  }

  private stepWait(delta: number): void {
    this._timeAwaited += delta;

    if (this._patience === -1) {
      return;
    }

    const { x, y } = this._waitingBox;
    // const value = this._patience - this._timeAwaited;
    const percent = 100 - (this._timeAwaited / this._patience) * 100;
    const color = TintHelper.getTint(percent);
    const width = (percent / 100) * Client.WAITING_BOX_WIDTH;

    this._waitingBar.clear();
    this._waitingBar.fillStyle(color, 1);
    this._waitingBar.fillRect(x, y, width, Client.WAITING_BOX_HEIGHT);

    if (this._timeAwaited < this._patience) {
      return;
    }

    this._state.exhaust();
    this._onExhaust?.();
    this._onExhaust = undefined;
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
