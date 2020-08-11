import { Character, CharacterKey } from './Character';
import { Contract } from './Contract';

export class Sponsor extends Character {
  public readonly name: string;
  public readonly contract: Contract;

  public constructor(name: string, contract: Contract) {
    super(CharacterKey.Sponsor);
    this.name = name;
    this.contract = contract;
  }
}
