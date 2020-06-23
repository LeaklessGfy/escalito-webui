import { Point } from '../positions/Point';
import { AbstractCharacter } from './AbstractCharacter';

export class Barmaid extends AbstractCharacter {
  public behave(point: Point): void {
    throw new Error('Method not implemented.');
  }
}
