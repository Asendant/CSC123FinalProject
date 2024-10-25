class ShooterEnemy extends Enemy {
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

    this.shotCooldownTime = 3000; //In milliseconds
    this.lastTimeShot = 0;
  }

  drawEnemy() {
    super.drawEnemy();
  }

  moveEnemy() {
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

    if (
      dist(
        this.xPos,
        this.yPos,
        this.playerObject.xPos,
        this.playerObject.yPos
      ) < 200
    ) {
      this.shootAtPlayer();
      return;
    }
    // Update the position of the enemy based on the move speed
    this.xPos += xDirectionToMove * deltaTime * this.moveSpeed;
    this.yPos += yDirectionToMove * deltaTime * this.moveSpeed;
  }

  shootAtPlayer() {
    let currentTime = millis(); // Get current time in milliseconds

    if (currentTime - this.lastTimeShot >= this.shotCooldownTime) {
      // Update the last shot time
      this.lastTimeShot = currentTime;

      // Calculate direction vector towards player
      let xDirectionToShoot = this.playerObject.xPos - this.xPos;
      let yDirectionToShoot = this.playerObject.yPos - this.yPos;

      // Normalize the direction to get a unit vector
      let distanceToPlayer = Math.sqrt(
        xDirectionToShoot ** 2 + yDirectionToShoot ** 2
      );
      if (distanceToPlayer > 0) {
        xDirectionToShoot /= distanceToPlayer;
        yDirectionToShoot /= distanceToPlayer;
      }

      // Create a new bullet and shoot it towards the player
      let newBullet = new Bullet(
        10, // Bullet size
        xDirectionToShoot, // X direction
        yDirectionToShoot, // Y direction
        "red", // Bullet color
        this.xPos, // Origin X
        this.yPos, // Origin Y
        0.1, // Bullet speed
        30 // Damage amount
      );
      bullets.push(newBullet); // Add the bullet to the bullets array
    }
  }
}
