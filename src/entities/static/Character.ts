export enum CharacterKey {
  Barmaid,
  Client,
  Employee,
  Sponsor,
  Cop
}

export class Character {
  public readonly key: CharacterKey;

  public constructor(key: CharacterKey) {
    this.key = key;
  }
}
