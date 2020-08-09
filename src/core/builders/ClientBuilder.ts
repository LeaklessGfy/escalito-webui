import { Order } from '../../entities/static/Order';
import { Client } from '../characters/Client';
import { BarController } from '../controllers/BarController';
import { MainController } from '../controllers/MainController';
import { SelectController } from '../controllers/SelectControllers';
import { IScene } from '../scenes/IScene';
import { Bar } from '../sprites/Bar';
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

  private _spriteKey: SpriteKey = SpriteKey.DefaultClient;
  private _sprite?: Phaser.GameObjects.Sprite;
  private _waitingBar?: Bar;

  private _orderText?: Phaser.GameObjects.Text;
  private _createCollider?: Function;
  private _createOrder?: Producer<Order | undefined>;
  private _increment?: Function;

  private _patience: number = ClientBuilder.PATIENCE;
  private _satisfactionThreshold: number = ClientBuilder.SATISFACTION_THRESHOLD;
  private _cash: number = 5;

  constructor(scene: IScene) {
    this._scene = scene;
  }

  public get spriteKey(): SpriteKey {
    return this._spriteKey;
  }

  public get sprite(): Phaser.GameObjects.Sprite {
    if (this._sprite === undefined) {
      throw new Error('Can not access sprite on un-build builder');
    }
    return this._sprite;
  }

  public get waitingBar(): Bar {
    if (this._waitingBar === undefined) {
      throw new Error('Can not access waiting bar on un-build builder');
    }
    return this._waitingBar;
  }

  public get orderText(): Phaser.GameObjects.Text {
    if (this._orderText === undefined) {
      throw new Error('Can not access order text on un-build builder');
    }
    return this._orderText;
  }

  public get createCollider(): Function {
    if (this._createCollider === undefined) {
      throw new Error('Can not access create collider on un-build builder');
    }
    return this._createCollider;
  }

  public get createOrder(): Producer<Order | undefined> {
    if (this._createOrder === undefined) {
      throw new Error('Can not access create order on un-build builder');
    }
    return this._createOrder;
  }

  public get increment(): Function {
    if (this._increment === undefined) {
      throw new Error('Can not access increment on un-build builder');
    }
    return this._increment;
  }

  public get patience(): number {
    return this._patience;
  }

  public get satisfactionThreshold(): number {
    return this._satisfactionThreshold;
  }

  public get cash(): number {
    return this._cash;
  }

  public build(): Client {
    this.buildSprite();
    this.buildWaitingBar();
    this.buildOrderText();
    this.buildCreateCollider();
    this.buildCreateOrder();
    this.buildIncrement();

    return new Client(this);
  }

  private buildSprite() {
    const { x, y } = this._scene.settings.spawnPosition;

    const sprite = this._scene.physics.add.sprite(x, y, this._spriteKey);
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

    this._sprite = sprite;
  }

  private buildWaitingBar() {
    const background = this._scene.add.graphics().setDepth(2);
    const foreground = this._scene.add.graphics().setDepth(3);

    this._waitingBar = new Bar(background, foreground);
  }

  private buildOrderText() {
    const text = this._scene.add
      .text(0, 0, '', ClientBuilder.STYLE)
      .setDepth(2)
      .setInteractive();

    const selectCtr = this._scene.getController<SelectController>(
      SelectController.KEY
    );
    selectCtr.addSelect(this._scene, text);

    this._orderText = text;
  }

  private buildCreateCollider() {
    const scene = this._scene;

    this._createCollider = function(this: Client) {
      const barCtr = scene.getController<BarController>(BarController.KEY);

      if (barCtr.glass === undefined) {
        throw new Error('Glass is undefined');
      }

      const collider = scene.physics.add.collider(
        this._sprite,
        barCtr.glass.sprite,
        () => {
          this.serve(barCtr.glass);
          barCtr.destroyGlass();
          collider.destroy();
        }
      );
    };
  }

  private buildCreateOrder() {
    const scene = this._scene;

    this._createOrder = function(this: Client) {
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

      scene
        .getController<BarController>(BarController.KEY)
        .createGlass(scene, cocktail.base.glassKey);

      return new Order(cocktail);
    };
  }

  private buildIncrement() {
    const scene = this._scene;

    this._increment = function(this: Client) {
      const mainCtr = scene.getController<MainController>(MainController.KEY);
      mainCtr.increment(this, this.order);
    };
  }
}
