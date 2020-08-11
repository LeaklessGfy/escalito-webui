import { IController } from '../../entities/game/IController';
import { IScene } from '../../entities/game/IScene';

export class AudioController implements IController {
  public static readonly KEY = Symbol();

  private _manager!: Phaser.Sound.BaseSoundManager;
  private _active: boolean = false;

  /** Interface **/
  public preload(scene: IScene): void {
    this._manager = scene.sound;

    // scene.load.audio('background', 'assets/sound/background.mp3');
  }

  public create(scene: IScene): void {
    // scene.sound.play('background');
  }

  public update(scene: IScene, delta: number): void {}

  public rescale(): void {}

  /** Custom **/
  public playSuccess(): void {
    this._active && this._manager.play('success');
  }

  public playFailue(): void {
    this._active && this._manager.play('failure');
  }

  public playLaught(): void {
    this._active && this._manager.play('laught');
  }

  public playCash(): void {
    this._active && this._manager.play('cash');
  }

  public playRandomBackground(): void {
    // get random song key
    this._active && this._manager.play('background');
  }
}
