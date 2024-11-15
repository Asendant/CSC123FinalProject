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

    if ((keyIsDown(65) || keyIsDown(37)) && this.xPos - 1 > 0) {
      moveX -= 1;
    }
    if (
      (keyIsDown(68) || keyIsDown(39)) &&
      this.xPos + 1 < WIDTH - this.sizeX
    ) {
      moveX += 1;
    }
    if ((keyIsDown(87) || keyIsDown(38)) && this.yPos - 1 > 0) {
      moveY -= 1;
    }
    if (
      (keyIsDown(83) || keyIsDown(40)) &&
      this.yPos + 1 < HEIGHT - this.sizeY
    ) {
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
  damage(amount) {
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
  if (!isGameRunning) return;
  // Calculate the direction vector
  let dirX = mouseX - player.xPos;
  let dirY = mouseY - player.yPos;

  // Normalize the direction vector
  let magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
  let normalizedX = dirX / magnitude;
  let normalizedY = dirY / magnitude;

  bullets.push(
    new Bullet(
      10,
      normalizedX, // Use the normalized values
      normalizedY,
      "blue",
      player.xPos,
      player.yPos,
      0.3, // Bullet speed
      30,
      player
    )
  );

  playerShootSound.play();
}

function restartGame() {
  // Reset player
  player = new Player(20, 20, 5, color(29, 255, 13), WIDTH / 2, HEIGHT / 2);

  // Clear bullets and enemies
  bullets = [];
  enemies = [];

  // Reset any other game variables as needed
  enemyMultiplier = 1;

  mainMenuMusic.play();

  // Reinitialize the game (you can call setup here or just reset the variables)
  setup();
}
