import { Store } from '../../store';
import { IScene } from '../scenes/IScene';
import { IController } from './IController';

export class AudioController implements IController {
  public static readonly KEY = Symbol();

  private _scene?: IScene;
  private _audioActivate: boolean = false;

  /** Interface **/
  public preload(scene: IScene): void {
    this._scene = scene;

    // scene.load.audio('background', 'assets/sound/background.mp3');
  }

  public create(scene: IScene): void {
    // scene.sound.play('background');
  }

  public update(scene: IScene, delta: number): void {}

  public daily(scene: IScene, store: Store, day: number): void {}

  /** Custom **/
  public playSuccess(): void {
    if (!this._audioActivate) {
      return;
    }
    this._scene?.sound.play('success');
  }

  public playFailue(): void {
    if (!this._audioActivate) {
      return;
    }
    this._scene?.sound.play('failure');
  }

  public playLaught(): void {
    if (!this._audioActivate) {
      return;
    }
    this._scene?.sound.play('laught');
  }

  public playCash(): void {
    if (!this._audioActivate) {
      return;
    }
    this._scene?.sound.play('cash');
  }
}
