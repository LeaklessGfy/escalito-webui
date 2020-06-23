import { SelectController } from '../controllers/SelectControllers';
import { IScene } from '../scenes/IScene';
import { CharacterKey } from './AbstractCharacter';
import { Barmaid } from './Barmaid';
import { Client } from './Client';

export class CharacterFactory {
  public buildBarmaid(scene: IScene): Barmaid {
    const x = scene.settings.middle;
    const y = scene.settings.floor;

    const sprite = scene.add.sprite(x, y, CharacterKey.Barmaid);
    sprite
      .setScale(2)
      .setY(sprite.y - sprite.displayHeight / 2)
      .setFlipX(true);

    const barmaid = new Barmaid(scene, sprite, CharacterKey.Barmaid);

    const selectController: SelectController = scene.getController(
      SelectController.KEY
    );
    selectController.addSelect(scene, sprite);

    return barmaid;
  }

  public buildClient(scene: IScene): Client {
    const x = 100;
    const y = scene.settings.floor;

    const sprite = scene.add.sprite(x, y, CharacterKey.Client1);
    sprite
      .setScale(2)
      .setY(sprite.y - 20)
      .setDepth(2);

    const client = new Client(scene, sprite, CharacterKey.Client1);

    const selectController: SelectController = scene.getController(
      SelectController.KEY
    );
    selectController.addSelect(scene, sprite);

    return client;
  }
}
