import { ICharacterGameObject } from './ICharacterGameObject';
import { IPoint } from './IPoint';

export interface IBehavioral extends ICharacterGameObject {
  behave(leader: IPoint | undefined, bar: IPoint, spawn: IPoint): void;
}
