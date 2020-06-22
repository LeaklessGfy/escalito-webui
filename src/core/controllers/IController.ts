import { IScene } from '../scenes/IScene';

export interface IController {
  preload(scene: IScene): void;
  create(scene: IScene): void;
  update(scene: IScene, delta: number): void;
}
