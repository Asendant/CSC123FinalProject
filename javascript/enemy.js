let enemies = [];
let enemyMultiplier = 1;

function SpawnEnemies() {
  if (enemies.length >= 1) return;

  // Health scaling parameters
  const baseHealth = 50; // Minimum health for enemies
  const healthScalingFactor = 1.05; // Health multiplier per round

  for (let i = 0; i < Math.floor(Math.pow(1.5, enemyMultiplier)); i++) {
    const enemyType = Math.round(random(1, 3));
    let newEnemy;

    // Calculate scaled health
    const scaledHealth = Math.round(
      baseHealth * Math.pow(healthScalingFactor, enemyMultiplier - 1)
    );

    switch (enemyType) {
      case 1: // Melee Enemy
        newEnemy = new Enemy(
          30,
          30,
          random(100, WIDTH - 100),
          random(100, HEIGHT - 100),
          "red",
          scaledHealth,
          player,
          random(0.05, 0.1),
          "melee"
        );
        break;

      case 2: // Shooter Enemy
        newEnemy = new ShooterEnemy(
          30,
          30,
          random(100, WIDTH - 100),
          random(100, HEIGHT - 100),
          "yellow",
          scaledHealth,
          player,
          random(0.03, 0.05),
          "shooter"
        );
        break;

      case 3: // Wandering Enemy
        newEnemy = new WanderingEnemy(
          30,
          30,
          random(100, WIDTH - 100),
          random(100, HEIGHT - 100),
          "orange",
          scaledHealth,
          player,
          random(0.07, 0.1),
          "wanderer"
        );
        break;
    }

    // Avoid spawning enemies too close to the player
    if (dist(newEnemy.xPos, newEnemy.yPos, player.xPos, player.yPos) < 200) {
      i--;
      continue;
    }

    enemies.push(newEnemy);
  }

  enemyMultiplier++; // Increase round difficulty
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
    moveSpeed,
    subclass
  ) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.xPos = startX;
    this.yPos = startY;
    this.color = color;
    this.health = health;
    this.maxHealth = health;
    this.playerObject = playerObject;
    this.moveSpeed = moveSpeed;
    this.subclass = subclass;
  }

  drawEnemy() {
    push();
    fill(this.color);
    rect(this.xPos, this.yPos, this.sizeX, this.sizeY);
    pop();
    this.drawHealthBar();
  }

  drawHealthBar() {
    const barWidth = this.sizeX;
    const barHeight = 5;
    const healthPercentage = this.health / this.maxHealth;

    push();
    fill(255, 0, 0);
    rect(this.xPos, this.yPos - barHeight - 5, barWidth, barHeight);
    fill(0, 255, 0);
    rect(
      this.xPos,
      this.yPos - barHeight - 5,
      barWidth * healthPercentage,
      barHeight
    );
    pop();
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
      ) < 35
    ) {
      this.playerObject.damage(2);
    }
  }

  damage(amount) {
    this.health -= amount;
    if (this.health <= 0) this.health = 0;
  }
}
