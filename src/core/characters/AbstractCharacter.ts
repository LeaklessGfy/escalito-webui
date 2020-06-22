import { Point } from '../drawables/Point';
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

  protected readonly _state: State;
  private readonly _sprite: Phaser.GameObjects.Sprite;
  private readonly _texture: string;

  private _patience: number = 0;
  private _timeAwaited: number = 0;

  private _dst: Point | null = null;
  private _distance: number = 0;

  private _onArrive: Function | null = null;
  private _onLeave: Function | null = null;
  private _onServe: Function | null = null;
  private _onExhaust: Function | null = null;

  constructor(sprite: Phaser.GameObjects.Sprite, texture: string) {
    this._state = new State();
    this._sprite = sprite;
    this._texture = texture;
  }

  public get position(): Point {
    return { x: this._sprite.x, y: this._sprite.y };
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

  public followAlong(dst: Point): void {
    this._dst = dst;
  }

  public await(): Promise<void> {
    if (this._state.waiting) {
      throw new Error('Client is already awaiting');
    }

    const promise = new Promise<void>((resolve, reject) => {
      this._onServe = resolve;
      //this._onExhaust = reject;
    });

    this._state.wait();
    this._patience = AbstractCharacter.PATIENCE;
    this._timeAwaited = 0;

    // waitingSlider.gameObject.SetActive(true);
    // waitingSlider.minValue = 0;
    // waitingSlider.maxValue = _currentPatience;

    return promise;
  }

  public isNear(dst: Point | null, distance: number = 0): boolean {
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
    if (this._dst === null) {
      return;
    }

    if (this.isNear(this._dst, this._distance)) {
      this._state.idle();

      this._distance = 0;
      this._onArrive?.(true);
      this._onArrive = null;
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
    this._onServe = null;
    this._onExhaust?.();
    this._onExhaust = null;
  }

  private animate(anim: CharacterAnim): void {
    const fullKey = this._texture + '.' + anim;
    if (this._sprite.anims.getCurrentKey() !== fullKey) {
      this._sprite.anims.play(fullKey);
    }
  }
}
