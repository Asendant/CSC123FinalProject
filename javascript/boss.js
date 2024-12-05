class Boss extends Enemy {
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
    super(
      sizeX,
      sizeY,
      startX,
      startY,
      color,
      health,
      playerObject,
      moveSpeed,
      "boss"
    );
    this.abilities = [
      "spawnMinions",
      "shootLasers",
      "areaAttack",
      "useSpinningLaser",
      "useDash",
      "useExplosiveBarrage",
    ];
    this.cooldown = 0; // Start with no cooldown
    this.lastAbilityTime = 0;
    this.isUsingAbility = false;
  }

  drawEnemy() {
    push();
    fill(this.color);
    rect(this.xPos, this.yPos, this.sizeX * 1.5, this.sizeY * 1.5); // Boss is larger
    pop();
    this.drawHealthBar();
  }

  drawHealthBar() {
    const barWidth = this.sizeX * 1.5; // Adjusted for boss size
    const barHeight = 5;
    const healthPercentage = this.health / this.maxHealth;

    push();
    fill(255, 0, 0);
    rect(this.xPos, this.yPos - barHeight - 10, barWidth, barHeight);
    fill(0, 255, 0);
    rect(
      this.xPos,
      this.yPos - barHeight - 10,
      barWidth * healthPercentage,
      barHeight
    );
    pop();
  }

  useAbility() {
    if (this.isUsingAbility || millis() < this.cooldown) return; // Wait for cooldown and ability to finish
    const chosenAbility = random(this.abilities);
    this.isUsingAbility = true;

    this.triggerVisualCue(chosenAbility);

    setTimeout(() => {
      if (this[chosenAbility]) {
        this[chosenAbility](() => {
          this.isUsingAbility = false;
          this.cooldown = millis() + random(5000, 10000); // Cooldown starts after ability
        });
      }
    }, 1000); // Visual cue duration
  }

  triggerVisualCue(ability) {
    switch (ability) {
      case "spawnMinions":
        this.flashColor("purple", 1000);
        break;
      case "shootLasers":
        this.pulseSize(1.2, 1000);
        break;
      case "areaAttack":
        this.flashColor("red", 1000);
        break;
      case "useSpinningLaser":
        this.flashColor("yellow", 1000);
        break;
      case "useDash":
        this.flashColor("blue", 1000);
        break;
      case "useExplosiveBarrage":
        this.pulseSize(1.5, 1000);
        break;
    }
  }

  spawnMinions(callback) {
    for (let i = 0; i < 8; i++) {
      const minion = new Enemy(
        20,
        20,
        this.xPos + random(-100, 100),
        this.yPos + random(-100, 100),
        "purple",
        30,
        this.playerObject,
        0.1
      );
      minion.dropsEXP = false; // Prevent EXP drops
      enemies.push(minion);
    }
    callback(); // Indicate completion
  }

  useSpinningLaser(callback) {
    const laserSpeed = 0.1;
    const laserDuration = 5000; // Increased duration
    const laserStartTime = millis();

    const laserUpdate = () => {
      const elapsedTime = millis() - laserStartTime;
      if (elapsedTime > laserDuration) {
        callback(); // End ability
        return;
      }

      const angle = (elapsedTime * laserSpeed) % TWO_PI;
      const laserX = this.xPos + this.sizeX * 0.75 + cos(angle) * 150; // Centered laser
      const laserY = this.yPos + this.sizeY * 0.75 + sin(angle) * 150;

      push(); // Laser-only style
      stroke("red");
      strokeWeight(5);
      line(
        this.xPos + this.sizeX * 0.75,
        this.yPos + this.sizeY * 0.75,
        laserX,
        laserY
      );
      pop();

      if (dist(player.xPos, player.yPos, laserX, laserY) < 20) {
        player.damage(30);
      }

      requestAnimationFrame(laserUpdate);
    };

    laserUpdate();
  }

  useDash(callback) {
    const dashSpeed = 15; // Faster dash speed
    const directionX = player.xPos - this.xPos;
    const directionY = player.yPos - this.yPos;
    const magnitude = Math.sqrt(directionX ** 2 + directionY ** 2);

    if (magnitude > 0) {
      this.xPos += (directionX / magnitude) * dashSpeed;
      this.yPos += (directionY / magnitude) * dashSpeed;
    }

    if (dist(this.xPos, this.yPos, player.xPos, player.yPos) < 50) {
      player.damage(40);
    }
    callback(); // Indicate completion
  }

  useExplosiveBarrage(callback) {
    for (let i = 0; i < 12; i++) {
      bullets.push(
        new Bullet(
          15,
          cos((TWO_PI / 12) * i),
          sin((TWO_PI / 12) * i),
          "orange",
          this.xPos + this.sizeX * 0.75,
          this.yPos + this.sizeY * 0.75,
          0.25,
          20,
          this
        )
      );
    }
    callback(); // Indicate completion
  }

  areaAttack(callback) {
    if (dist(this.xPos, this.yPos, player.xPos, player.yPos) < 150) {
      player.damage(50);
    }
    callback(); // Indicate completion
  }

  flashColor(color, duration) {
    const originalColor = this.color;
    this.color = color;
    setTimeout(() => {
      this.color = originalColor;
    }, duration);
  }

  pulseSize(multiplier, duration) {
    const originalSizeX = this.sizeX;
    const originalSizeY = this.sizeY;

    this.sizeX *= multiplier;
    this.sizeY *= multiplier;

    setTimeout(() => {
      this.sizeX = originalSizeX;
      this.sizeY = originalSizeY;
    }, duration);
  }

  moveEnemy() {
    if (this.isUsingAbility) return; // Freeze movement during abilities
    const xDirection = this.playerObject.xPos - this.xPos;
    const yDirection = this.playerObject.yPos - this.yPos;
    const distance = Math.sqrt(xDirection ** 2 + yDirection ** 2);

    if (distance > 0) {
      this.xPos += (xDirection / distance) * deltaTime * this.moveSpeed;
      this.yPos += (yDirection / distance) * deltaTime * this.moveSpeed * 0.5;
    }
    this.useAbility();
  }
}
