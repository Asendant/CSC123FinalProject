class Player {
  constructor(sizeX, sizeY, speed, color, startX, startY, health) {
    [
      this.sizeX,
      this.sizeY,
      this.speed,
      this.color,
      this.xPos,
      this.yPos,
      this.health,
    ] = [sizeX, sizeY, speed, color, startX, startY, health || 100];
    this.maxHealth = health; // Store max health for health bar
  }

  movePlayer() {
    let moveX = 0;
    let moveY = 0;

    if (keyIsDown(65)) {
      moveX -= 1;
    }
    if (keyIsDown(68)) {
      moveX += 1;
    }
    if (keyIsDown(87)) {
      moveY -= 1;
    }
    if (keyIsDown(83)) {
      moveY += 1;
    }

    this.xPos += moveX * this.speed * deltaTime;
    this.yPos += moveY * this.speed * deltaTime;
  }

  drawPlayer() {
    push();
    fill(this.color);
    rect(this.xPos, this.yPos, this.sizeX, this.sizeY);
    pop();

    // Draw the health bar above the player
    this.drawHealthBar();
  }

  drawHealthBar() {
    const barWidth = this.sizeX; // Health bar width is same as player width
    const barHeight = 5; // Height of the health bar
    const healthPercentage = this.health / this.maxHealth; // Health percentage

    const barX = this.xPos;
    const barY = this.yPos - barHeight - 5; // 5 pixels above the player

    // Draw background bar (total health)
    push();
    fill(255, 0, 0); // Red for total health
    rect(barX, barY, barWidth, barHeight);

    // Draw foreground bar (current health)
    fill(0, 255, 0); // Green for current health
    rect(barX, barY, barWidth * healthPercentage, barHeight);
    pop();
  }

  // Function to apply damage to the player
  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0; // Prevent health from going negative
      // Handle player death (if needed)
      console.log("Player is dead");
      restartGame();
    }
  }
}

function mouseClicked() {
  bullets.push(
    new Bullet(
      10,
      mouseX - player.xPos,
      mouseY - player.yPos,
      "blue",
      player.xPos,
      player.yPos,
      0.001,
      30
    )
  );
}

function restartGame() {
  console.log("Restarting game...");

  // Reset player
  player = new Player(20, 20, 5, color(29, 255, 13), WIDTH / 2, HEIGHT / 2);

  // Clear bullets and enemies
  bullets = [];
  enemies = [];

  // Reset any other game variables as needed
  enemyMultiplier = 1;

  // Reinitialize the game (you can call setup here or just reset the variables)
  setup();
}
