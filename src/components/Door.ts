import { Container, Texture, Sprite } from "pixi.js";
import { Config } from "../config";
import { Handle } from "./Handle";

const config = Config.doorConfig;

export class Door extends Container {
  private closedDoor!: Sprite;
  private openDoor!: Sprite;
  private doorShadow!: Sprite;

  private doorSprites: { sprite: Sprite; config: any }[] = [];

  private handle!: Handle;

  constructor(rotationCallback: (direction: string) => void) {
    super();

    this.init(rotationCallback);

    this.interactive = true;
  }

  init(rotationCallback: (direction: string) => void) {
    this.createClosedDoor();
    this.createOpenDoor();
    this.createDoorShadow();

    this.handle = new Handle(rotationCallback);

    this.resize(window.innerWidth);

    this.addChild(this.closedDoor, this.doorShadow, this.openDoor, this.handle);
  }

  createClosedDoor() {
    const sprite = new Sprite(Texture.from(Config.assets.closedDoor));

    sprite.anchor.set(0.5);

    this.closedDoor = sprite;
    this.doorSprites.push({ sprite, config: config.closedDoor });
  }

  createOpenDoor() {
    const sprite = new Sprite(Texture.from(Config.assets.openDoor));

    sprite.anchor.set(0.5);
    sprite.alpha = 0;
    sprite.name = "openDoor";

    this.openDoor = sprite;
    this.doorSprites.push({ sprite, config: config.openDoor });
  }

  createDoorShadow() {
    const sprite = new Sprite(Texture.from(Config.assets.doorShadow));

    sprite.anchor.set(0.5);
    sprite.alpha = 0;
    sprite.name = "doorShadow";

    this.doorShadow = sprite;
    this.doorSprites.push({ sprite, config: config.doorShadow });
  }

  open() {
    this.closedDoor.alpha = 0;
    this.handle.alpha = 0;
    this.openDoor.alpha = 1;
    this.doorShadow.alpha = 1;
  }

  close() {
    this.closedDoor.alpha = 1;
    this.handle.alpha = 1;
    this.openDoor.alpha = 0;
    this.doorShadow.alpha = 0;
  }

  resize(width: number) {
    this.positionDoors(width);
    this.scaleDoors();

    this.handle.resize(width);
  }

  positionDoors(width: number) {
    this.doorSprites.forEach((doorSprite: { sprite: Sprite; config: any }) => {
      doorSprite.sprite.position.set(
        width * doorSprite.config.offsetX,
        width * doorSprite.config.offsetY
      );
    });
  }

  scaleDoors() {
    this.doorSprites.forEach((doorSprite: { sprite: Sprite; config: any }) => {
      doorSprite.sprite.width =
        window.innerWidth / doorSprite.config.widthScaleFactor;
      doorSprite.sprite.height =
        (window.innerWidth / doorSprite.config.heightScaleFactor) * (9 / 16);
    });
  }
}
