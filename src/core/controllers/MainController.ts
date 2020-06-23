import { Client } from '../characters/Client';
import { IScene } from '../scenes/IScene';
import { IController } from './IController';

export class MainController implements IController {
  public static readonly KEY = Symbol();

  private _currentDifficulty: number = 1;
  private _currentReputation: number = 1;
  private _nextDifficulty: number = 1;
  private _nextReputation: number = 1;

  private _positiveCombo: number = 0;
  private _negativeCombo: number = 0;

  public preload(scene: IScene): void {}

  public create(scene: IScene): void {}

  public update(scene: IScene, delta: number): void {}

  public increment(client: Client): number {
    return client.satisfied
      ? this.incrementSuccess(client)
      : this.incrementFailure(client);
  }

  private incrementSuccess(client: Client): number {
    this._positiveCombo++;
    this._negativeCombo = 0;

    const amount = this.applyBonuses(client);
    // play success song

    if (this._positiveCombo % 3 == 0) {
      // play laught song
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

  private incrementFailure(client: Client): number {
    this._positiveCombo = 0;
    this._negativeCombo++;

    const amount = this.applyPenalties(client);
    // play failure song

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
