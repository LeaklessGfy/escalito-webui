export enum CharacterKey {
  Barmaid,
  Client,
  Employee,
  Sponsor,
  Cop
}

export interface Character {
  readonly type: CharacterKey;
}
