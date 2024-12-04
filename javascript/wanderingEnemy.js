class WanderingEnemy extends Enemy {
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
    this.currentXPosToMove = random(0, WIDTH);
    this.currentYPosToMove = random(0, HEIGHT);
  }

  moveEnemy() {
    if (
      dist(
        this.xPos,
        this.yPos,
        this.currentXPosToMove,
        this.currentYPosToMove
      ) < 5
    ) {
      this.currentXPosToMove = random(0, WIDTH);
      this.currentYPosToMove = random(0, HEIGHT);
    }

    const xDirection = this.currentXPosToMove - this.xPos;
    const yDirection = this.currentYPosToMove - this.yPos;
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
      ) < 35
    ) {
      this.playerObject.damage(2);
    }
  }
}
