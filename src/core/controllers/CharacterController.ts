import { Scene } from 'phaser';

import { $S } from '../Settings';
import { CharacterAnim, CharacterKey } from '../characters/AbstractCharacter';
import { Barmaid } from '../characters/Barmaid';
import { CharacterFactory } from '../characters/CharacterFactory';
import { Client } from '../characters/Client';
import { IController } from './IController';

const BARMAID_IDLE = CharacterKey.Barmaid + '.' + CharacterAnim.Idle;
const BARMAID_MOVE = CharacterKey.Barmaid + '.' + CharacterAnim.Move;
const CLIENT1_IDLE = CharacterKey.Client1 + '.' + CharacterAnim.Idle;
const CLIENT1_MOVE = CharacterKey.Client1 + '.' + CharacterAnim.Move;

export class CharacterController implements IController {
  private readonly _factory: CharacterFactory;
  private readonly _clients: Client[];

  private _barmaid?: Barmaid;

  constructor() {
    this._factory = new CharacterFactory();
    this._clients = [];
  }

  public preload(scene: Scene): void {
    scene.load.spritesheet(BARMAID_IDLE, 'assets/barmaid.idle.png', {
      frameWidth: 19,
      frameHeight: 34
    });
    scene.load.spritesheet(BARMAID_MOVE, 'assets/barmaid.move.png', {
      frameWidth: 21,
      frameHeight: 33
    });
    scene.load.spritesheet(CLIENT1_IDLE, 'assets/client1.idle.png', {
      frameWidth: 32,
      frameHeight: 28
    });
    scene.load.spritesheet(CLIENT1_MOVE, 'assets/client1.move.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  public create(scene: Scene): void {
    scene.anims.create({
      key: BARMAID_IDLE,
      frames: scene.anims.generateFrameNumbers(BARMAID_IDLE, {
        start: 0,
        end: 11
      }),
      frameRate: 10,
      repeat: -1
    });
    scene.anims.create({
      key: BARMAID_MOVE,
      frames: scene.anims.generateFrameNumbers(BARMAID_MOVE, {
        start: 0,
        end: 11
      }),
      frameRate: 10,
      repeat: -1
    });
    scene.anims.create({
      key: CLIENT1_IDLE,
      frames: scene.anims.generateFrameNumbers(CLIENT1_IDLE, {
        start: 0,
        end: 7
      }),
      frameRate: 5,
      repeat: -1
    });
    scene.anims.create({
      key: CLIENT1_MOVE,
      frames: scene.anims.generateFrameNumbers(CLIENT1_MOVE, {
        start: 0,
        end: 7
      }),
      frameRate: 7,
      repeat: -1
    });

    scene.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {}
    });

    const client = this._factory.buildClient(scene);
    this._clients.push(client);

    this._barmaid = this._factory.buildBarmaid(scene);
  }

  public update(delta: number): void {
    const c = this._clients;
    const l = this._clients.length;
    const barPosition = $S.positionBag.get('bar');

    this._barmaid?.update(delta);

    for (let i = 0; i < l; i++) {
      const current = c[i];
      let next = barPosition;

      // Has leader
      if (i + 1 < l) {
        next = c[i + 1].position;
      }

      current.update(delta);
      if (next !== undefined && barPosition !== undefined) {
        current.behave(next, barPosition);
      }
    }
  }
}
