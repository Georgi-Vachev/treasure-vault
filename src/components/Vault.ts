import { Container, Texture, Sprite } from "pixi.js";
import { centerObjects } from "../utils/misc";
import { Config } from "../config";
import { Door } from "./Door";

export default class Vault extends Container {
  name = "Background";

  private vault!: Sprite;
  private door!: Door;

  constructor(rotationCallback: (direction: string) => void) {
    super();

    this.init(rotationCallback);

    centerObjects(this);
  }

  init(rotationCallback: (direction: string) => void) {
    this.createVault(new Sprite(Texture.from(Config.assets.vault)));
    this.door = new Door(rotationCallback);

    this.addChild(this.vault, this.door);
  }

  createVault(sprite: Sprite) {
    sprite.width = window.innerWidth;
    sprite.height = window.innerWidth * (9 / 16);

    sprite.anchor.set(0.5);

    this.vault = sprite;
  }

  open() {
    this.door.open();
  }

  resize(width: number) {
    if (this.vault) {
      this.vault.width = width;
      this.vault.height = width * (9 / 16);

      this.door.resize(width);
    }

    centerObjects(this);
  }
}
