import { Inventory } from '../../entities/Inventory';
import { Store } from '../../store';
import { Settings } from '../Settings';
import { BarController } from '../controllers/BarController';
import { CharacterController } from '../controllers/CharacterController';
import { ClockController } from '../controllers/ClockController';
import { IController } from '../controllers/IController';
import { SelectController } from '../controllers/SelectControllers';
import { IScene } from './IScene';

export class MainScene extends Phaser.Scene implements IScene {
  private readonly _store: Store;
  private readonly _settings: Settings;
  private readonly _controllers: Map<Symbol, IController>;

  constructor(store: Store) {
    super({ key: MainScene.name });

    this._store = store;
    this._settings = new Settings();
    this._controllers = new Map();

    this._controllers.set(BarController.KEY, new BarController());
    this._controllers.set(CharacterController.KEY, new CharacterController());
    this._controllers.set(SelectController.KEY, new SelectController());
    this._controllers.set(ClockController.KEY, new ClockController());
  }

  public get store(): Store {
    return this._store;
  }

  public get inventory(): Inventory {
    return this._store.inventory;
  }

  public get settings(): Settings {
    return this._settings;
  }

  public preload(): void {
    this._settings.scene = this;
    for (const controller of this._controllers.values()) {
      controller.preload(this);
    }
  }

  public create(): void {
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
    const controller = this._controllers.get(key);
    if (controller === undefined) {
      throw new Error('Undefined controller with key ' + key);
    }
    return controller as T;
  }
}
