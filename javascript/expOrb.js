class ExpOrb {
  constructor(x, y, targetX, targetY, size, expAmount) {
    this.startX = x; // Start position (enemy's position)
    this.startY = y;
    this.x = x; // Current position
    this.y = y;
    this.targetX = targetX; // Target position
    this.targetY = targetY;
    this.size = size;
    this.expAmount = expAmount; // Amount of EXP the orb gives
    this.color = this.getColor(); // Initial color for gradient effect
    this.collected = false;
    this.animationProgress = 0; // Progress of the spawn animation
    this.animationSpeed = 0.05; // Speed of the animation
    this.colorOffset = 0; // For the rainbow effect
  }

  draw() {
    this.color = this.getColor(); // Update color for gradient effect
    push();
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
    pop();
  }

  move() {
    if (this.animationProgress < 1) {
      // Animate the orb from start position to target position
      this.x = lerp(this.startX, this.targetX, this.animationProgress);
      this.y = lerp(this.startY, this.targetY, this.animationProgress);
      this.animationProgress += this.animationSpeed;
    } else {
      // Optional: Add a small "float" effect for static orbs
      this.y += Math.sin(frameCount / 20) * 0.5;
    }
  }

  getColor() {
    // Generate a rainbow gradient effect based on frame count
    const freq = 0.1;
    const r = Math.sin(freq * (frameCount + this.colorOffset)) * 127 + 128;
    const g = Math.sin(freq * (frameCount + this.colorOffset) + 2) * 127 + 128;
    const b = Math.sin(freq * (frameCount + this.colorOffset) + 4) * 127 + 128;
    return color(r, g, b);
  }

  checkCollision(player) {
    return (
      dist(this.x, this.y, player.xPos, player.yPos) <
      this.size / 2 + player.sizeX / 2
    );
  }
}

let expOrbs = [];
