let bullets = [];

class Bullet {
  constructor(
    size,
    vectorX,
    vectorY,
    color,
    originX,
    originY,
    bulletSpeed,
    damageAmount
  ) {
    this.size = size;
    this.vectorX = vectorX;
    this.vectorY = vectorY;
    this.color = color;
    this.xPos = originX;
    this.yPos = originY;
    this.bulletSpeed = bulletSpeed;
    this.bounces = 0;
    this.damageAmount = damageAmount;

    this.initialDistance = 0; // Track the distance traveled since firing
    this.ignorePlayerCollisionDistance = 50; // Distance before it can hit the player
    this.type = "bullet";
  }

  moveBullet() {
    let movementX = this.vectorX * this.bulletSpeed * deltaTime;
    let movementY = this.vectorY * this.bulletSpeed * deltaTime;

    // Update the bullet's position
    this.xPos += movementX;
    this.yPos += movementY;

    // Update the distance the bullet has traveled
    this.initialDistance += Math.sqrt(
      movementX * movementX + movementY * movementY
    );

    // Clamp bullet position to prevent it from going out of the grid bounds
    this.xPos = constrain(this.xPos, 0, WIDTH);
    this.yPos = constrain(this.yPos, 0, HEIGHT);

    // Check for bounces
    if (this.xPos >= WIDTH || this.xPos <= 0) {
      this.vectorX = -this.vectorX;
      this.bounces += 1;
    }

    if (this.yPos >= HEIGHT || this.yPos <= 0) {
      this.vectorY = -this.vectorY;
      this.bounces += 1;
    }

    // Stop the bullet after 3 bounces
    if (this.bounces >= 3) {
      return;
    }
  }

  drawBullet() {
    push();
    fill(this.color);
    circle(this.xPos, this.yPos, this.size);
    pop();
  }

  getBounces() {
    return this.bounces;
  }

  // Check if the bullet has traveled enough distance to collide with the player
  canCollideWithPlayer() {
    return this.initialDistance > this.ignorePlayerCollisionDistance;
  }
}
