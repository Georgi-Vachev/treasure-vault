import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { Config } from "../config";

export class Handle extends PIXI.Sprite {
  private offsets: { x: number; y: number } = Config.handleOffsets;

  constructor(texture: PIXI.Texture) {
    super(texture);
    this.interactive = true;
    // this.buttonMode = true;

    this.position.set(
      window.innerWidth * this.offsets.x,
      window.innerWidth * this.offsets.y
    );

    this.width = window.innerWidth / 8.1;
    this.height = (window.innerWidth / 4) * (9 / 16);

    this.anchor.set(0.5);

    this.on("pointerdown", this.onPointerDown.bind(this));
  }

  onPointerDown() {
    this.turnHandle();
  }

  turnHandle() {
    gsap.to(this, { rotation: this.rotation + Math.PI / 2, duration: 1 }); // Adjust animation as needed
  }

  resize(width: number) {
    this.position.set(width * this.offsets.x, width * this.offsets.y);

    this.width = window.innerWidth / 8.1;
    this.height = (window.innerWidth / 4) * (9 / 16);
  }
}
