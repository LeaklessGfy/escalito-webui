import { TriggerUnit } from '../../entities/static/TimeTrigger';
import { Store } from '../../store';
import { Settings } from '../Settings';
import { AudioController } from '../controllers/AudioController';
import { BarController } from '../controllers/BarController';
import { CharacterController } from '../controllers/CharacterController';
import { ClockController } from '../controllers/ClockController';
import { IController } from '../controllers/IController';
import { MainController } from '../controllers/MainController';
import { SelectController } from '../controllers/SelectControllers';
import { DelegateTimeAction } from '../times/DelegateTimeAction';
import { TimeActionManager } from '../times/TimeActionManager';
import { IScene } from './IScene';

export class MainScene extends Phaser.Scene implements IScene {
  private readonly _store: Store;
  private readonly _settings: Settings;
  private readonly _controllers: Map<Symbol, IController>;
  private readonly _timeManager: TimeActionManager;

  constructor(store: Store) {
    super({ key: MainScene.name });

    this._store = store;
    this._settings = new Settings();
    this._controllers = new Map<Symbol, IController>();
    this._timeManager = new TimeActionManager();

    this._controllers.set(BarController.KEY, new BarController());
    this._controllers.set(CharacterController.KEY, new CharacterController());
    this._controllers.set(SelectController.KEY, new SelectController());
    this._controllers.set(ClockController.KEY, new ClockController());
    this._controllers.set(AudioController.KEY, new AudioController());
    this._controllers.set(MainController.KEY, new MainController());
  }

  public get store(): Store {
    return this._store;
  }

  public get settings(): Settings {
    return this._settings;
  }

  public preload(): void {
    this._settings.scene = this;

    for (const controller of this._controllers.values()) {
      controller.preload(this);
    }

    this._timeManager.add(
      new DelegateTimeAction(
        1,
        TriggerUnit.Day,
        -1,
        () => true,
        () => {
          this._controllers.forEach(c => c.daily(this, this._store, 1));
        }
      )
    );
  }

  public create(): void {
    for (const controller of this._controllers.values()) {
      controller.create(this);
      controller.daily(this, this.store, 0);
    }
  }

  public update(time: number, delta: number): void {
    for (const controller of this._controllers.values()) {
      controller.update(this, delta);
    }
    this._timeManager.update(delta);
  }

  public getController<T extends IController>(key: Symbol): T {
    const controller = this._controllers.get(key);
    if (controller === undefined) {
      throw new Error('Undefined controller with key ' + key);
    }
    return controller as T;
  }
}
