import { Order } from '../../entities/static/Order';
import { Client } from '../characters/Client';
import { BarController } from '../controllers/BarController';
import { MainController } from '../controllers/MainController';
import { SelectController } from '../controllers/SelectControllers';
import { IScene } from '../scenes/IScene';
import { SpriteKey } from '../sprites/SpriteKey';
import { Producer } from '../utils/Interfaces';

export class ClientBuilder {
  private static readonly PATIENCE: number = 2000;
  private static readonly SATISFACTION_THRESHOLD: number = 20;
  private static readonly STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
    color: '#FFF',
    fontFamily: 'Arial Black',
    fontSize: '10px',
    backgroundColor: '#000',
    padding: {
      x: 5,
      y: 2
    }
  };

  private readonly _scene: IScene;

  public texture: SpriteKey = SpriteKey.DefaultClient;
  public patience: number = ClientBuilder.PATIENCE;
  public satisfactionThreshold: number = ClientBuilder.SATISFACTION_THRESHOLD;
  public cash: number = 5;

  constructor(scene: IScene) {
    this._scene = scene;
  }

  public get sprite(): Phaser.GameObjects.Sprite {
    const { x, y } = this._scene.settings.spawnPosition;

    const sprite = this._scene.physics.add.sprite(x, y, this.texture);
    sprite
      .setScale(2)
      .setY(sprite.y - 20)
      .setDepth(2)
      .setName('Client');

    const body = sprite.body as Phaser.Physics.Arcade.Body;
    body.collideWorldBounds = true;
    body.allowGravity = false;

    const selectCtr = this._scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(this._scene, sprite);

    return sprite;
  }

  public get waitingBox(): Phaser.GameObjects.Graphics {
    return this._scene.add.graphics().setDepth(2);
  }

  public get waitingBar(): Phaser.GameObjects.Graphics {
    return this._scene.add.graphics().setDepth(3);
  }

  public get orderText(): Phaser.GameObjects.Text {
    return this._scene.add
      .text(0, 0, '', ClientBuilder.STYLE)
      .setDepth(2)
      .setInteractive()
      .on('pointerdown', () => {});
  }

  public get createCollider(): Function {
    const scene = this._scene;

    return function(this: Client) {
      const barCtr = scene.getController<BarController>(BarController.KEY);

      if (barCtr.glass === undefined) {
        throw new Error('Glass is undefined');
      }

      const collider = scene.physics.add.collider(
        this._sprite,
        barCtr.glass.sprite,
        () => {
          this.serve(barCtr.glass);
          collider.destroy();
        }
      );
    };
  }

  public get increment(): Function {
    const scene = this._scene;

    return function(this: Client) {
      const mainCtr = scene.getController<MainController>(MainController.KEY);
      mainCtr.increment(this, this.order);
    };
  }

  public get createOrder(): Producer<Order | undefined> {
    const scene = this._scene;

    return function(this: Client) {
      const { cocktails } = scene.store.inventory;

      if (cocktails.length < 1) {
        return undefined;
      }

      const sum = cocktails.reduce((p, c) => p + c.hype, 0);
      const threshold = Math.floor(Math.random() * sum);

      let sub = 0;
      const cocktail = cocktails.find(cocktail => {
        sub += cocktail.hype;
        return sub >= threshold;
      });

      if (cocktail === undefined) {
        return undefined;
      }

      return new Order(cocktail);
    };
  }

  public build(): Client {
    return new Client(this);
  }
}
