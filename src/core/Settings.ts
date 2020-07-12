import { Point } from './sprites/Point';
import { PositionKey } from './sprites/PositionKey';

export class Settings {
  private readonly _bag: Map<PositionKey, Point> = new Map();

  public scene?: Phaser.Scene;
  public readonly floorHeight: number = 20;

  public get width(): number {
    return this.scene?.scale.displaySize.width ?? 0;
  }

  public get height(): number {
    return this.scene?.scale.displaySize.height ?? 0;
  }

  public get middleWidth(): number {
    return this.width / 2;
  }

  public get middleHeight(): number {
    return this.height / 2;
  }

  public get floor(): number {
    return this.height - this.floorHeight;
  }

  public get bottlePosition(): Point {
    return {
      x: this.middleWidth + this.middleWidth / 2,
      y: this.middleHeight
    };
  }

  public get glassPosition(): Point {
    return {
      x: this.middleWidth,
      y: this.middleHeight
    };
  }

  public getPosition(key: PositionKey): Point {
    const position = this._bag.get(key);
    if (position === undefined) {
      throw new Error(`Position with key ${key} is undefined`);
    }
    return position;
  }

  public addPosition(key: PositionKey, position: Point): void {
    this._bag.set(key, position);
  }
}
