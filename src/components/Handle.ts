import { Container, Sprite, Texture } from "pixi.js";
import { gsap } from "gsap";
import { Config } from "../config";

export class Handle extends Container {
  private config: {
    offsetX: number;
    offsetY: number;
    widthScaleFactor: number;
    heightScaleFactor: number;
  } = Config.handleConfig;

  private rotationCallback!: (direction: string) => void;
  private isAnimating = false;
  private handle!: Sprite;
  private handleShadow!: Sprite;

  constructor(rotationCallback: (direction: string) => void) {
    super();

    this.rotationCallback = rotationCallback;

    this.handle = new Sprite(Texture.from(Config.assets.handle));
    this.handleShadow = new Sprite(Texture.from(Config.assets.handleShadow));

    this.handle.interactive = true;

    this.handleShadow.anchor.set(0.5);
    this.handle.anchor.set(0.5);

    this.handle.position.set(
      window.innerWidth * this.config.offsetX,
      window.innerWidth * this.config.offsetY
    );

    this.scaleSprite(this.handleShadow);
    this.scaleSprite(this.handle);

    this.addChild(this.handleShadow, this.handle);

    this.handle.on("pointerdown", this.onPointerDown.bind(this));
  }

  onPointerDown(event: { data: { global: { x: number } } }) {
    if (!this.isAnimating) {
      const mouseX = event.data.global.x;
      const windowWidth = window.innerWidth;

      const isMouseLeft = mouseX < windowWidth / 2;

      if (isMouseLeft) {
        this.rotateHandle(-Math.PI / 3);
      } else {
        this.rotateHandle(Math.PI / 3);
      }
    }
  }

  rotateHandle(angle: number) {
    this.isAnimating = true;

    gsap.to([this.handle, this.handleShadow], {
      rotation: this.handle.rotation + angle,
      duration: 0.5,
      onComplete: () => {
        this.isAnimating = false;
        this.rotationCallback(angle < 0 ? "counterclockwise" : "clockwise");
      },
    });
  }

  turboSpinHandle() {
    this.isAnimating = true;

    gsap.to([this.handle, this.handleShadow], {
      rotation: this.handle.rotation + Math.PI * 10,
      duration: 0.7,
      onComplete: () => {
        this.isAnimating = false;
      },
    });
  }

  resize(width: number) {
    this.handle.position.set(
      width * this.config.offsetX,
      width * this.config.offsetY
    );

    this.scaleSprite(this.handle);
    this.scaleSprite(this.handleShadow);
  }

  scaleSprite(sprite: Sprite) {
    sprite.width = window.innerWidth / this.config.widthScaleFactor;
    sprite.height =
      (window.innerWidth / this.config.heightScaleFactor) * (9 / 16);
  }
}
