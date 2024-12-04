class ShooterEnemy extends Enemy {
  constructor(
    sizeX,
    sizeY,
    startX,
    startY,
    color,
    health,
    playerObject,
    moveSpeed,
    subclass
  ) {
    super(
      sizeX,
      sizeY,
      startX,
      startY,
      color,
      health,
      playerObject,
      moveSpeed,
      subclass
    );
    this.shotCooldownTime = 3000;
    this.lastTimeShot = 0;
  }

  moveEnemy() {
    const xDirection = this.playerObject.xPos - this.xPos;
    const yDirection = this.playerObject.yPos - this.yPos;
    const distance = Math.sqrt(xDirection ** 2 + yDirection ** 2);

    if (distance > 0) {
      this.xPos += (xDirection / distance) * deltaTime * this.moveSpeed;
      this.yPos += (yDirection / distance) * deltaTime * this.moveSpeed;
    }

    if (
      dist(
        this.xPos,
        this.yPos,
        this.playerObject.xPos,
        this.playerObject.yPos
      ) < 200
    ) {
      this.shootAtPlayer();
    }
  }

  shootAtPlayer() {
    const currentTime = millis();
    if (currentTime - this.lastTimeShot >= this.shotCooldownTime) {
      this.lastTimeShot = currentTime;

      const xDirection = this.playerObject.xPos - this.xPos;
      const yDirection = this.playerObject.yPos - this.yPos;
      const distance = Math.sqrt(xDirection ** 2 + yDirection ** 2);

      if (distance > 0) {
        const normalizedX = xDirection / distance;
        const normalizedY = yDirection / distance;

        bullets.push(
          new Bullet(
            10,
            normalizedX,
            normalizedY,
            "red",
            this.xPos,
            this.yPos,
            0.15,
            30,
            this
          )
        );
      }
    }
  }
}
