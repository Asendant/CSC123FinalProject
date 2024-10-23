class Enemy {
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
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.xPos = startX;
    this.yPos = startY;
    this.color = color;
    this.health = health;
    this.playerObject = playerObject;
    this.moveSpeed = moveSpeed;
  }

  drawEnemy() {
    push();
    fill(this.color);
    rect(this.xPos, this.yPos, this.sizeX, this.sizeY);
    pop();
  }

  moveToPlayer() {
    // Calculate the direction vector
    let xDirectionToMove = this.playerObject.xPos - this.xPos;
    let yDirectionToMove = this.playerObject.yPos - this.yPos;

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
  }
}
