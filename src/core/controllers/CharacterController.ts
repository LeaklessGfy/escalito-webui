import { IBehavioral } from '../../entities/game/IBehavioral';
import { IController } from '../../entities/game/IController';
import { IScene } from '../../entities/game/IScene';
import { Client, ClientKey } from '../../entities/static/Client';
import { EmployeeKey } from '../../entities/static/Employee';
import { Sponsor } from '../../entities/static/Sponsor';
import { TriggerUnit } from '../../entities/static/TimeTrigger';
import { CharacterBuilder } from '../builders/CharacterBuilder';
import { Barmaid } from '../characters/Barmaid';
import { RandomTimeAction } from '../times/RandomTimeAction';
import { BarController } from './BarController';
import { ClockController } from './ClockController';
import { CharacterControllerHelper } from './helpers/CharacterControllerHelper';

export class CharacterController implements IController {
  public static readonly KEY = Symbol();

  private readonly _visitors: IBehavioral[];
  private readonly _visitorsLeaving: IBehavioral[];
  private readonly _employees: Map<EmployeeKey, IBehavioral>;

  private _barmaid!: Barmaid;
  private _characterBuilder!: CharacterBuilder;
  private _barCtr!: BarController;

  constructor() {
    this._visitors = [];
    this._visitorsLeaving = [];
    this._employees = new Map();
  }

  /** Interface **/
  public preload(scene: IScene): void {
    CharacterControllerHelper.preload(scene);
    this._characterBuilder = new CharacterBuilder(scene);
    this._barCtr = scene.getController<BarController>(BarController.KEY);
  }

  public create(scene: IScene): void {
    CharacterControllerHelper.create(scene);
    this._barmaid = this._characterBuilder.buildBarmaid();

    scene.getController<ClockController>(ClockController.KEY).addAction(
      new RandomTimeAction(
        2000,
        5000,
        TriggerUnit.Real,
        5,
        () => this._barCtr.open,
        () => {} //this.createClient(scene)
      )
    );

    this.createSponsor();

    scene.inventory.employees$.subscribe(change => {
      switch (change.type) {
        case 'add':
        case 'update':
          if (!this._employees.has(change.newValue.key)) {
            const gameObject = this._characterBuilder.buildEmployee(
              change.newValue
            );
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
    scene.inventory.initEmployees();
  }

  public update(scene: IScene, delta: number): void {
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
  public createClient() {
    const client = new Client(ClientKey.Default);
    const clientGo = this._characterBuilder.buildClient(client);

    clientGo.onLeave = () => {
      this._visitors.shift();
      this._visitorsLeaving.push(clientGo);
      this._barCtr.destroyGlass();
    };

    this._visitors.push(clientGo);
  }

  public createSponsor() {
    const sponsor = new Sponsor('toto', null as any);
    const sponsorGo = this._characterBuilder.buildSponsor(sponsor);

    sponsorGo.onLeave = () => {
      this._visitors.shift();
      this._visitorsLeaving.push(sponsorGo);
    };

    this._visitors.push(sponsorGo);
  }
}
