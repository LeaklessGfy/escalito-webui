import { Order } from '../../entities/static/Order';
import { MainController } from '../controllers/MainController';
import { Point } from '../sprites/Point';
import { TintHelper } from '../utils/TintHelper';
import { AbstractCharacter } from './AbstractCharacter';

export class Client extends AbstractCharacter {
  private static readonly PATIENCE: number = 2000;
  private static readonly SATISFACTION_THRESHOLD: number = 20;

  private _patience: number = 0;
  private _timeAwaited: number = 0;
  private _satisfaction: number = 0;

  private _order?: Order;

  private _onServe?: Function;
  private _onExhaust?: Function;

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

    this._order = this.createOrder();

    if (this._order === undefined) {
      return false;
    }

    this._scene.add
      .text(this._sprite.x, this._sprite.y, this._order.title, {
        color: '#FFF',
        fontFamily: 'Arial Black',
        fontSize: '10px',
        backgroundColor: '#000',
        padding: {
          x: 5,
          y: 2
        }
      })
      .setDepth(2)
      .setInteractive()
      .on('pointerdown', () => {
        this._onServe?.();
      });

    return true;
  }

  public await(): Promise<void> {
    if (this._state.waiting) {
      throw new Error('Client is already awaiting');
    }

    const promise = new Promise<void>(resolve => {
      this._onServe = resolve;
    });

    this._state.wait();
    this._patience = Client.PATIENCE;
    this._timeAwaited = 0;

    // waitingSlider.gameObject.SetActive(true);
    // waitingSlider.minValue = 0;
    // waitingSlider.maxValue = _currentPatience;

    return promise;
  }

  public serve(glass: any) {
    if (this._order === undefined) {
      throw new Error('Client can not be served if no order was ask');
    }

    this.satisfaction = this.computeSatisfaction(glass);
    const mainCtr = this._scene.getController<MainController>(
      MainController.KEY
    );
    mainCtr.increment(this, this._order);
  }

  private stepWait(delta: number): void {
    this._timeAwaited += delta;
    // waitingSlider.value = _currentPatience - _timeAwaited;
    // var percent = 100 - _timeAwaited / _currentPatience * 100;
    // waitingImage.color = PercentHelper.GetColor((int) percent);

    if (this._timeAwaited < this._patience) {
      return;
    }

    this._state.exhaust();
    this._onServe = undefined;
    this._onExhaust?.();
    this._onExhaust = undefined;
  }

  private createOrder(): Order | undefined {
    const { cocktails } = this._scene.inventory;

    if (cocktails.length < 1) {
      return undefined;
    }

    const cocktail = cocktails[0]; // select based from hype and maybe other factor depending on client
    return new Order(cocktail);
  }

  private computeSatisfaction(glass: any): number {
    if (glass === undefined) {
      return 0;
    }
    return 100;
  }
}
