import { IBehavioral } from '../../entities/game/IBehavioral';
import { IController } from '../../entities/game/IController';
import { IScene } from '../../entities/game/IScene';
import { EmployeeKey } from '../../entities/static/Employee';
import { Store } from '../../store';
import { BarmaidBuilder } from '../builders/BarmaidBuilder';
import { ClientBuilder } from '../builders/ClientBuilder';
import { EmployeeBuilder } from '../builders/EmployeeBuilder';
import { Barmaid } from '../characters/Barmaid';
import { Client } from '../characters/Client';
import { AnimKey } from '../sprites/AnimKey';
import { SpriteKey } from '../sprites/SpriteKey';

export class CharacterController implements IController {
  public static readonly KEY = Symbol();

  private readonly _visitors: IBehavioral[];
  private readonly _leaving: Client[];
  private readonly _employees: Map<EmployeeKey, IBehavioral>;

  private _barmaid?: Barmaid;

  constructor() {
    this._visitors = [];
    this._leaving = [];
    this._employees = new Map();
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

    this._barmaid = new BarmaidBuilder(scene).build();
    this.createClient(scene);

    scene.inventory.employees$.subscribe(change => {
      if (change === undefined) {
        return;
      }

      switch (change.type) {
        case 'add':
        case 'update':
          if (!this._employees.has(change.newValue.key)) {
            const gameObject = new EmployeeBuilder(scene).build();
            this._employees.set(change.newValue.key, gameObject);
          }
          break;
        case 'remove':
          const gameObject = this._employees.get(change.oldValue.key);
          if (gameObject === undefined) {
            throw new Error();
          }
          gameObject.destroy();
          break;
      }
    });
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
    const client = new ClientBuilder(scene).build();

    client.onLeave = () => {
      this._visitors.pop();
      this._leaving.push(client);
    };

    this._visitors.push(client);
  }
}
