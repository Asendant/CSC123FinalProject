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

    this.xPos += moveX * this.speed;
    this.yPos += moveY * this.speed;
  }

  drawPlayer() {
    push();
    fill(this.color);
    rect(this.xPos, this.yPos, this.sizeX, this.sizeY);
    pop();
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
