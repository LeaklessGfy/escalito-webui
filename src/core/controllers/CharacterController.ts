import { Order } from '../../entities/static/Order';
import { Store } from '../../store';
import { Barmaid } from '../characters/Barmaid';
import { CharacterFactory } from '../characters/CharacterFactory';
import { Client } from '../characters/Client';
import { IBehavioral } from '../characters/IBehavioral';
import { IScene } from '../scenes/IScene';
import { AnimKey } from '../sprites/AnimKey';
import { SpriteKey } from '../sprites/SpriteKey';
import { IController } from './IController';

export class CharacterController implements IController {
  public static readonly KEY: Symbol = Symbol();

  private readonly _factory: CharacterFactory;
  private readonly _visitors: IBehavioral[];
  private readonly _leaving: Client[];

  private _barmaid?: Barmaid;

  constructor() {
    this._factory = new CharacterFactory();
    this._visitors = [];
    this._leaving = [];
  }

  /** Interface **/
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
    // this.createClient(scene);
  }

  public update(scene: IScene, delta: number): void {
    const visitors = this._visitors;
    const length = visitors.length;

    this._barmaid?.update(delta);

    for (let i = 0; i < length; i++) {
      const current = visitors[i];
      let next = scene.settings.barPosition;

      // Has leader
      if (i + 1 < length) {
        next = visitors[i + 1].position;
      }

      current.update(delta);
      current.behave(
        next,
        scene.settings.barPosition,
        scene.settings.spawnPosition
      );
    }

    let toRemove = 0;
    for (const leaving of this._leaving) {
      leaving.update(delta);

      if (leaving.isNear(scene.settings.spawnPosition, 4)) {
        leaving.destroy();
        toRemove++;
      }
    }

    while (toRemove > 0) {
      this._leaving.pop();
      toRemove--;
    }
  }

  public daily(scene: IScene, store: Store, day: number): void {}

  /** Custom **/
  private createClient(scene: IScene) {
    const client = this._factory.buildClient(scene);

    client.createOrder = () => {
      const { cocktails } = scene.store.inventory;

      if (cocktails.length < 1) {
        return undefined;
      }

      const cocktail = cocktails[0]; // select based from hype and maybe other factor depending on client
      return new Order(cocktail);
    };

    client.onLeave = () => {
      this._visitors.pop();
      this._leaving.push(client);
    };

    this._visitors.push(client);
  }
}
