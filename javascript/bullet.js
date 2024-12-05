class Bullet {
  constructor(
    size,
    vectorX,
    vectorY,
    color,
    originX,
    originY,
    bulletSpeed,
    damageAmount,
    shooter
  ) {
    this.size = size;
    this.vectorX = vectorX;
    this.vectorY = vectorY;
    this.color = color;
    this.xPos = originX;
    this.yPos = originY;
    this.originX = originX;
    this.originY = originY;
    this.bulletSpeed = bulletSpeed;
    this.bounces = 0;
    this.damageAmount = damageAmount;
    this.shooter = shooter; // Entity that fired the bullet
    this.distanceTraveled = 0; // Track the distance traveled
    this.minimumSafeDistance = 50; // Safe distance before it can hurt the shooter
  }

  moveBullet() {
    const movementX = this.vectorX * this.bulletSpeed * deltaTime;
    const movementY = this.vectorY * this.bulletSpeed * deltaTime;

    this.xPos += movementX;
    this.yPos += movementY;

    // Update distance traveled
    this.distanceTraveled += Math.sqrt(movementX ** 2 + movementY ** 2);

    // Handle bounces off boundaries
    if (this.xPos <= 0 || this.xPos >= WIDTH) {
      this.vectorX = -this.vectorX;
      this.xPos -= movementX * 2;
      this.bounces++;
    }
    if (this.yPos <= 0 || this.yPos >= HEIGHT) {
      this.vectorY = -this.vectorY;
      this.yPos -= movementY * 2;
      this.bounces++;
    }
  }

  drawBullet() {
    push();
    fill(this.color);
    circle(this.xPos, this.yPos, this.size);
    pop();
  }

  getBounces() {
    return this.bounces; // Return the number of bounces
  }

  canCollideWith(entity) {
    // Prevent collisions with shooter within the safe distance
    if (entity === this.shooter) {
      return this.distanceTraveled > this.minimumSafeDistance;
    }
    return true; // Allow collisions with all other entities
  }
}

bullets = [];
