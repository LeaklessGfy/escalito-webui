import { Scene } from 'phaser';

export interface IController {
  preload(scene: Scene): void;
  create(scene: Scene): void;
  update(delta: number): void;
}
