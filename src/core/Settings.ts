import { Scene } from 'phaser';

import { Point } from './drawables/Point';

class Settings {
  public readonly positionBag: Map<string, Point> = new Map();
  public readonly entrance: integer = 0;
  public readonly barColor: integer = 0x00ffff;
  public readonly barWidth: integer = 300;
  public readonly barHeight: integer = 50;
  public readonly floorColor: integer = 0x151515;
  public readonly floorHeight: integer = 20;

  public middle(scene: Scene): number {
    return scene.scale.displaySize.width / 2;
  }

  public floor(scene: Scene): number {
    return scene.scale.displaySize.height - this.floorHeight;
  }
}

export const $S = new Settings();
