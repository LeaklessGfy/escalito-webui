import { Barmaid } from '../characters/Barmaid';
import { CharacterFactory } from '../characters/CharacterFactory';
import { Client } from '../characters/Client';
import { IScene } from '../scenes/IScene';
import { AnimKey } from '../sprites/AnimKey';
import { PositionKey } from '../sprites/PositionKey';
import { SpriteKey } from '../sprites/SpriteKey';
import { IController } from './IController';

export class CharacterController implements IController {
  public static readonly KEY: Symbol = Symbol();

  private readonly _factory: CharacterFactory;
  private readonly _clients: Client[];
  private readonly _leaving: Client[];

  private _barmaid?: Barmaid;

  constructor() {
    this._factory = new CharacterFactory();
    this._clients = [];
    this._leaving = [];
  }

  public preload(scene: IScene): void {
    scene.load.spritesheet(
      SpriteKey.Barmaid + '.' + AnimKey.Idle,
      'assets/barmaid.idle.png',
      {
        frameWidth: 19,
        frameHeight: 34
      }
    );
    scene.load.spritesheet(
      SpriteKey.Barmaid + '.' + AnimKey.Move,
      'assets/barmaid.move.png',
      {
        frameWidth: 21,
        frameHeight: 33
      }
    );
    scene.load.spritesheet(
      SpriteKey.DefaultClient + '.' + AnimKey.Idle,
      'assets/client1.idle.png',
      {
        frameWidth: 32,
        frameHeight: 28
      }
    );
    scene.load.spritesheet(
      SpriteKey.DefaultClient + '.' + AnimKey.Move,
      'assets/client1.move.png',
      {
        frameWidth: 32,
        frameHeight: 32
      }
    );
  }

  public create(scene: IScene): void {
    scene.anims.create({
      key: SpriteKey.Barmaid + '.' + AnimKey.Idle,
      frames: scene.anims.generateFrameNumbers(
        SpriteKey.Barmaid + '.' + AnimKey.Idle,
        {
          start: 0,
          end: 11
        }
      ),
      frameRate: 10,
      repeat: -1
    });
    scene.anims.create({
      key: SpriteKey.Barmaid + '.' + AnimKey.Move,
      frames: scene.anims.generateFrameNumbers(
        SpriteKey.Barmaid + '.' + AnimKey.Move,
        {
          start: 0,
          end: 11
        }
      ),
      frameRate: 10,
      repeat: -1
    });
    scene.anims.create({
      key: SpriteKey.DefaultClient + '.' + AnimKey.Idle,
      frames: scene.anims.generateFrameNumbers(
        SpriteKey.DefaultClient + '.' + AnimKey.Idle,
        {
          start: 0,
          end: 7
        }
      ),
      frameRate: 5,
      repeat: -1
    });
    scene.anims.create({
      key: SpriteKey.DefaultClient + '.' + AnimKey.Move,
      frames: scene.anims.generateFrameNumbers(
        SpriteKey.DefaultClient + '.' + AnimKey.Move,
        {
          start: 0,
          end: 7
        }
      ),
      frameRate: 7,
      repeat: -1
    });

    /*scene.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {}
    });*/

    this._barmaid = this._factory.buildBarmaid(scene);
    this.createClient(scene);
  }

  public update(scene: IScene, delta: number): void {
    const c = this._clients;
    const l = this._clients.length;
    const barPosition = scene.settings.getPosition(PositionKey.Bar);
    const spawnPosition = scene.settings.getPosition(PositionKey.Door);

    this._barmaid?.update(delta);

    for (let i = 0; i < l; i++) {
      const current = c[i];
      let next = barPosition;

      // Has leader
      if (i + 1 < l) {
        next = c[i + 1].position;
      }

      current.update(delta);
      current.behave(next, barPosition, spawnPosition);
    }

    let toRemove = 0;
    for (const leaving of this._leaving) {
      leaving.update(delta);

      if (leaving.isNear(spawnPosition, 4)) {
        leaving.destroy();
        toRemove++;
      }
    }

    while (toRemove > 0) {
      this._leaving.pop();
      toRemove--;
    }
  }

  private createClient(scene: IScene) {
    const client = this._factory.buildClient(scene);

    client.onLeave = () => {
      this._clients.pop();
      this._leaving.push(client);
    };

    this._clients.push(client);
  }
}
