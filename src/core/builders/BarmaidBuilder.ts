import { Barmaid } from '../characters/Barmaid';
import { SelectController } from '../controllers/SelectControllers';
import { IScene } from '../scenes/IScene';
import { SpriteKey } from '../sprites/SpriteKey';

export class BarmaidBuilder {
  private readonly _scene: IScene;

  public texture: SpriteKey = SpriteKey.Barmaid;

  constructor(scene: IScene) {
    this._scene = scene;
  }

  public get sprite() {
    const { x, y } = this._scene.settings.barPosition;

    const sprite = this._scene.add.sprite(x, y, this.texture);
    sprite
      .setScale(2)
      .setY(sprite.y - sprite.displayHeight / 2)
      .setFlipX(true)
      .setName('Barmaid');

    const selectCtr = this._scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(this._scene, sprite);

    return sprite;
  }

  public build(): Barmaid {
    return new Barmaid(this);
  }
}
