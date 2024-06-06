import { Container, Texture, Sprite } from "pixi.js";
import { centerObjects } from "../utils/misc";
import { Config } from "../config";
import { Door } from "./Door";

export default class Vault extends Container {
  name = "Background";

  private vault!: Sprite;
  private door!: Door;

  constructor() {
    super();

    this.init();

    centerObjects(this);
  }

  init() {
    this.createVault(new Sprite(Texture.from(Config.assets.vault)));
    this.door = new Door();

    this.addChild(this.vault, this.door);
  }

  createVault(sprite: Sprite) {
    sprite.width = window.innerWidth;
    sprite.height = window.innerWidth * (9 / 16);

    sprite.anchor.set(0.5);

    this.vault = sprite;
  }

  // initPlayerMovement(object: {
  //   state: { velocity: { x: number; y: number } };
  // }) {
  //   Ticker.shared.add((delta) => {
  //     const x = object.state.velocity.x * delta;
  //     const y = object.state.velocity.y * delta;

  //     this.updatePosition(x, y);
  //   });
  // }

  // updatePosition(x: number, y: number) {
  //   for (const [index, child] of this.children.entries()) {
  //     if (child instanceof TilingSprite) {
  //       child.tilePosition.x -= x * index * this.config.panSpeed;
  //       child.tilePosition.y -= y * index * this.config.panSpeed;
  //     } else {
  //       child.x -= x * index * this.config.panSpeed;
  //       child.y -= y * index * this.config.panSpeed;
  //     }
  //   }
  // }

  resize(width: number) {
    if (this.vault) {
      this.vault.width = width;
      this.vault.height = width * (9 / 16);

      this.door.resize(width);
    }

    centerObjects(this);
  }
}
