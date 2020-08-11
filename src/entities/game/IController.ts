import { IScene } from './IScene';

export interface IController {
  preload(scene: IScene): void;
  create(scene: IScene): void;
  update(scene: IScene, delta: number): void;
  rescale(): void;
}
