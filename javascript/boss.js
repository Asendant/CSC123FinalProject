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
    this.minionSpawnProbability = 0.4; // Higher chance to spawn minions
    this.cooldown = 3000; // General cooldown between abilities
    this.lastAbilityTime = 0;
    this.isUsingAbility = false;
    this.meleeDamage = 25; // Damage dealt when the player is too close
  }

  drawEnemy() {
    push();
    fill(this.color);
    rect(this.xPos, this.yPos, this.sizeX * 1.5, this.sizeY * 1.5); // Boss is larger
    pop();
    this.drawHealthBar();
  }

  drawHealthBar() {
    const barWidth = this.sizeX * 1.5;
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

  useAbility() {
    if (this.isUsingAbility || millis() < this.lastAbilityTime + this.cooldown)
      return;

    this.isUsingAbility = true;
    const chosenAbility =
      Math.random() < this.minionSpawnProbability
        ? "spawnMinions"
        : random(this.abilities.filter((a) => a !== "spawnMinions"));

    this.triggerVisualCue(chosenAbility);

    setTimeout(() => {
      if (this[chosenAbility]) {
        this[chosenAbility]();
      }
      this.isUsingAbility = false;
      this.lastAbilityTime = millis();
    }, 1000); // Cue duration
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

  spawnMinions() {
    for (let i = 0; i < 6; i++) {
      const minion = new Enemy(
        20,
        20,
        this.xPos + random(-100, 100),
        this.yPos + random(-100, 100),
        "purple",
        30,
        this.playerObject,
        0.2
      );
      minion.dropsEXP = false;
      minion.meleeDamage = 15; // Minion melee damage
      enemies.push(minion);
    }
  }

  shootLasers() {
    for (let i = 0; i < 8; i++) {
      bullets.push(
        new Bullet(
          10,
          cos((TWO_PI / 8) * i),
          sin((TWO_PI / 8) * i),
          "red",
          this.xPos,
          this.yPos,
          0.4,
          15,
          this
        )
      );
    }
  }

  areaAttack() {
    if (
      dist(
        this.xPos,
        this.yPos,
        this.playerObject.xPos,
        this.playerObject.yPos
      ) < 150
    ) {
      this.playerObject.damage(50);
    }
  }

  useSpinningLaser() {
    let angle = 0;
    const laserDuration = 3000;
    const interval = setInterval(() => {
      angle += 0.1;
      const laserX = this.xPos + cos(angle) * 150;
      const laserY = this.yPos + sin(angle) * 150;

      bullets.push(
        new Bullet(
          10,
          cos(angle),
          sin(angle),
          "yellow",
          laserX,
          laserY,
          0.2,
          20,
          this
        )
      );
    }, 100);

    setTimeout(() => clearInterval(interval), laserDuration);
  }

  useDash() {
    const dashSpeed = 50;
    const directionX = this.playerObject.xPos - this.xPos;
    const directionY = this.playerObject.yPos - this.yPos;
    const magnitude = Math.sqrt(directionX ** 2 + directionY ** 2);

    if (magnitude > 0) {
      this.xPos += (directionX / magnitude) * dashSpeed;
      this.yPos += (directionY / magnitude) * dashSpeed;
    }

    if (
      dist(
        this.xPos,
        this.yPos,
        this.playerObject.xPos,
        this.playerObject.yPos
      ) < 50
    ) {
      this.playerObject.damage(40);
    }
  }

  useExplosiveBarrage() {
    for (let i = 0; i < 12; i++) {
      bullets.push(
        new Bullet(
          15,
          cos((TWO_PI / 12) * i),
          sin((TWO_PI / 12) * i),
          "orange",
          this.xPos,
          this.yPos,
          0.3,
          30,
          this
        )
      );
    }
  }

  meleeAttack() {
    if (
      dist(
        this.xPos,
        this.yPos,
        this.playerObject.xPos,
        this.playerObject.yPos
      ) < 50
    ) {
      this.playerObject.damage(this.meleeDamage);
    }
  }

  moveEnemy() {
    if (this.isUsingAbility) return;

    const xDirection = this.playerObject.xPos - this.xPos;
    const yDirection = this.playerObject.yPos - this.yPos;
    const distance = Math.sqrt(xDirection ** 2 + yDirection ** 2);

    if (distance > 0) {
      this.xPos += (xDirection / distance) * deltaTime * this.moveSpeed;
      this.yPos += (yDirection / distance) * deltaTime * this.moveSpeed * 0.5;
    }

    this.meleeAttack(); // Check for melee attack opportunity
    this.useAbility(); // Trigger an ability
  }
}
