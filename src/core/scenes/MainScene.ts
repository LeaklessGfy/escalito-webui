import { Inventory } from '../../entities/Inventory';
import { Settings } from '../Settings';
import { BarController } from '../controllers/BarController';
import { CharacterController } from '../controllers/CharacterController';
import { ClockController } from '../controllers/ClockController';
import { IController } from '../controllers/IController';
import { SelectController } from '../controllers/SelectControllers';
import { IScene } from './IScene';

export class MainScene extends Phaser.Scene implements IScene {
  private readonly _inventory: Inventory;
  private readonly _settings: Settings;
  private readonly _controllers: Map<Symbol, IController>;

  constructor(inventory: Inventory) {
    super({ key: MainScene.name });

    this._inventory = inventory;
    this._settings = new Settings();
    this._controllers = new Map();

    this._controllers.set(BarController.KEY, new BarController());
    this._controllers.set(CharacterController.KEY, new CharacterController());
    this._controllers.set(SelectController.KEY, new SelectController());
    this._controllers.set(ClockController.KEY, new ClockController());
  }

  public get inventory() {
    return this._inventory;
  }

  public get settings() {
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
    return this._controllers.get(key) as T;
  }
}
