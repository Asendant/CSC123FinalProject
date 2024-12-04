class ExpOrb {
  constructor(x, y, targetX, targetY, size, expAmount) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.size = size;
    this.expAmount = expAmount;
    this.animationProgress = 0;
    this.animationSpeed = 0.05;
  }

  draw() {
    fill(this.getColor());
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  move() {
    if (this.animationProgress < 1) {
      this.x = lerp(this.startX, this.targetX, this.animationProgress);
      this.y = lerp(this.startY, this.targetY, this.animationProgress);
      this.animationProgress += this.animationSpeed;
    } else {
      this.y += Math.sin(frameCount / 20) * 0.5; // Floating effect
    }
  }

  getColor() {
    const freq = 0.1;
    const r = Math.sin(freq * frameCount + 0) * 127 + 128;
    const g = Math.sin(freq * frameCount + 2) * 127 + 128;
    const b = Math.sin(freq * frameCount + 4) * 127 + 128;
    return color(r, g, b);
  }

  checkCollision(player) {
    return (
      dist(this.x, this.y, player.xPos, player.yPos) <
      this.size / 2 + 5 + (player.sizeX / 2 + 5)
    );
  }
}

let expOrbs = [];
