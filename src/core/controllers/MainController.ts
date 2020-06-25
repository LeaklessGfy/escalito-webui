import { Order } from '../../entities/static/Order';
import { Client } from '../characters/Client';
import { IScene } from '../scenes/IScene';
import { AudioController } from './AudioController';
import { IController } from './IController';

export class MainController implements IController {
  public static readonly KEY = Symbol();

  private _audioCtr?: AudioController;

  private _currentDifficulty: number = 1;
  private _currentReputation: number = 1;
  private _nextDifficulty: number = 1;
  private _nextReputation: number = 1;

  private _positiveCombo: number = 0;
  private _negativeCombo: number = 0;

  public preload(scene: IScene): void {
    this._audioCtr = scene.getController<AudioController>(AudioController.KEY);
  }

  public create(scene: IScene): void {}

  public update(scene: IScene, delta: number): void {}

  public increment(client: Client, order: Order): number {
    return client.satisfied
      ? this.incrementSuccess(client, order)
      : this.incrementFailure(client, order);
  }

  private incrementSuccess(client: Client, order: Order): number {
    this._positiveCombo++;
    this._negativeCombo = 0;

    const amount = this.applyBonuses(client);
    this._audioCtr?.playSuccess();

    if (this._positiveCombo % 3 == 0) {
      this._audioCtr?.playLaught();
    }

    if (this._positiveCombo % 10 == 0) {
      this._nextDifficulty++;
    }

    if (this._positiveCombo % 20 == 0) {
      this._nextReputation++;
    }

    // change inventory cash

    return amount;
  }

  private incrementFailure(client: Client, order: Order): number {
    this._positiveCombo = 0;
    this._negativeCombo++;

    const amount = this.applyPenalties(client);
    this._audioCtr?.playFailue();

    if (this._negativeCombo % 10 == 0) {
      this._nextReputation--;
    }

    /*
    change inventory cash
    if (inventory.cash === 0 || < 0) {
      // GAME OVER
    }
    lost sponsors
    */

    return amount;
  }

  private applyBonuses(client: Client): number {
    return 0;
  }

  private applyPenalties(client: Client): number {
    return 0;
  }
}
