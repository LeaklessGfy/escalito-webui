import { IController } from '../../entities/game/IController';
import { IInventory } from '../../entities/game/IInventory';
import { IScene } from '../../entities/game/IScene';
import { ISettings } from '../../entities/game/ISettings';
import { Settings } from '../Settings';
import { AudioController } from '../controllers/AudioController';
import { BarController } from '../controllers/BarController';
import { CharacterController } from '../controllers/CharacterController';
import { ClockController } from '../controllers/ClockController';
import { IngredientController } from '../controllers/IngredientController';
import { MainController } from '../controllers/MainController';
import { SelectController } from '../controllers/SelectController';

export class MainScene extends Phaser.Scene implements IScene {
  private readonly _inventory: IInventory;
  private readonly _controllers: Map<Symbol, IController>;

  private _settings!: Settings;

  public constructor(inventory: IInventory) {
    super({ key: MainScene.name });

    this._inventory = inventory;
    this._controllers = new Map<Symbol, IController>();

    this._controllers.set(BarController.KEY, new BarController());
    this._controllers.set(CharacterController.KEY, new CharacterController());
    this._controllers.set(SelectController.KEY, new SelectController());
    this._controllers.set(IngredientController.KEY, new IngredientController());
    this._controllers.set(ClockController.KEY, new ClockController());
    this._controllers.set(AudioController.KEY, new AudioController());
    this._controllers.set(MainController.KEY, new MainController());
  }

  public get inventory(): IInventory {
    return this._inventory;
  }

  public get settings(): ISettings {
    return this._settings;
  }

  public preload(): void {
    const { width, height } = this.scale.displaySize;
    this._settings = new Settings(width, height);

    for (const controller of this._controllers.values()) {
      controller.preload(this);
    }
  }

  public create(): void {
    window.addEventListener('resize', () => {
      const width = this.sys.canvas.parentElement?.clientWidth ?? 300;
      const height = 300;
      this.scale.resize(width, height);
      this._settings = new Settings(width, height);

      for (const controller of this._controllers.values()) {
        controller.rescale();
      }
    });

    for (const controller of this._controllers.values()) {
      controller.create(this);
    }
  }

  public update(time: number, delta: number): void {
    for (const controller of this._controllers.values()) {
      controller.update(this, delta);
    }
  }

  public start(): void {
    this.scene.resume();
  }

  public getController<T extends IController>(key: Symbol): T {
    const controller = this._controllers.get(key);
    if (controller === undefined) {
      throw new Error('Undefined controller with key ' + key);
    }
    return controller as T;
  }
}
