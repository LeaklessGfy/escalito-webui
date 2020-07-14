import { EmployeeBuilder } from '../builders/EmployeeBuilder';
import { Point } from '../sprites/Point';
import { AbstractCharacter } from './AbstractCharacter';
import { IBehavioral } from './IBehavioral';

export class BodyGuard extends AbstractCharacter implements IBehavioral {
  constructor(builder: EmployeeBuilder) {
    super(builder.sprite, builder.texture);
  }

  behave(next: Point, bar: Point, spawn: Point): void {}
}
