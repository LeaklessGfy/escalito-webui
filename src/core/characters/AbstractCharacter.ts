import { Point } from '../positions/Point';
import { IScene } from '../scenes/IScene';
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
  private static readonly SPEED: number = 2;

  protected readonly _state: State;
  protected readonly _scene: IScene;
  protected readonly _sprite: Phaser.GameObjects.Sprite;
  private readonly _texture: string;

  private _dst?: Point;
  private _distance: number = 0;

  private _onArrive?: Function;
  private _onLeave?: Function;

  constructor(
    scene: IScene,
    sprite: Phaser.GameObjects.Sprite,
    texture: string
  ) {
    this._state = new State();
    this._scene = scene;
    this._sprite = sprite;
    this._texture = texture;
    console.log(this._sprite.texture);
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

  private animate(anim: CharacterAnim): void {
    const fullKey = this._texture + '.' + anim;
    if (this._sprite.anims.getCurrentKey() !== fullKey) {
      this._sprite.anims.play(fullKey);
    }
  }
}
