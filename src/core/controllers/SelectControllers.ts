import { IScene } from '../scenes/IScene';
import { IController } from './IController';

export class SelectController implements IController {
  public static readonly KEY = Symbol();

  private static readonly STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
    color: '#FFFFFF',
    fontFamily: 'Arial Black',
    fontSize: '15px',
    //backgroundColor: '#FFFFFF',
    padding: {
      x: 15,
      y: 10
    }
  };

  private readonly _selectors: Phaser.GameObjects.GameObject[] = [];

  private _selectedText?: Phaser.GameObjects.Text;

  public preload(scene: IScene): void {}

  public create(scene: IScene): void {
    //scene.input.setDefaultCursor('url(assets/cursor.basic.png), pointer');
    this._selectedText = scene.add.text(0, 0, '', SelectController.STYLE);
  }

  public update(scene: IScene, delta: number): void {}

  public addSelect(scene: IScene, sprite: Phaser.GameObjects.GameObject) {
    this._selectors.push(sprite);

    sprite.setInteractive();
    sprite.on('pointerover', () => {
      scene.input.setDefaultCursor('pointer');
      this._selectedText?.setText(sprite.name);
    });
    sprite.on('pointerout', () => {
      scene.input.setDefaultCursor('default');
      this._selectedText?.setText('');
    });
  }
}
