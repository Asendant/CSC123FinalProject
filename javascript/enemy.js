let enemies = [];

let enemyMultiplier = 1;

function SpawnEnemies() {
  if (enemies.length > 2) return;

  for (let i = 0; i < Math.floor(Math.pow(1.5, enemyMultiplier)); i++) {
    let enemyType = Math.round(random(1, 2));
    let newEnemy;
    if (enemyType == 1) {
      newEnemy = new Enemy(
        30,
        30,
        random(100, WIDTH - 100),
        random(100, HEIGHT - 100),
        "red",
        100,
        player,
        random(0.05, 0.1)
      );
    } else if (enemyType == 2) {
      newEnemy = new ShooterEnemy(
        30,
        30,
        random(100, WIDTH - 100),
        random(100, HEIGHT - 100),
        "yellow",
        75,
        player,
        random(0.03, 0.05)
      );
    }

    // Check distance between new enemy and player
    if (dist(newEnemy.xPos, newEnemy.yPos, player.xPos, player.yPos) < 100) {
      i -= 1;
      continue;
    }

    enemies.push(newEnemy);
  }

  enemyMultiplier += 1;
}

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
    this.maxHealth = health; // Save the maximum health
    this.playerObject = playerObject;
    this.moveSpeed = moveSpeed;
  }

  drawEnemy() {
    // Draw the enemy
    push();
    fill(this.color);
    rect(this.xPos, this.yPos, this.sizeX, this.sizeY);
    pop();

    // Draw the health bar above the enemy
    this.drawHealthBar();
  }

  drawHealthBar() {
    const barWidth = this.sizeX; // Health bar width is the same as the enemy's width
    const barHeight = 5; // Height of the health bar
    const healthPercentage = this.health / this.maxHealth; // Health percentage

    // Position of the health bar (slightly above the enemy)
    const barX = this.xPos;
    const barY = this.yPos - barHeight - 5; // 5 pixels above the enemy

    // Draw background bar (representing total health)
    push();
    fill(255, 0, 0); // Red color for total health
    rect(barX, barY, barWidth, barHeight);

    // Draw foreground bar (representing current health)
    fill(0, 255, 0); // Green color for current health
    rect(barX, barY, barWidth * healthPercentage, barHeight);
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

    if (
      dist(
        this.xPos,
        this.yPos,
        this.playerObject.xPos,
        this.playerObject.yPos
      ) < 35
    ) {
      this.playerObject.takeDamage(2);
      return;
    }
    // Update the position of the enemy based on the move speed
    this.xPos += xDirectionToMove * deltaTime * this.moveSpeed;
    this.yPos += yDirectionToMove * deltaTime * this.moveSpeed;
  }

  // Method to apply damage to the enemy
  damage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0; // Prevent negative health
    }
  }
}
