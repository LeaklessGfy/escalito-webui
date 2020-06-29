import { IScene } from '../scenes/IScene';
import { AnimKey } from '../sprites/AnimKey';
import { Point } from '../sprites/Point';
import { SpriteKey } from '../sprites/SpriteKey';
import { State } from './State';

export abstract class AbstractCharacter {
  private static readonly SPEED: number = 2;

  protected readonly _state: State;
  protected readonly _scene: IScene;
  protected readonly _sprite: Phaser.GameObjects.Sprite;
  private readonly _texture: SpriteKey;

  private _dst?: Point;
  private _distance: number = 0;

  private _onArrive?: Function;
  private _onLeave?: Function;

  constructor(
    scene: IScene,
    sprite: Phaser.GameObjects.Sprite,
    texture: SpriteKey
  ) {
    this._state = new State();
    this._scene = scene;
    this._sprite = sprite;
    this._texture = texture;
  }

  public get position(): Point {
    return this._sprite;
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
    this.animate(AnimKey.Idle);
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
      this.animate(AnimKey.Move);
      const dir = this._dst.x < this._sprite.x ? -1 : 1;
      this._sprite.setX(this._sprite.x + AbstractCharacter.SPEED * dir);
    }
  }

  private animate(anim: AnimKey): void {
    const fullKey = this._texture + '.' + anim;
    if (this._sprite.anims.getCurrentKey() !== fullKey) {
      this._sprite.anims.play(fullKey);
    }
  }
}
