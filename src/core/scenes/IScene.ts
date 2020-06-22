import { Settings } from '../Settings';
import { IController } from '../controllers/IController';

export interface IScene extends Phaser.Scene {
  readonly settings: Settings;
  getController<T extends IController>(key: Symbol): T;
}
