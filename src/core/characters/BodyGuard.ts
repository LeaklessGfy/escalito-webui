import { IBehavioral } from '../../entities/game/IBehavioral';
import { IPoint } from '../../entities/game/IPoint';
import { EmployeeBuilder } from '../builders/EmployeeBuilder';
import { AbstractCharacter } from './AbstractCharacter';

export class BodyGuard extends AbstractCharacter implements IBehavioral {
  constructor(builder: EmployeeBuilder) {
    super(builder.sprite, builder.spriteKey);
  }

  behave(next: IPoint, bar: IPoint, spawn: IPoint): void {}
}
