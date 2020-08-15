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

export class Client implements Character {
  private static readonly PATIENCE: number = 20000;
  private static readonly SATISFACTION_THRESHOLD: number = 20;

  public readonly key: ClientKey;
  public readonly type: CharacterKey = CharacterKey.Client;
  public readonly name: string;
  public readonly cash: number;
  public readonly patience: number;
  public readonly addiction: number;
  public readonly resistance: number;
  public readonly satisfactionThreshold: number;
  public readonly socialClass: ClientSocialClass;

  public constructor(key: ClientKey) {
    this.key = key;
    this.type = CharacterKey.Client;
    this.name = '';
    this.cash = 5;
    this.patience = Client.PATIENCE;
    this.addiction = 2;
    this.resistance = 0;
    this.satisfactionThreshold = Client.SATISFACTION_THRESHOLD;
    this.socialClass = ClientSocialClass.Middle;
  }
}
