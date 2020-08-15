import { IScene } from '../../entities/game/IScene';
import { Client, ClientKey } from '../../entities/static/Client';
import { Order } from '../../entities/static/Order';
import { ClientGo } from '../characters/ClientGo';
import { BarController } from '../controllers/BarController';
import { MainController } from '../controllers/MainController';
import { SelectController } from '../controllers/SelectController';
import { Bar } from '../sprites/Bar';
import { SpriteKey } from '../sprites/SpriteKey';
import { Style } from '../sprites/Style';
import { Producer } from '../utils/Interfaces';

export class ClientBuilder {
  private static readonly ORDER_STYLE: Style = {
    color: '#FFF',
    fontFamily: 'Arial Black',
    fontSize: '10px',
    backgroundColor: '#000',
    padding: {
      x: 5,
      y: 2
    }
  };

  private static readonly CASH_STYLE: Style = {
    color: '#FF00FF',
    fontFamily: 'Arial Black',
    fontSize: '15px'
  };

  private readonly _scene: IScene;

  public client!: Client;
  public sprite!: Phaser.GameObjects.Sprite;
  public waitingBar!: Bar;

  public orderText!: Phaser.GameObjects.Text;
  public cashText!: Phaser.GameObjects.Text;
  public createCollider!: Function;
  public createOrder!: Producer<Order | undefined>;
  public increment!: () => number;

  public constructor(scene: IScene) {
    this._scene = scene;
  }

  public get spriteKey(): SpriteKey {
    switch (this.client.key) {
      case ClientKey.Default:
        return SpriteKey.ClientDefault;
    }
  }

  public build(client: Client): ClientGo {
    this.client = client;
    this.buildSprite();
    this.buildWaitingBar();
    this.buildOrderText();
    this.buildCreateCollider();
    this.buildCreateOrder();
    this.buildIncrement();

    return new ClientGo(this);
  }

  private buildSprite() {
    const { x, y } = this._scene.settings.spawn;

    const sprite = this._scene.physics.add.sprite(x, y, this.spriteKey);
    sprite
      .setScale(2)
      .setY(sprite.y - sprite.displayHeight / 2)
      .setDepth(2)
      .setName(this.client.name);

    const body = sprite.body as Phaser.Physics.Arcade.Body;
    body.collideWorldBounds = true;
    body.allowGravity = false;

    const selectCtr = this._scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(this._scene, sprite);

    this.sprite = sprite;
  }

  private buildWaitingBar() {
    const background = this._scene.add.graphics().setDepth(2);
    const foreground = this._scene.add.graphics().setDepth(3);

    this.waitingBar = new Bar(background, foreground);
  }

  private buildOrderText() {
    const orderText = this._scene.add
      .text(0, 0, '', ClientBuilder.ORDER_STYLE)
      .setDepth(2);

    const cashText = this._scene.add
      .text(0, 0, '', ClientBuilder.CASH_STYLE)
      .setDepth(5);

    this.orderText = orderText;
    this.cashText = cashText;
  }

  private buildCreateCollider() {
    const scene = this._scene;
    const barCtr = scene.getController<BarController>(BarController.KEY);

    this.createCollider = function(this: ClientGo) {
      if (barCtr.glass === undefined) {
        throw new Error('Glass is undefined');
      }

      barCtr.glass.addCollider(scene, this._sprite, true, () => {
        this.serve(barCtr.glass);
        barCtr.destroyGlass();
      });
    };
  }

  private buildCreateOrder() {
    const scene = this._scene;
    const barCtr = scene.getController<BarController>(BarController.KEY);

    this.createOrder = function(this: ClientGo) {
      const { cocktails } = scene.inventory.current;

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

      barCtr.createGlass(scene, cocktail.base.glassKey);

      return new Order(cocktail);
    };
  }

  private buildIncrement() {
    const scene = this._scene;
    const mainCtr = scene.getController<MainController>(MainController.KEY);

    this.increment = function(this: ClientGo) {
      return mainCtr.increment(this);
    };
  }
}
