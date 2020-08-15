import { IController } from '../../entities/game/IController';
import { IInventory } from '../../entities/game/IInventory';
import { IScene } from '../../entities/game/IScene';
import { ClientGo } from '../characters/ClientGo';
import { Style } from '../sprites/Style';
import { AudioController } from './AudioController';

export class MainController implements IController {
  public static readonly KEY = Symbol();

  private _audioCtr!: AudioController;
  private _inventory!: IInventory;
  private _gameOver!: Phaser.GameObjects.Text;

  private _currentDifficulty: number = 1;
  private _currentReputation: number = 1;
  private _nextDifficulty: number = 1;
  private _nextReputation: number = 1;

  private _positiveCombo: number = 0;
  private _negativeCombo: number = 0;
  private _succeedOrders: number = 0;
  private _failedOrders: number = 0;

  /** Interface **/
  public preload(scene: IScene): void {
    this._audioCtr = scene.getController<AudioController>(AudioController.KEY);
    this._inventory = scene.inventory;
  }

  public create(scene: IScene): void {
    const mid = scene.settings.middleDimension;

    this._gameOver = scene.add.text(mid.x, mid.y, 'Game Over', {
      fontSize: '20px',
      fontFamily: 'Arial Black',
      color: '#FF0000',
      backgroundColor: '#000',
      padding: {
        x: 5,
        y: 5
      }
    } as Style);
    this._gameOver.setVisible(false);
  }

  public update(scene: IScene, delta: number): void {
    if (this._inventory.current.cash <= 0) {
      this._gameOver.setVisible(true);
      // Stop the game
    }
  }

  public rescale(): void {}

  /** Custom **/
  public increment(client: ClientGo): number {
    return client.satisfied
      ? this.incrementSuccess(client)
      : this.incrementFailure(client);
  }

  private incrementSuccess(client: ClientGo): number {
    this._positiveCombo++;
    this._negativeCombo = 0;
    this._succeedOrders++;

    const amount = this.applyBonuses(client);
    this._audioCtr.playSuccess();

    if (this._positiveCombo % 3 === 0) {
      this._audioCtr.playLaught();
    }

    if (this._positiveCombo % 10 === 0) {
      this._nextDifficulty++;
    }

    if (this._positiveCombo % 20 === 0) {
      this._nextReputation++;
    }

    this._inventory.current.cash += amount;

    return amount;
  }

  private incrementFailure(client: ClientGo): number {
    this._positiveCombo = 0;
    this._negativeCombo++;
    this._failedOrders++;

    const amount = this.applyPenalties(client);
    this._audioCtr.playFailue();

    if (this._negativeCombo % 10 === 0) {
      this._nextReputation--;
    }

    this._inventory.current.cash -= amount;

    /*
    lost sponsors
    */

    return amount;
  }

  private applyBonuses(client: ClientGo): number {
    let amount = client.order.price;

    if (this._positiveCombo % 3 === 0) {
      amount += amount * 0.3;
    }

    return amount;
  }

  private applyPenalties(client: ClientGo): number {
    return 0;
  }
}
