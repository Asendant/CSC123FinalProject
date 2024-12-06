class SupplyDrop {
  constructor(x, y, size, healthRestoreAmount) {
    this.xPos = x;
    this.yPos = y;
    this.size = size * 0.8; // Slightly smaller size
    this.healthRestoreAmount = healthRestoreAmount;
    this.colorOffset = random(0, TWO_PI); // Random starting point for color animation
    this.spawnTime = millis(); // Record the time the drop was created
    this.lifetime = 12000; // Lifetime in milliseconds (7 seconds)
  }

  draw() {
    const elapsed = millis() - this.spawnTime; // Time since spawn
    const remaining = this.lifetime - elapsed; // Remaining time

    // Self-destruct if lifetime is exceeded
    if (remaining <= 0) {
      supplyDrops.splice(supplyDrops.indexOf(this), 1);
      return;
    }

    // Calculate animation speed based on remaining time
    const baseSpeed = 0.001; // Starting animation speed
    const maxSpeed = 0.008; // Maximum animation speed as time runs out
    const animationSpeed = map(
      remaining,
      0,
      this.lifetime,
      maxSpeed,
      baseSpeed
    );

    // Animate color using sin and cos
    const r = map(
      sin(elapsed * animationSpeed + this.colorOffset),
      -1,
      1,
      100,
      255
    );
    const g = map(
      sin(elapsed * animationSpeed + this.colorOffset + TWO_PI / 3),
      -1,
      1,
      100,
      255
    );
    const b = map(
      sin(elapsed * animationSpeed + this.colorOffset + (2 * TWO_PI) / 3),
      -1,
      1,
      100,
      255
    );

    push();
    // Radial gradient
    noStroke();
    for (let radius = this.size; radius > 0; radius--) {
      const alpha = map(radius, 0, this.size, 255, 0); // Gradient transparency
      fill(r, g, b, alpha);
      ellipse(this.xPos, this.yPos, radius * 2);
    }

    // Draw outer stroke
    stroke(255); // White stroke
    strokeWeight(3);
    noFill();
    ellipse(this.xPos, this.yPos, this.size * 2 + 6); // Slightly larger than the drop

    // Draw the cross in the center
    strokeWeight(3);
    line(
      this.xPos - this.size / 3,
      this.yPos,
      this.xPos + this.size / 3,
      this.yPos
    ); // Horizontal
    line(
      this.xPos,
      this.yPos - this.size / 3,
      this.xPos,
      this.yPos + this.size / 3
    ); // Vertical
    pop();
  }

  restoreHealth(player) {
    player.health = Math.min(
      player.maxHealth,
      player.health + this.healthRestoreAmount
    );
  }
}

let supplyDrops = []; // Array to store supply drops
let lastSupplyDropTime = 0;

function spawnSupplyDrop() {
  const x = random(50, WIDTH - 50); // Random position within canvas
  const y = random(50, HEIGHT - 50);
  const size = 20; // Size of the supply drop
  const healthRestoreAmount = 50; // Amount of health restored

  supplyDrops.push(new SupplyDrop(x, y, size, healthRestoreAmount));
}

function handleSupplyDrops() {
  const currentTime = millis();
  if (currentTime - lastSupplyDropTime >= 10000) {
    spawnSupplyDrop();
    lastSupplyDropTime = currentTime;
  }

  supplyDrops.forEach((drop) => drop.draw());
}
