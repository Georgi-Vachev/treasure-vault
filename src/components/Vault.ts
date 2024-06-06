import { Container, Texture, Sprite } from "pixi.js";
import { gsap } from "gsap";
import { centerObjects } from "../utils/misc";
import { Config } from "../config";
import { Door } from "./Door";

const particlesConfig = Config.shineParticlesConfig;

export default class Vault extends Container {
  name = "Background";

  private vault!: Sprite;
  private door!: Door;
  private shineParticles: { sprite: Sprite; config: any }[] = [];

  constructor(rotationCallback: (direction: string) => void) {
    super();

    this.init(rotationCallback);

    centerObjects(this);
  }

  init(rotationCallback: (direction: string) => void) {
    this.createVault();
    this.createShineParticles();
    this.door = new Door(rotationCallback);

    this.addChild(this.vault, this.door);
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
