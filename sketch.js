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
let grid = []; // 2D array to store the grid
let cols = 8;
let rows = 8;
let tileSize;

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

//map code
let tileSize = 50;

function setup() {
  createCanvas(800, 800);
  noLoop();
}

function draw() {
  background(20);

  // Draw dungeon tiles
  drawTiles();

  // Add cracks
  drawCracks();

  // Add subtle water puddles
  drawWaterPuddles();
}

function drawTiles() {
  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      let baseColor = color(50, 50, 50); // Base gray for tiles
      let noiseOffset = noise(x * 0.1, y * 0.1) * 30; // Add variation
      fill(red(baseColor) + noiseOffset, green(baseColor) + noiseOffset, blue(baseColor) + noiseOffset);
      stroke(30);
      rect(x, y, tileSize, tileSize);
    }
  }
}

function drawCracks() {
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let crackLength = random(20, 50);

    for (let j = 0; j < crackLength; j++) {
      let angle = random(TWO_PI);
      let xOffset = cos(angle) * 5;
      let yOffset = sin(angle) * 5;
      line(x, y, x + xOffset, y + yOffset);
      x += xOffset;
      y += yOffset;
    }
  }
}

function drawWaterPuddles() {
  noStroke();
  for (let i = 0; i < 6; i++) {
    let x = random(width);
    let y = random(height);
    let puddleColor = color(0, 0, 100, 50); // Dark blue with subtle opacity
    for (let r = 30; r > 0; r -= 5) {
      fill(0, 0, 100, map(r, 0, 30, 0, 50)); // More subtle, lower opacity
      ellipse(x, y, r, r * 0.7); // Slightly oval puddle shape
    }
  }
}
