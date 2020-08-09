import { IPoint } from './IPoint';

export interface ISettings {
  readonly width: number;
  readonly height: number;
  readonly middleWidth: number;
  readonly middleHeight: number;

  readonly floor: number;
  readonly floorHeight: number;

  readonly bottlePosition: IPoint;
  readonly glassPosition: IPoint;
  readonly barPosition: IPoint;
  readonly spawnPosition: IPoint;
}
