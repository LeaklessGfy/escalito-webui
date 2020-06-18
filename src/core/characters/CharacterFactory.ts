import { Scene } from 'phaser';

import { $S } from '../Settings';
import { CharacterKey } from './AbstractCharacter';
import { Barmaid } from './Barmaid';
import { Client } from './Client';

export class CharacterFactory {
  public buildBarmaid(scene: Scene): Barmaid {
    const x = $S.middle(scene);
    const y = $S.floor(scene);

    const sprite = scene.add.sprite(x, y, CharacterKey.Barmaid);
    sprite
      .setScale(2)
      .setY(sprite.y - sprite.displayHeight / 2)
      .setFlipX(true);
    $S.positionBag.set(CharacterKey.Barmaid, { x: sprite.x, y: sprite.y });

    const barmaid = new Barmaid(sprite, CharacterKey.Barmaid);

    return barmaid;
  }

  public buildClient(scene: Scene, texture: string): Client {
    const sprite = scene.add.sprite(0, 0, CharacterKey.Client1);
    const client = new Client(sprite, CharacterKey.Client1);

    return client;
  }
}
