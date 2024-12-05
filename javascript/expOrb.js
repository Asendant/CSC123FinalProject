class ExpOrb {
  constructor(startX, startY, endX, endY, size, expAmount) {
    this.xPos = startX;
    this.yPos = startY;
    this.endX = endX;
    this.endY = endY;
    this.size = size; // Orb size (reduced)
    this.expAmount = expAmount;
    this.colorOffset = random(0, TWO_PI); // Randomized starting point for color animation
    this.localFrame = 0; // Independent frame counter for this orb
  }

  move() {
    this.xPos += (this.endX - this.xPos) * 0.05;
    this.yPos += (this.endY - this.yPos) * 0.05;
  }

  draw() {
    this.localFrame++; // Increment local frame counter for this orb
    const animationSpeed = 0.05; // Adjust animation speed

    // Animate color using sin and cos
    const r = map(
      sin(this.localFrame * animationSpeed + this.colorOffset),
      -1,
      1,
      100,
      255
    );
    const g = map(
      sin(this.localFrame * animationSpeed + this.colorOffset + TWO_PI / 3),
      -1,
      1,
      100,
      255
    );
    const b = map(
      sin(
        this.localFrame * animationSpeed + this.colorOffset + (2 * TWO_PI) / 3
      ),
      -1,
      1,
      100,
      255
    );

    push();
    noStroke();
    fill(r, g, b); // Dynamic color
    ellipse(this.xPos, this.yPos, this.size * 0.8); // Smaller size
    pop();
  }

  checkCollision(player) {
    const distance = dist(
      this.xPos,
      this.yPos,
      player.xPos + player.sizeX / 2,
      player.yPos + player.sizeY / 2
    );
    return distance < this.size / 2 + 5 + (player.sizeX / 2 + 5);
  }
}

let expOrbs = [];
