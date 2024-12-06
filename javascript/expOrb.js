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
    this.lifetime = 600; // Lifetime in frames (10 seconds at 60 FPS)
    this.isVisible = true; // Flashing visibility toggle
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

    // Flashing effect for the last 3 seconds (180 frames)
    if (this.lifetime <= 180) {
      this.isVisible = frameCount % 20 < 10; // Toggle visibility every 10 frames
    } else {
      this.isVisible = true; // Always visible before the last 3 seconds
    }

    if (this.isVisible) {
      push();
      noStroke();
      fill(r, g, b); // Dynamic color
      ellipse(this.xPos, this.yPos, this.size * 0.8); // Smaller size
      pop();
    }

    this.lifetime--; // Decrease lifetime
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

  isExpired() {
    return this.lifetime <= 0; // Check if orb's lifetime has ended
  }
}

let expOrbs = [];
