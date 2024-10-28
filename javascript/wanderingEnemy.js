class WanderingEnemy extends Enemy {
  constructor(
    sizeX,
    sizeY,
    startX,
    startY,
    color,
    health,
    playerObject,
    moveSpeed
  ) {
    super(sizeX, sizeY, startX, startY, color, health, playerObject, moveSpeed);
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

    let xDirectionToMove = this.currentXPosToMove - this.xPos;
    let yDirectionToMove = this.currentYPosToMove - this.yPos;

    // Calculate the distance between the enemy and the player
    let distance = Math.sqrt(xDirectionToMove ** 2 + yDirectionToMove ** 2);

    // Normalize the direction vector to get a unit vector
    if (distance > 0) {
      xDirectionToMove /= distance;
      yDirectionToMove /= distance;
    }

    // Update the position of the enemy based on the move speed
    this.xPos += xDirectionToMove * deltaTime * this.moveSpeed;
    this.yPos += yDirectionToMove * deltaTime * this.moveSpeed;

    if (
      dist(
        this.xPos,
        this.yPos,
        this.playerObject.xPos,
        this.playerObject.yPos
      ) < 35
    ) {
      this.playerObject.damage(2);
      return;
    }
  }
}
