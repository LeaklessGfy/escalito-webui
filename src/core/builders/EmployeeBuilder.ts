import { IBehavioral } from '../../entities/game/IBehavioral';
import { IScene } from '../../entities/game/IScene';
import { Employee, EmployeeKey } from '../../entities/static/Employee';
import { BodyGuard } from '../characters/BodyGuard';
import { SelectController } from '../controllers/SelectController';
import { SpriteKey } from '../sprites/SpriteKey';

export class EmployeeBuilder {
  private readonly _scene: IScene;

  public employee!: Employee;
  public sprite!: Phaser.GameObjects.Sprite;

  public constructor(scene: IScene) {
    this._scene = scene;
  }

  public get spriteKey(): SpriteKey {
    switch (this.employee.key) {
      case EmployeeKey.BodyGuard:
        return SpriteKey.BodyGuard;
      default:
        return SpriteKey.BodyGuard;
    }
  }

  public build(employee: Employee): IBehavioral {
    this.employee = employee;
    this.buildSprite();

    return new BodyGuard(this);
  }

  private buildSprite() {
    const { x, y } = this._scene.settings.spawn;

    const sprite = this._scene.add.sprite(x, y, this.spriteKey);

    const selectCtr = this._scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(this._scene, sprite);

    this.sprite = sprite;
  }
}
