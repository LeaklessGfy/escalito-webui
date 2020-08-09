import { IController } from './IController';
import { IInventory } from './IInventory';
import { ISettings } from './ISettings';

export interface IScene extends Phaser.Scene {
  readonly inventory: IInventory;
  readonly settings: ISettings;
  start(): void;
  getController<T extends IController>(key: Symbol): T;
}
