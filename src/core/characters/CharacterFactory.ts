import { SelectController } from '../controllers/SelectControllers';
import { IScene } from '../scenes/IScene';
import { SpriteKey } from '../sprites/SpriteKey';
import { Barmaid } from './Barmaid';
import { Client } from './Client';

export class CharacterFactory {
  public buildBarmaid(scene: IScene): Barmaid {
    const x = scene.settings.middle;
    const y = scene.settings.floor;

    const sprite = scene.add.sprite(x, y, SpriteKey.Barmaid);
    sprite
      .setScale(2)
      .setY(sprite.y - sprite.displayHeight / 2)
      .setFlipX(true);

    const barmaid = new Barmaid(scene, sprite, SpriteKey.Barmaid);

    const selectCtr = scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(scene, sprite);

    return barmaid;
  }

  public buildClient(scene: IScene): Client {
    const x = 100;
    const y = scene.settings.floor;

    const sprite = scene.add.sprite(x, y, SpriteKey.DefaultClient);
    sprite
      .setScale(2)
      .setY(sprite.y - 20)
      .setDepth(2);

    const client = new Client(scene, sprite, SpriteKey.DefaultClient);

    const selectCtr = scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(scene, sprite);

    return client;
  }
}
