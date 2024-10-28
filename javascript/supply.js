let supplyDrops = [];

class Supply {
  constructor(sizeX, sizeY, startX, startY, color) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.xPos = startX;
    this.yPos = startY;
    this.color = color;
    this.hasBeenPickedUp = false;
  }

  drawSupply() {
    // Draw the supply
    push();
    fill(this.color);
    rect(this.xPos, this.yPos, this.sizeX, this.sizeY);
    pop();
  }
}

function SpawnSupply() {
  newSupply = new Supply(
    30,
    30,
    random(100, WIDTH - 100),
    random(100, HEIGHT - 100),
    "purple"
  );

  supplyDrops.push(newSupply);
}
