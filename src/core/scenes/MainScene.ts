import { Settings } from '../Settings';
import { BarController } from '../controllers/BarController';
import { CharacterController } from '../controllers/CharacterController';
import { IController } from '../controllers/IController';
import { SelectController } from '../controllers/SelectControllers';
import { IScene } from './IScene';

export class MainScene extends Phaser.Scene implements IScene {
  private readonly _settings: Settings;
  private readonly _controllers: Map<Symbol, IController>;

  constructor() {
    super({ key: MainScene.name });

    this._settings = new Settings();
    this._controllers = new Map();

    this._controllers.set(BarController.KEY, new BarController());
    this._controllers.set(CharacterController.KEY, new CharacterController());
    this._controllers.set(SelectController.KEY, new SelectController());
  }

  public get settings() {
    return this._settings;
  }

  public preload(): void {
    //this.load.audio('background', 'assets/sound/background.mp3');
    this._settings.scene = this;
    for (const controller of this._controllers.values()) {
      controller.preload(this);
    }
  }

  public create(): void {
    //this.sound.play('background');
    for (const controller of this._controllers.values()) {
      controller.create(this);
    }
  }

  public update(time: number, delta: number): void {
    for (const controller of this._controllers.values()) {
      controller.update(this, delta);
    }
  }

  public getController<T extends IController>(key: Symbol): T {
    return this._controllers.get(key) as T;
  }
}
