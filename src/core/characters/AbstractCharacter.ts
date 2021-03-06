import { ICharacterGameObject } from '../../entities/game/ICharacterGameObject';
import { IPoint } from '../../entities/game/IPoint';
import { AnimKey } from '../sprites/AnimKey';
import { SpriteKey } from '../sprites/SpriteKey';
import { State } from './State';

export abstract class AbstractCharacter implements ICharacterGameObject {
  private static readonly SPEED: number = 2;

  protected readonly _state: State;
  protected readonly _sprite: Phaser.GameObjects.Sprite;
  private readonly _texture: SpriteKey;

  private _dst?: IPoint;
  private _distance: number = 0;

  private _onArrive?: Function;
  private _onLeave?: Function;

  public constructor(sprite: Phaser.GameObjects.Sprite, texture: SpriteKey) {
    this._state = new State();
    this._sprite = sprite;
    this._texture = texture;
  }

  public get position(): IPoint {
    return { x: this._sprite.x, y: this._sprite.y };
  }

  public set onLeave(listener: Function) {
    this._onLeave = listener;
  }

  public update(delta: number): void {
    if (this._state.idling) {
      this.stepIdle();
    } else if (this._state.moving) {
      this.stepMove();
    }
  }

  public moveTo(dst: IPoint, distance: number = 0): void {
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

  public moveToAsync(dst: IPoint, distance: number = 0): Promise<void> {
    this._onArrive?.(false);
    const promise = new Promise<void>(resolve => {
      this._onArrive = resolve;
    });
    this.moveTo(dst, distance);
    return promise;
  }

  public leaveTo(dst: IPoint): void {
    this._state.leave();
    this._onLeave?.();
    this.moveTo(dst, 4);
  }

  public leaveToAsync(dst: IPoint): Promise<void> {
    this._state.leave();
    this._onLeave?.();
    return this.moveToAsync(dst);
  }

  public isNear(dst: IPoint | undefined, distance: number = 0): boolean {
    if (dst == null) {
      return false;
    }
    return Math.abs(dst.x - this._sprite.x) < distance;
  }

  public destroy(): void {
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
