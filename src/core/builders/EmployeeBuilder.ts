import { IBehavioral } from '../../entities/game/IBehavioral';
import { IScene } from '../../entities/game/IScene';
import { EmployeeKey } from '../../entities/static/Employee';
import { BodyGuard } from '../characters/BodyGuard';
import { SelectController } from '../controllers/SelectController';
import { SpriteKey } from '../sprites/SpriteKey';

export class EmployeeBuilder {
  private readonly _scene: IScene;

  private _key: EmployeeKey = EmployeeKey.BodyGuard;
  private _sprite?: Phaser.GameObjects.Sprite;

  constructor(scene: IScene) {
    this._scene = scene;
  }

  public get spriteKey(): SpriteKey {
    switch (this._key) {
      case EmployeeKey.BodyGuard:
        return SpriteKey.BodyGuard;
      default:
        return SpriteKey.BodyGuard;
    }
  }

  public get sprite(): Phaser.GameObjects.Sprite {
    if (this._sprite === undefined) {
      throw new Error('Can not access sprite on un-build builder');
    }
    return this._sprite;
  }

  public build(): IBehavioral {
    this.buildSprite();

    return new BodyGuard(this);
  }

  private buildSprite() {
    const { x, y } = this._scene.settings.spawnPosition;

    const sprite = this._scene.add.sprite(x, y, this.spriteKey);

    const selectCtr = this._scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(this._scene, sprite);

    this._sprite = sprite;
  }
}
