import { Point } from './drawables/Point';

export class Settings {
  public readonly positionBag: Map<string, Point> = new Map();

  public scene?: Phaser.Scene;
  public readonly entrance: number = 0;
  public readonly barColor: number = 0x00ffff;
  public readonly barWidth: number = 300;
  public readonly barHeight: number = 50;
  public readonly floorColor: number = 0x151515;
  public readonly floorHeight: number = 20;

  public get middle() {
    if (!this.scene) {
      return 0;
    }
    return this.scene.scale.displaySize.width / 2;
  }

  public get floor() {
    if (!this.scene) {
      return 0;
    }

    return this.scene.scale.displaySize.height - this.floorHeight;
  }
}
