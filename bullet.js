let bullets = [];

class Bullet {
  constructor(size, vectorX, vectorY, color, originX, originY, bulletSpeed) {
    this.size = size;
    this.vectorX = vectorX;
    this.vectorY = vectorY;
    this.color = color;
    this.xPos = originX;
    this.yPos = originY;
    this.bulletSpeed = bulletSpeed;
    this.bounces = 0;
  }

  moveBullet() {
    if (
      this.xPos + this.vectorX * this.bulletSpeed * deltaTime > WIDTH ||
      this.xPos + this.vectorX * this.bulletSpeed * deltaTime < 0
    ) {
      this.vectorX = -this.vectorX;
      this.bounces += 1;
    }

    if (
      this.yPos + this.vectorY * this.bulletSpeed * deltaTime > HEIGHT ||
      this.yPos + this.vectorY * this.bulletSpeed * deltaTime < 0
    ) {
      this.vectorY = -this.vectorY;
      this.bounces += 1;
    }

    if (this.bounces >= 3) {
      return;
    }

    this.xPos += this.vectorX * this.bulletSpeed * deltaTime;
    this.yPos += this.vectorY * this.bulletSpeed * deltaTime;
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
}
