import { Container, Texture, Sprite, Text, Ticker } from "pixi.js";
import { gsap } from "gsap";
import { centerObjects } from "../utils/misc";
import { Config } from "../config";
import { Door } from "./Door";

const particlesConfig = Config.shineParticlesConfig;
const counterConfig = Config.counterConfig;

export default class Vault extends Container {
  name = "Background";

  private vault!: Sprite;
  private door!: Door;
  private shineParticles: { sprite: Sprite; config: any }[] = [];
  private counterText!: Text;
  private counter!: number;
  private elapsed!: number;

  constructor(rotationCallback: (direction: string) => void) {
    super();

    this.counter = 0;
    this.elapsed = 0;

    this.init(rotationCallback);

    centerObjects(this);
  }

  init(rotationCallback: (direction: string) => void) {
    this.createVault();
    this.createShineParticles();
    this.createCounter();

    Ticker.shared.add(this.update, this);

    this.door = new Door(rotationCallback);

    this.addChild(this.vault, this.counterText, this.door);
  }

  createVault() {
    const sprite = new Sprite(Texture.from(Config.assets.vault));
    sprite.width = window.innerWidth;
    sprite.height = window.innerWidth * (9 / 16);

    sprite.anchor.set(0.5);

    this.vault = sprite;
  }

  createShineParticles() {
    const particleKeys = Object.keys(particlesConfig);

    for (let i = 0; i < particleKeys.length; i++) {
      const sprite = new Sprite(Texture.from(Config.assets.shineParticle));
      sprite.width = window.innerWidth;
      sprite.height = window.innerWidth * (9 / 16);

      sprite.anchor.set(0.5);

      this.shineParticles.push({
        sprite,
        config: (particlesConfig as any)[particleKeys[i]],
      });

      sprite.position.set(
        window.innerWidth * this.shineParticles[i].config.offsetX,
        window.innerWidth * this.shineParticles[i].config.offsetY
      );

      this.vault.addChild(sprite);
    }
  }

  createCounter() {
    this.counterText = new Text(this.counter.toString(), {
      fontFamily: "Arial",
      fontSize: 80,
      fill: 0xffffff, // White color
    });

    this.scaleAndPositionCounter(window.innerWidth);
  }

  update(delta: number) {
    this.elapsed += delta;

    if (this.elapsed >= 60) {
      this.incrementCounter();
      this.elapsed = 0;
    }
  }

  incrementCounter() {
    this.counter += 1;
    this.counterText.text = this.counter.toString();
  }

  open(resetGameCallback: () => void) {
    this.door.open();

    const tweens = [];

    const completionPromises = this.shineParticles.map(
      (particle: { sprite: Sprite; config: any }) => {
        return new Promise<void>((resolve) => {
          tweens.push(
            gsap.to(particle.sprite, {
              rotation: particle.sprite.rotation + Math.PI,
              duration: 5,
              onComplete: () => resolve(),
            })
          );
        });
      }
    );

    Promise.all(completionPromises).then(() => {
      this.door.close();
      this.resetGame();
      resetGameCallback();
    });
  }

  resetGame() {
    this.door.resetGame();
    this.counter = -1;
  }

  resize(width: number) {
    if (this.vault) {
      this.vault.width = width;
      this.vault.height = width * (9 / 16);

      this.scaleAndPositionCounter(width);

      this.door.resize(width);
    }

    centerObjects(this);
  }

  scaleAndPositionCounter(width: number) {
    this.counterText.width = width * counterConfig.widthScaleFactor;
    this.counterText.height =
      width * counterConfig.heightScaleFactor * (9 / 16);

    this.counterText.position.set(
      width * counterConfig.offsetX,
      width * counterConfig.offsetY
    );
  }
}
