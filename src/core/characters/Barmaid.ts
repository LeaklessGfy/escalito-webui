import { BarmaidBuilder } from '../builders/BarmaidBuilder';
import { AbstractCharacter } from './AbstractCharacter';

export class Barmaid extends AbstractCharacter {
  constructor(builder: BarmaidBuilder) {
    super(builder.sprite, builder.spriteKey);
  }
}
