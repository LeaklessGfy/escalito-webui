import { IScene } from '../../entities/game/IScene';
import { Barmaid } from '../characters/Barmaid';
import { SelectController } from '../controllers/SelectController';
import { SpriteKey } from '../sprites/SpriteKey';

export class BarmaidBuilder {
  private readonly _scene: IScene;

  public spriteKey: SpriteKey = SpriteKey.Barmaid;
  public sprite!: Phaser.GameObjects.Sprite;

  public constructor(scene: IScene) {
    this._scene = scene;
  }

  public build(): Barmaid {
    this.buildSprite();

    return new Barmaid(this);
  }

  private buildSprite() {
    const settings = this._scene.settings;
    const x = settings.middleWidth;
    const y = settings.height - settings.floorHeight;

    const sprite = this._scene.add.sprite(x, y, this.spriteKey);
    sprite
      .setScale(2)
      .setY(sprite.y - sprite.displayHeight / 1.5)
      .setFlipX(true)
      .setName('Barmaid');

    const selectCtr = this._scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(this._scene, sprite);

    this.sprite = sprite;
  }
}
