import { ICharacterGameObject } from '../../entities/game/ICharacterGameObject';
import { IScene } from '../../entities/game/IScene';
import { Character, CharacterKey } from '../../entities/static/Character';
import { BarmaidBuilder } from './BarmaidBuilder';
import { ClientBuilder } from './ClientBuilder';
import { EmployeeBuilder } from './EmployeeBuilder';

export class CharacterBuilder {
  private readonly _scene: IScene;

  public constructor(scene: IScene) {
    this._scene = scene;
  }

  public build<T extends ICharacterGameObject, V extends Character>(
    character: V
  ): T {
    switch (character.key) {
      case CharacterKey.Barmaid:
        return new BarmaidBuilder(this._scene).build() as any;
      case CharacterKey.Client:
        return new ClientBuilder(this._scene).build() as any;
      case CharacterKey.Employee:
        return new EmployeeBuilder(this._scene).build() as any;
      default:
        throw new Error('Type has no defined builder');
    }
  }
}
