import { TriggerUnit } from '../../entities/TimeTrigger';
import { IScene } from '../scenes/IScene';
import { IController } from './IController';

export class ClockController implements IController {
  public static readonly KEY = Symbol();

  private static readonly MS_MULTIPLIER = 60;
  private static readonly TO_SECONDS = 1000;
  private static readonly TO_MINUTES = ClockController.TO_SECONDS * 60;
  private static readonly TO_HOURS = ClockController.TO_MINUTES * 60;
  private static readonly TO_DAYS = ClockController.TO_HOURS * 24;

  private static readonly STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
    color: '#00FF00',
    fontFamily: 'Arial Black',
    fontSize: '20px',
    fontStyle: 'bold',
    backgroundColor: '#FFFFFF',
    padding: {
      x: 50,
      y: 10
    }
  };

  private _time: number = 0;
  private _clock?: Phaser.GameObjects.Text;

  public preload(scene: IScene): void {}

  public create(scene: IScene): void {
    this._clock = scene.add.text(0, 0, '00:00', ClockController.STYLE);
    /*.setOrigin(0, 1)
      .setInteractive({ useHandCursor: true });*/
  }

  public update(scene: IScene, delta: number): void {
    this._time += delta * ClockController.MS_MULTIPLIER;

    //const seconds = Math.floor((this._time / ClockController.TO_SECONDS) % 60);
    const minutes = Math.floor((this._time / ClockController.TO_MINUTES) % 60);
    const hours = Math.floor((this._time / ClockController.TO_HOURS) % 24);
    //const days = Math.floor(this._time / ClockController.TO_DAYS);

    const text =
      ClockController.format(hours) + ':' + ClockController.format(minutes);

    this._clock?.setText(text);
  }

  public static format(n: number): string {
    return n.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
  }

  public static computeOverflow(triggerTime: number, triggerUnit: TriggerUnit) {
    switch (triggerUnit) {
      case TriggerUnit.Week:
        return triggerTime * this.TO_DAYS * 7;
      case TriggerUnit.Day:
        return triggerTime * this.TO_DAYS;
      case TriggerUnit.Hour:
        return triggerTime * this.TO_HOURS;
      case TriggerUnit.Minute:
        return triggerTime * this.TO_MINUTES;
      case TriggerUnit.Second:
        return triggerTime * this.TO_SECONDS;
      case TriggerUnit.MilliSecond:
        return triggerTime;
    }
  }
}
