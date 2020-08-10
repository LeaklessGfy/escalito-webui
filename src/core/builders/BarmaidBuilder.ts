import { IScene } from '../../entities/game/IScene';
import { Barmaid } from '../characters/Barmaid';
import { SelectController } from '../controllers/SelectController';
import { SpriteKey } from '../sprites/SpriteKey';

export class BarmaidBuilder {
  private readonly _scene: IScene;

  private _spriteKey: SpriteKey = SpriteKey.Barmaid;
  private _sprite?: Phaser.GameObjects.Sprite;

  constructor(scene: IScene) {
    this._scene = scene;
  }

  public get spriteKey(): SpriteKey {
    return this._spriteKey;
  }

  public get sprite(): Phaser.GameObjects.Sprite {
    if (this._sprite === undefined) {
      throw new Error('Can not access sprite on un-build builder');
    }
    return this._sprite;
  }

  public build(): Barmaid {
    this.buildSprite();

    return new Barmaid(this);
  }

  private buildSprite() {
    const { x, y } = this._scene.settings.barPosition;

    const sprite = this._scene.add.sprite(x, y, this._spriteKey);
    sprite
      .setScale(2)
      .setY(sprite.y - sprite.displayHeight / 2)
      .setFlipX(true)
      .setName('Barmaid');

    console.log(sprite.originX);

    const selectCtr = this._scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(this._scene, sprite);

    this._sprite = sprite;
  }
}
