import { IBehavioral } from '../../entities/game/IBehavioral';
import { IController } from '../../entities/game/IController';
import { IScene } from '../../entities/game/IScene';
import { EmployeeKey } from '../../entities/static/Employee';
import { BarmaidBuilder } from '../builders/BarmaidBuilder';
import { ClientBuilder } from '../builders/ClientBuilder';
import { EmployeeBuilder } from '../builders/EmployeeBuilder';
import { Barmaid } from '../characters/Barmaid';
import { Client } from '../characters/Client';
import { BarController } from './BarController';
import { SubCharacterController } from './SubCharacterController';

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
    SubCharacterController.preload(scene);
  }

  public create(scene: IScene): void {
    SubCharacterController.create(scene);

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
        case 'delete':
          const gameObject = this._employees.get(change.oldValue.key);
          if (gameObject === undefined) {
            throw new Error('Can not remove unexisting employee');
          }
          gameObject.destroy();
          this._employees.delete(change.oldValue.key);
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
      let next = scene.settings.middleDimension;

      // Has leader
      if (i + 1 < length) {
        next = visitors[i + 1].position;
      }

      current.update(delta);
      current.behave(
        next,
        scene.settings.middleDimension,
        scene.settings.spawn
      );
    }

    let toRemove = 0;
    for (const leaving of this._leaving) {
      leaving.update(delta);

      if (leaving.isNear(scene.settings.spawn, 4)) {
        leaving.destroy();
        toRemove++;
      }
    }

    while (toRemove > 0) {
      this._leaving.pop();
      toRemove--;
    }
  }

  /** Custom **/
  private createClient(scene: IScene) {
    const client = new ClientBuilder(scene).build();

    client.onLeave = () => {
      this._visitors.pop();
      this._leaving.push(client);
      scene.getController<BarController>(BarController.KEY).destroyGlass();
    };

    this._visitors.push(client);
  }
}
