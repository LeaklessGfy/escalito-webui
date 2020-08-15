import { IScene } from '../../entities/game/IScene';
import { Sponsor } from '../../entities/static/Sponsor';
import { SponsorGo } from '../characters/SponsorGo';
import { SelectController } from '../controllers/SelectController';
import { SpriteKey } from '../sprites/SpriteKey';

export class SponsorBuilder {
  private readonly _scene: IScene;

  public sponsor!: Sponsor;
  public sprite!: Phaser.GameObjects.Sprite;

  public constructor(scene: IScene) {
    this._scene = scene;
  }

  public get spriteKey(): SpriteKey {
    return SpriteKey.Sponsor;
  }

  public build(sponsor: Sponsor): SponsorGo {
    this.sponsor = sponsor;
    this.buildSprite();

    return new SponsorGo(this);
  }

  private buildSprite() {
    const { x, y } = this._scene.settings.spawn;

    const sprite = this._scene.add.sprite(x, y, this.spriteKey);
    sprite
      .setScale(2)
      .setFlipX(true)
      .setY(y - sprite.displayHeight / 2)
      .setDepth(2)
      .setName(this.sponsor.name);

    const selectCtr = this._scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(this._scene, sprite);

    this.sprite = sprite;
  }
}
