import { TintHelper } from '../utils/TintHelper';
import { Dimension } from './Dimension';

export class Bar {
  private readonly _background: Phaser.GameObjects.Graphics;
  private readonly _foreground: Phaser.GameObjects.Graphics;

  private _dimension: Dimension = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  constructor(
    background: Phaser.GameObjects.Graphics,
    foreground: Phaser.GameObjects.Graphics
  ) {
    this._background = background;
    this._foreground = foreground;
  }

  public show(dimension: Dimension) {
    this._dimension = dimension;
    this.fillBackground();
    this.fillForeground(100);
  }

  public update(percent: number) {
    this.fillForeground(Math.max(0, percent));
  }

  public hide() {
    this._background.clear();
    this._foreground.clear();
  }

  public destroy() {
    this._background.destroy();
    this._foreground.destroy();
  }

  private fillBackground() {
    const color = 0xffffff;
    const { x, y, width, height } = this._dimension;

    this._background.fillStyle(color, 1);
    this._background.fillRect(x, y, width, height);
  }

  private fillForeground(percent: number) {
    const color = TintHelper.getTint(percent);
    const { x, y, width, height } = this._dimension;
    const realWidth = (percent / 100) * width;

    this._foreground.clear();
    this._foreground.fillStyle(color, 1);
    this._foreground.fillRect(x, y, realWidth, height);
  }
}
