import { IPoint } from '../entities/game/IPoint';
import { ISettings } from '../entities/game/ISettings';

export class Settings implements ISettings {
  public scene?: Phaser.Scene;
  public readonly floorHeight: number = 10;

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

  public get dimension(): IPoint {
    return { x: this.width, y: this.height };
  }

  public get middleDimension(): IPoint {
    return { x: this.middleWidth, y: this.middleHeight };
  }

  public get bottle(): IPoint {
    return {
      x: this.middleWidth + this.middleWidth / 2,
      y: this.middleHeight
    };
  }

  public get spawn(): IPoint {
    return {
      x: this.width * 0.07,
      y: this.height - this.floorHeight
    };
  }
}
