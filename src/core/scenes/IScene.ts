import { Inventory } from '../../entities/Inventory';
import { Settings } from '../Settings';
import { IController } from '../controllers/IController';

export interface IScene extends Phaser.Scene {
  readonly inventory: Inventory;
  readonly settings: Settings;
  getController<T extends IController>(key: Symbol): T;
}
