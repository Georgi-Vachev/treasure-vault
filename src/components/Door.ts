import { Container, Texture, Sprite } from "pixi.js";
import { gsap } from "gsap";
import { Config } from "../config";
import { Handle } from "./Handle";

export class Door extends Container {
  closed: boolean;

  private config: {
    offsetX: number;
    offsetY: number;
    widthScaleFactor: number;
    heightScaleFactor: number;
  } = Config.doorConfig;

  private door!: Sprite;
  private handle!: Handle;

  constructor() {
    super();

    this.init();

    this.interactive = true;
    this.closed = true;

    // Add any event listeners or additional properties here
  }

  init() {
    this.createDoor();

    this.handle = new Handle();

    this.addChild(this.door, this.handle);
  }

  createDoor() {
    const sprite = new Sprite(Texture.from(Config.assets.door));

    sprite.position.set(
      window.innerWidth * this.config.offsetX,
      window.innerWidth * this.config.offsetY
    );

    sprite.anchor.set(0.5);

    this.scaleSprite(sprite);

    this.door = sprite;
  }

  open() {
    if (this.closed) {
      gsap.to(this, { x: this.x + 100, duration: 1 }); // Adjust animation as needed
      this.closed = false;
    }
  }

  close() {
    if (!this.closed) {
      gsap.to(this, { x: this.x - 100, duration: 1 }); // Adjust animation as needed
      this.closed = true;
    }
  }

  resize(width: number) {
    if (this.door) {
      this.door.position.set(
        width * this.config.offsetX,
        width * this.config.offsetY
      );

      this.scaleSprite(this.door);

      this.handle.resize(width);
    }
  }

  scaleSprite(sprite: Sprite) {
    sprite.width = window.innerWidth / this.config.widthScaleFactor;
    sprite.height =
      (window.innerWidth / this.config.heightScaleFactor) * (9 / 16);
  }
}
