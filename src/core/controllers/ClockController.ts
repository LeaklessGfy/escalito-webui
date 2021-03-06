import { IController } from '../../entities/game/IController';
import { IScene } from '../../entities/game/IScene';
import { TriggerUnit } from '../../entities/static/TimeTrigger';
import { Style } from '../sprites/Style';
import { ITimeAction } from '../times/ITimeAction';
import { TimeManager } from '../times/TimeManager';

export class ClockController implements IController {
  public static readonly KEY = Symbol();

  private static readonly MS_MULTIPLIER = 60;
  private static readonly TO_SECONDS = 1000;
  private static readonly TO_MINUTES = ClockController.TO_SECONDS * 60;
  private static readonly TO_HOURS = ClockController.TO_MINUTES * 60;
  private static readonly TO_DAYS = ClockController.TO_HOURS * 24;
  private static readonly STYLE: Style = {
    color: '#FFFFFF',
    fontFamily: 'Arial Black',
    fontSize: '15px',
    padding: {
      x: 15,
      y: 10
    }
  };

  private readonly _timeManager: TimeManager;

  private _clock!: Phaser.GameObjects.Text;
  private _time: number = 0;

  constructor() {
    this._timeManager = new TimeManager();
  }

  /** Interface **/
  public preload(scene: IScene): void {}

  public create(scene: IScene): void {
    const x = scene.settings.width;

    this._clock = scene.add.text(x, 0, '00:00', ClockController.STYLE);
    this._clock.setX(x - this._clock.displayWidth);
  }

  public update(scene: IScene, delta: number): void {
    this._time += delta * ClockController.MS_MULTIPLIER;

    const text =
      ClockController.format(this.hours) +
      ':' +
      ClockController.format(this.minutes);

    this._clock.setText(text);

    // or time ?
    this._timeManager.update(delta);
  }

  public rescale(): void {}

  /** Custom **/
  public addAction(action: ITimeAction): void {
    this._timeManager.add(action);
  }

  public removeAction(action: ITimeAction): void {
    this._timeManager.remove(action);
  }

  public get seconds(): number {
    return Math.floor((this._time / ClockController.TO_SECONDS) % 60);
  }

  public get minutes(): number {
    return Math.floor((this._time / ClockController.TO_MINUTES) % 60);
  }

  public get hours(): number {
    return Math.floor((this._time / ClockController.TO_HOURS) % 24);
  }

  public get day() {
    return Math.floor(this._time / ClockController.TO_DAYS);
  }

  private static format(n: number): string {
    return n.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
  }

  public static computeOverflow(
    triggerTime: number,
    triggerUnit: TriggerUnit
  ): number {
    switch (triggerUnit) {
      case TriggerUnit.Week:
        return triggerTime * this.TO_DAYS * 7;
      case TriggerUnit.Day:
        return triggerTime * this.TO_HOURS;
      case TriggerUnit.Hour:
        return triggerTime * this.TO_MINUTES;
      case TriggerUnit.Minute:
        return triggerTime * this.TO_SECONDS;
      case TriggerUnit.Second:
      case TriggerUnit.Real:
        return triggerTime;
      case TriggerUnit.MilliSecond:
        return triggerTime / this.MS_MULTIPLIER;
    }
  }
}
