import { IScene } from '../scenes/IScene';
import { IController } from './IController';

export class AudioController implements IController {
  public static readonly KEY = Symbol();

  private readonly _scene: IScene;

  constructor(scene: IScene) {
    this._scene = scene;
  }

  public preload(scene: IScene): void {
    // scene.load.audio('background', 'assets/sound/background.mp3');
  }

  public create(scene: IScene): void {
    // scene.sound.play('background');
  }

  public update(scene: IScene, delta: number): void {}

  public playSuccess(): void {
    this._scene.sound.play('success');
  }

  public playFailue(): void {
    this._scene.sound.play('failure');
  }

  public playLaught(): void {
    this._scene.sound.play('laught');
  }
}
