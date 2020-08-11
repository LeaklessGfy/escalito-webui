import { IPoint } from './IPoint';

export interface ISettings {
  readonly floorHeight: number;

  readonly width: number;
  readonly height: number;
  readonly middleWidth: number;
  readonly middleHeight: number;
  readonly dimension: IPoint;
  readonly middleDimension: IPoint;

  readonly bottle: IPoint;
  readonly spawn: IPoint;
}
