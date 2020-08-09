import { Store } from '../../store';
import { IScene } from './IScene';

export interface IController {
  preload(scene: IScene): void;
  create(scene: IScene): void;
  update(scene: IScene, delta: number): void;
  daily(scene: IScene, store: Store, day: number): void;
}
