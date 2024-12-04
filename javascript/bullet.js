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
    this.bulletSpeed = bulletSpeed;
    this.bounces = 0; // Track the number of bounces
    this.damageAmount = damageAmount;
    this.initialDistance = 0; // Distance traveled by the bullet
    this.ignoreShooterCollisionDistance = 50; // Minimum distance before the bullet can hit the shooter
    this.shooter = shooter;
  }

  moveBullet() {
    const movementX = this.vectorX * this.bulletSpeed * deltaTime;
    const movementY = this.vectorY * this.bulletSpeed * deltaTime;

    this.xPos += movementX;
    this.yPos += movementY;

    // Track the distance traveled
    this.initialDistance += Math.sqrt(movementX ** 2 + movementY ** 2);

    // Handle bounces off boundaries
    if (this.xPos <= 0 || this.xPos >= WIDTH) {
      this.vectorX = -this.vectorX;
      this.bounces++;
    }
    if (this.yPos <= 0 || this.yPos >= HEIGHT) {
      this.vectorY = -this.vectorY;
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
    if (
      entity === this.shooter &&
      this.initialDistance <= this.ignoreShooterCollisionDistance
    ) {
      return false; // Prevent self-collision too early
    }
    return true;
  }
}

bullets = [];
