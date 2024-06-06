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
  private doorOpen!: Sprite;
  private doorShadow!: Sprite;

  private handle!: Handle;

  constructor(rotationCallback: (direction: string) => void) {
    super();

    this.init(rotationCallback);

    this.interactive = true;
    this.closed = true;
  }

  init(rotationCallback: (direction: string) => void) {
    this.createDoor();

    this.handle = new Handle(rotationCallback);

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
    this.door.alpha = 0;
    this.handle.alpha = 0;
  }

  close() {
    this.door.alpha = 1;
    this.handle.alpha = 1;
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
