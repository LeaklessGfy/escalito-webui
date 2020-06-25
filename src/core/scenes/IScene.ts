import { Inventory } from '../../entities/Inventory';
import { Store } from '../../store';
import { Settings } from '../Settings';
import { IController } from '../controllers/IController';

export interface IScene extends Phaser.Scene {
  readonly store: Store;
  readonly inventory: Inventory;
  readonly settings: Settings;
  getController<T extends IController>(key: Symbol): T;
}
