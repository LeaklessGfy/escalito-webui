import { Store } from '../../store';
import { Settings } from '../Settings';
import { IController } from '../controllers/IController';

export interface IScene extends Phaser.Scene {
  readonly store: Store;
  readonly settings: Settings;
  start(): void;
  getController<T extends IController>(key: Symbol): T;
}
