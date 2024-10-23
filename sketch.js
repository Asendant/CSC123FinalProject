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

    if (keyIsDown(65)) {
      moveX -= 1;
    }
    if (keyIsDown(68)) {
      moveX += 1;
    }

    this.xPos += moveX * this.speed * deltaTime;
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

function drawGrid() 
{
    tileSize = width / cols;

  // Initialize the 2D grid array
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      // Store 0 for darker green, 1 for lighter green
      grid[i][j] = (i + j) % 2;
    }
  }
  // Loop through the array and draw the tiles based on the values stored
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 0) {
        fill(24, 139, 34); // darker green
      } else {
        fill(144, 238, 144); // lighter green
      }
      rect(i * tileSize, j * tileSize, tileSize, tileSize);
    }
  }
}