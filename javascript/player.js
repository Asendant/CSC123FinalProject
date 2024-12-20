class Player {
  constructor(sizeX, sizeY, speed, color, startX, startY, health = 100) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.speed = speed;
    this.color = color;
    this.xPos = startX;
    this.yPos = startY;
    this.health = health;
    this.maxHealth = health;
    this.bulletDamage = 30;
    this.shootingCooldown = 150; // Milliseconds between shots
    this.lastShotTime = 0; // Timestamp of the last shot
    this.size = Math.max(sizeX, sizeY); // New variable for spherical collision detection
  }

  movePlayer() {
    let moveX = 0;
    let moveY = 0;

    if ((keyIsDown(65) || keyIsDown(37)) && this.xPos - 1 > 0) moveX -= 1;
    if ((keyIsDown(68) || keyIsDown(39)) && this.xPos + 1 < WIDTH - this.sizeX)
      moveX += 1;
    if ((keyIsDown(87) || keyIsDown(38)) && this.yPos - 1 > 0) moveY -= 1;
    if ((keyIsDown(83) || keyIsDown(40)) && this.yPos + 1 < HEIGHT - this.sizeY)
      moveY += 1;

    this.xPos += moveX * this.speed * deltaTime;
    this.yPos += moveY * this.speed * deltaTime;
  }

  drawPlayer() {
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

  damage(amount) {
    this.health -= amount;

    shouldShowDamageIndicator = true;
    setTimeout(() => (shouldShowDamageIndicator = false), 175);

    if (playerDamageSound) {
      const pitch = random(0.9, 1.1); // Subtle pitch variation
      playerDamageSound.rate(pitch);
      playerDamageSound.play();
    }

    if (this.health <= 0) {
      this.health = 0;
      console.log("Player is dead");
      isGameOver = true;
      isGameRunning = false;
    }
  }

  shoot(mouseX, mouseY) {
    const currentTime = millis();
    if (currentTime - this.lastShotTime >= this.shootingCooldown) {
      this.lastShotTime = currentTime;

      const directionX = mouseX - (this.xPos + this.sizeX / 2);
      const directionY = mouseY - (this.yPos + this.sizeY / 2);
      const magnitude = Math.sqrt(directionX ** 2 + directionY ** 2);

      if (magnitude > 0) {
        const normalizedX = directionX / magnitude;
        const normalizedY = directionY / magnitude;

        bullets.push(
          new Bullet(
            10, // Size of the bullet
            normalizedX,
            normalizedY,
            "white", // Bullet color
            this.xPos + this.sizeX / 2, // Start position (center of the player)
            this.yPos + this.sizeY / 2,
            0.5, // Bullet speed
            this.bulletDamage, // Bullet damage
            this
          )
        );

        // Play shooting sound with randomized pitch
        if (playerShootSound) {
          const pitch = random(0.8, 1.2); // Generate random pitch
          playerShootSound.rate(pitch); // Apply pitch variation
          playerShootSound.play(); // Play sound
          console.log(`Playing sound at pitch: ${pitch}`); // Debug
        }
      }
    }
  }
}

function mousePressed() {
  if (isGameRunning && player) {
    player.shoot(mouseX, mouseY);
  }
}
