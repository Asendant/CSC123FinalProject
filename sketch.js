class Player {
  constructor(sizeX, sizeY, speed, color, startX, startY) {
    [this.sizeX, this.sizeY, this.speed, this.color, this.xPos, this.yPos] = [
      sizeX,
      sizeY,
      speed,
      color,
      startX,
      startY,
    ];
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
    if (keyIsDown(87)){
      moveY -= 1;
    }
    if (keyIsDown(83)){
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
  }
}

const [WIDTH, HEIGHT] = [600, 600];

let player;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  player = new Player(20, 20, 0.25, color(246, 20, 20), WIDTH / 2, HEIGHT / 2);
}

function draw() {
  background(220);

  player.movePlayer();
  player.drawPlayer();
}
