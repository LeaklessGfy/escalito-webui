export class TintHelper {
  private static readonly HIGH = 100;
  private static readonly MEDIUM = 70;
  private static readonly LOW = 40;

  public static getTint(satisfaction: number): number {
    if (satisfaction < TintHelper.LOW) {
      return 0xff0000;
    }
    if (satisfaction < TintHelper.MEDIUM) {
      return 0x00ffff;
    }
    return 0x00ff00;
  }
}
