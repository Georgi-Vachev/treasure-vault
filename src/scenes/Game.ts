import Vault from "../components/Vault";
import Scene from "../core/Scene";

export default class Game extends Scene {
  name = "Game";

  private vault!: Vault;
  private secretCombination!: { number: number; direction: string }[];
  private enteredDirections: string[] = [];

  load() {
    this.vault = new Vault(this.handleRotation.bind(this));
    this.addChild(this.vault);
  }

  start() {
    this.secretCombination = this.generateSecretCombination();

    console.log(
      this.secretCombination
        .map((pair) => `${pair.number} ${pair.direction}`)
        .join(", ")
    );
  }

  handleRotation(direction: string) {
    if (this.secretCombination[0]?.number) {
      this.secretCombination[0].number--;
    }

    const expectedDirection = this.secretCombination[0]?.direction;

    if (this.secretCombination[0].number === 0) {
      this.secretCombination.shift();
    }

    if (direction !== expectedDirection) {
      console.log("Resetting game");
      this.resetGame();
      return;
    }

    this.enteredDirections.push(direction);

    if (!this.secretCombination.length) {
      console.log("Vault opens");
      this.openVault();
    }
  }

  openVault() {
    this.vault.open();
  }

  resetGame() {
    this.start();
  }

  generateSecretCombination(): { number: number; direction: string }[] {
    const directions = ["clockwise", "counterclockwise"];

    const secretCombination: { number: number; direction: string }[] = [];

    for (let i = 0; i < 3; i++) {
      const randomNumber = Math.floor(Math.random() * 9) + 1;

      const randomDirection =
        directions[Math.floor(Math.random() * directions.length)];

      secretCombination.push({
        number: randomNumber,
        direction: randomDirection,
      });
    }

    return secretCombination;
  }

  onResize(width: number) {
    if (this.vault) {
      this.vault.resize(width);
    }
  }
}
