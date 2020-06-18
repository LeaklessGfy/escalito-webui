import * as Phaser from 'phaser';

import { BarController } from '../controllers/BarController';
import { CharacterController } from '../controllers/CharacterController';

export class MainScene extends Phaser.Scene {
  private readonly _barController: BarController;
  private readonly _characterController: CharacterController;

  constructor() {
    super({ key: MainScene.name });
    this._barController = new BarController();
    this._characterController = new CharacterController();
  }

  public preload(): void {
    this._barController.preload(this);
    this._characterController.preload(this);
    //this.load.audio('background', 'assets/sound/background.mp3');
  }

  public create(): void {
    this._barController.create(this);
    this._characterController.create(this);
    //this.sound.play('background');
  }

  public update(time: number, delta: number): void {
    this._barController.update(delta);
    this._characterController.update(delta);
  }
}
