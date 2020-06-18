import { GameObjects } from 'phaser';

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
  private static readonly PATIENCE: number = 20;
  private static readonly SPEED: number = 2;

  protected readonly _state: State;
  private readonly _sprite: GameObjects.Sprite;
  private readonly _texture: string;

  private _patience: number = 0;
  private _timeAwaited: number = 0;

  private _dst: Point | null = null;
  private _distance: number = 0;

  private _onArrive: Function | null = null;
  private _onLeave: Function | null = null;

  constructor(sprite: GameObjects.Sprite, texture: string) {
    this._state = new State();
    this._sprite = sprite;
    this._texture = texture;
  }

  public get position(): Point {
    return { x: this._sprite.x, y: this._sprite.y };
  }

  public abstract behave(point: Point): void;

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
    // SpriteRenderer.flipX = Flip(_dst.x);
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
    this.moveTo(dst);
  }

  public leaveToAsync(dst: Point): Promise<void> {
    this._state.leave();
    // waitingSlider.gameObject.SetActive(false);
    this._onLeave?.();
    return this.moveToAsync(dst);
  }

  public await(): void {
    if (this._state.waiting) {
      throw new Error('Client is already awaiting');
    }

    this._state.wait();
    this._patience = AbstractCharacter.PATIENCE;
    this._timeAwaited = 0;

    // waitingSlider.gameObject.SetActive(true);
    // waitingSlider.minValue = 0;
    // waitingSlider.maxValue = _currentPatience;
  }

  public isNear(dst: Point | null, distance: number = 0): boolean {
    return true;
  }

  private stepIdle(): void {
    this.animate(CharacterAnim.Idle);
  }

  private stepMove(): void {
    if (this.isNear(this._dst, this._distance)) {
      this._state.idle();

      this._distance = 0;
      this._onArrive?.(true);
      this._onArrive = null;
    } else {
      this.animate(CharacterAnim.Move);
      this._sprite.setX(this._sprite.x + AbstractCharacter.SPEED);
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
  }

  private animate(anim: CharacterAnim): void {
    const fullKey = this._texture + '.' + anim;
    if (this._sprite.anims.getCurrentKey() !== fullKey) {
      this._sprite.anims.play(fullKey);
    }
  }
}
