import { Point, PositionKey } from './positions/Point';

export class Settings {
  private readonly _bag: Map<PositionKey, Point> = new Map();

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

  public getPosition(key: PositionKey) {
    const position = this._bag.get(key);
    if (position === undefined) {
      throw new Error(`Position with key ${key} is undefined`);
    }
    return position;
  }

  public addPosition(key: PositionKey, position: Point) {
    this._bag.set(key, position);
  }
}
