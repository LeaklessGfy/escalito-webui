import { Character, CharacterKey } from './Character';

export enum ClientKey {
  Default
}

export enum ClientSocialClass {
  Rich,
  Hypster,
  Middle,
  Poor,
  Crackhead
}

export class Client extends Character {
  public readonly subKey: ClientKey;
  public readonly name: string;
  public readonly cash: number;
  public readonly patience: number;
  public readonly addiction: number;
  public readonly resistance: number;
  public readonly socialClass: ClientSocialClass;

  public constructor(subKey: ClientKey) {
    super(CharacterKey.Client);
    this.subKey = subKey;
    this.name = '';
    this.cash = 5;
    this.patience = 20000;
    this.addiction = 2;
    this.resistance = 0;
    this.socialClass = ClientSocialClass.Middle;
  }
}
