import { Order } from '../../entities/Order';
import { Point, PositionKey } from '../positions/Point';
import { IScene } from '../scenes/IScene';
import { TintHelper } from '../utils/TintHelper';
import { State } from './State';

export enum CharacterKey {
  Barmaid = 'barmaid',
  Client1 = 'client1'
}

export enum CharacterAnim {
  Idle = 'idle',
  Move = 'move'
}

export abstract class AbstractCharacter {
  private static readonly PATIENCE: number = 2000;
  private static readonly SPEED: number = 2;
  private static readonly SATISFACTION_THRESHOLD: number = 20;

  protected readonly _state: State;
  protected readonly _scene: IScene;
  protected readonly _sprite: Phaser.GameObjects.Sprite;
  private readonly _texture: string;

  private _patience: number = 0;
  private _timeAwaited: number = 0;

  private _dst?: Point;
  private _distance: number = 0;

  protected _order?: Order;

  private _satisfaction: number = 0;

  private _onArrive?: Function;
  private _onLeave?: Function;
  private _onServe?: Function;
  private _onExhaust?: Function;

  constructor(
    scene: IScene,
    sprite: Phaser.GameObjects.Sprite,
    texture: string
  ) {
    this._state = new State();
    this._scene = scene;
    this._sprite = sprite;
    this._texture = texture;
  }

  public get position(): Point {
    return { x: this._sprite.x, y: this._sprite.y };
  }

  public get satisfaction(): number {
    return this._satisfaction;
  }

  public get satisfied(): boolean {
    return this._satisfaction > AbstractCharacter.SATISFACTION_THRESHOLD;
  }

  public set satisfaction(satisfaction: number) {
    this._satisfaction = satisfaction;
    this._sprite.tint = TintHelper.getTint(satisfaction);
  }

  public set onLeave(listener: Function) {
    this._onLeave = listener;
  }

  public abstract behave(next: Point, bar: Point, spawn: Point): void;

  public update(delta: number): void {
    if (this._state.idling) {
      this.stepIdle();
    } else if (this._state.moving) {
      this.stepMove();
    }
    if (this._state.waiting) {
      this.stepWait(delta);
    }
  }

  public moveTo(dst: Point, distance: number = 0): void {
    if (dst === this._dst) {
      return;
    }

    this._dst = dst;
    this._distance = distance;
    this._state.move();

    if (dst.x < this._sprite.x) {
      this._sprite.setFlipX(true);
    }
  }

  public moveToAsync(dst: Point, distance: number = 0): Promise<void> {
    this._onArrive?.(false);
    const promise = new Promise<void>(resolve => {
      this._onArrive = resolve;
    });
    this.moveTo(dst, distance);
    return promise;
  }

  public leaveTo(dst: Point): void {
    this._state.leave();
    // waitingSlider.gameObject.SetActive(false);
    this._onLeave?.();
    this.moveTo(dst, 4);
  }

  public leaveToAsync(dst: Point): Promise<void> {
    this._state.leave();
    // waitingSlider.gameObject.SetActive(false);
    this._onLeave?.();
    return this.moveToAsync(dst);
  }

  public serve(glass: any) {
    if (glass === undefined) {
      this.satisfaction = 0;
      return;
    }
    this.satisfaction = 100;
  }

  public askOrder(): void {
    if (this._order !== undefined) {
      throw new Error('Client has already order');
    }

    this._order = this.createOrder();

    if (this._order === undefined) {
      return;
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
  }

  public await(): Promise<void> {
    if (this._state.waiting) {
      throw new Error('Client is already awaiting');
    }

    const promise = new Promise<void>(resolve => {
      this._onServe = resolve;
    });

    this._state.wait();
    this._patience = AbstractCharacter.PATIENCE;
    this._timeAwaited = 0;

    // waitingSlider.gameObject.SetActive(true);
    // waitingSlider.minValue = 0;
    // waitingSlider.maxValue = _currentPatience;

    return promise;
  }

  public isNear(dst: Point | undefined, distance: number = 0): boolean {
    if (dst == null) {
      return false;
    }
    return Math.abs(dst.x - this._sprite.x) < distance;
  }

  public destroy() {
    this._sprite.destroy();
  }

  private stepIdle(): void {
    this.animate(CharacterAnim.Idle);
  }

  private stepMove(): void {
    if (this._dst === undefined) {
      return;
    }

    if (this.isNear(this._dst, this._distance)) {
      this._state.idle();

      this._distance = 0;
      this._onArrive?.(true);
      this._onArrive = undefined;
    } else {
      this.animate(CharacterAnim.Move);
      const dir = this._dst.x < this._sprite.x ? -1 : 1;
      this._sprite.setX(this._sprite.x + AbstractCharacter.SPEED * dir);
    }
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

  private animate(anim: CharacterAnim): void {
    const fullKey = this._texture + '.' + anim;
    if (this._sprite.anims.getCurrentKey() !== fullKey) {
      this._sprite.anims.play(fullKey);
    }
  }

  private createOrder(): Order | undefined {
    const { cocktails } = this._scene.inventory;
    const settings = this._scene.settings;

    if (cocktails.length < 1) {
      const spawn = settings.getPosition(PositionKey.Door);
      this.serve(undefined);
      this.leaveTo(spawn);

      return undefined;
    }

    const cocktail = cocktails[0]; // select based from hype and maybe other factor depending on client
    return new Order(cocktail);
  }
}
