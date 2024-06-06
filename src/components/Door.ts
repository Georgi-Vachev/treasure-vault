import { Container, Texture, Sprite } from "pixi.js";
import { gsap } from "gsap";
import { Config } from "../config";
import { Handle } from "./Handle";

export class Door extends Container {
  closed: boolean;

  private offsets: { x: number; y: number } = Config.doorOffsets;

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
    this.createDoor(new Sprite(Texture.from(Config.assets.door)));
    this.handle = new Handle(Texture.from(Config.assets.handle));

    this.addChild(this.door, this.handle);
  }

  createDoor(sprite: Sprite) {
    sprite.position.set(
      window.innerWidth * this.offsets.x,
      window.innerWidth * this.offsets.y
    );

    sprite.width = window.innerWidth / 2.8;
    sprite.height = (window.innerWidth / 1.65) * (9 / 16);

    sprite.anchor.set(0.5);

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
      this.door.position.set(width * this.offsets.x, width * this.offsets.y);

      this.door.width = window.innerWidth / 2.8;
      this.door.height = (window.innerWidth / 1.65) * (9 / 16);

      this.handle.resize(width);
    }
  }
}
