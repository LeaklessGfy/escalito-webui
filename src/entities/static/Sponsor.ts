import { Character, CharacterKey } from './Character';
import { Contract } from './Contract';

export class Sponsor implements Character {
  public readonly type: CharacterKey;
  public readonly name: string;
  public readonly contract: Contract;

  public constructor(name: string, contract: Contract) {
    this.type = CharacterKey.Sponsor;
    this.name = name;
    this.contract = contract;
  }
}
