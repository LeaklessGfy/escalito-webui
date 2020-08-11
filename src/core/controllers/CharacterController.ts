import { IBehavioral } from '../../entities/game/IBehavioral';
import { IController } from '../../entities/game/IController';
import { IScene } from '../../entities/game/IScene';
import { EmployeeKey } from '../../entities/static/Employee';
import { TriggerUnit } from '../../entities/static/TimeTrigger';
import { BarmaidBuilder } from '../builders/BarmaidBuilder';
import { ClientBuilder } from '../builders/ClientBuilder';
import { EmployeeBuilder } from '../builders/EmployeeBuilder';
import { Barmaid } from '../characters/Barmaid';
import { RandomTimeAction } from '../times/RandomTimeAction';
import { TimeActionManager } from '../times/TimeActionManager';
import { BarController } from './BarController';
import { CharacterControllerHelper } from './helpers/CharacterControllerHelper';

export class CharacterController implements IController {
  public static readonly KEY = Symbol();

  private readonly _timeManager: TimeActionManager;
  private readonly _visitors: IBehavioral[];
  private readonly _visitorsLeaving: IBehavioral[];
  private readonly _employees: Map<EmployeeKey, IBehavioral>;

  private _barmaid?: Barmaid;
  private _barCtr?: BarController;

  constructor() {
    this._timeManager = new TimeActionManager();
    this._visitors = [];
    this._visitorsLeaving = [];
    this._employees = new Map();
  }

  /** Interface **/
  public preload(scene: IScene): void {
    CharacterControllerHelper.preload(scene);
    this._barCtr = scene.getController<BarController>(BarController.KEY);

    this._timeManager.add(
      new RandomTimeAction(
        2000,
        5000,
        TriggerUnit.Real,
        5,
        () => this._barCtr?.open ?? false,
        () => this.createClient(scene)
      )
    );
  }

  public create(scene: IScene): void {
    CharacterControllerHelper.create(scene);

    /*scene.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {}
    });*/

    this._barmaid = new BarmaidBuilder(scene).build();

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
    this._timeManager.update(delta);

    const visitors = [...this._visitors];
    const length = visitors.length;

    for (let i = 0; i < length; i++) {
      const current = visitors[i];
      let next;

      // Has leader
      if (i - 1 > -1) {
        next = visitors[i - 1].position;
      }

      current.update(delta);
      current.behave(
        next,
        scene.settings.middleDimension,
        scene.settings.spawn
      );
    }

    let toRemove = 0;
    for (const leaving of this._visitorsLeaving) {
      leaving.update(delta);

      if (leaving.isNear(scene.settings.spawn, 4)) {
        leaving.destroy();
        toRemove++;
      }
    }

    while (toRemove > 0) {
      this._visitorsLeaving.shift();
      toRemove--;
    }
  }

  public rescale(): void {}

  /** Custom **/
  public createClient(scene: IScene) {
    const client = new ClientBuilder(scene).build();

    client.onLeave = () => {
      this._visitors.shift();
      this._visitorsLeaving.push(client);
      this._barCtr?.destroyGlass();
    };

    this._visitors.push(client);
  }
}
