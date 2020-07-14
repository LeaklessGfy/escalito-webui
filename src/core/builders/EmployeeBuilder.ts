import { EmployeeKey } from '../../entities/static/Employee';
import { BodyGuard } from '../characters/BodyGuard';
import { IBehavioral } from '../characters/IBehavioral';
import { SelectController } from '../controllers/SelectControllers';
import { IScene } from '../scenes/IScene';
import { SpriteKey } from '../sprites/SpriteKey';

export class EmployeeBuilder {
  private readonly _scene: IScene;

  public key: EmployeeKey = EmployeeKey.BodyGuard;

  constructor(scene: IScene) {
    this._scene = scene;
  }

  public get texture(): SpriteKey {
    switch (this.key) {
      case EmployeeKey.BodyGuard:
        return SpriteKey.BodyGuard;
      default:
        return SpriteKey.BodyGuard;
    }
  }

  public get sprite(): Phaser.GameObjects.Sprite {
    const { x, y } = this._scene.settings.spawnPosition;

    const sprite = this._scene.add.sprite(x, y, this.texture);

    const selectCtr = this._scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(this._scene, sprite);

    return sprite;
  }

  public build(key: EmployeeKey): IBehavioral {
    this.key = key;

    return new BodyGuard(this);
  }
}
