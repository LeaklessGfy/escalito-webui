import { IPoint } from '../entities/game/IPoint';
import { ISettings } from '../entities/game/ISettings';

export class Settings implements ISettings {
  public readonly width: number;
  public readonly height: number;
  public readonly middleWidth: number;
  public readonly middleHeight: number;
  public readonly floorHeight: number;

  public readonly dimension: IPoint;
  public readonly middleDimension: IPoint;
  public readonly bottle: IPoint;
  public readonly spawn: IPoint;

  public constructor(width: number, height: number, floorHeight: number = 10) {
    this.width = width;
    this.height = height;
    this.middleWidth = width / 2;
    this.middleHeight = height / 2;
    this.floorHeight = floorHeight;

    this.dimension = { x: width, y: height };
    this.middleDimension = { x: this.middleWidth, y: this.middleHeight };
    this.bottle = {
      x: this.middleWidth + this.middleWidth / 2,
      y: this.middleHeight - floorHeight / 2
    };
    this.spawn = {
      x: width * 0.07,
      y: height - floorHeight
    };
  }
}
