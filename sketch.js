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

class Enemy {
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
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.xPos = startX;
    this.yPos = startY;
    this.color = color;
    this.health = health;
    this.playerObject = playerObject;
    this.moveSpeed = moveSpeed;
  }

  drawEnemy() {
    push();
    fill(this.color);
    rect(this.xPos, this.yPos, this.sizeX, this.sizeY);
    pop();
  }

  moveToPlayer() {
    // Calculate the direction vector
    let xDirectionToMove = this.playerObject.xPos - this.xPos;
    let yDirectionToMove = this.playerObject.yPos - this.yPos;

    // Calculate the distance between the enemy and the player
    let distance = Math.sqrt(xDirectionToMove ** 2 + yDirectionToMove ** 2);

    // Normalize the direction vector to get a unit vector
    if (distance > 0) {
      xDirectionToMove /= distance;
      yDirectionToMove /= distance;
    }

    // Update the position of the enemy based on the move speed
    this.xPos += xDirectionToMove * deltaTime * this.moveSpeed;
    this.yPos += yDirectionToMove * deltaTime * this.moveSpeed;

    console.log(this.xPos, this.yPos);
  }
}

let grid = []; // 2D array to store the grid
let cols = 8;
let rows = 8;
let tileSize;

const [WIDTH, HEIGHT] = [600, 600];

let player;
let enemyExample;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  player = new Player(20, 20, 0.25, color(29, 255, 13), WIDTH / 2, HEIGHT / 2);

  enemyExample = new Enemy(
    30,
    30,
    WIDTH / 2 + 50,
    HEIGHT / 2 + 50,
    "red",
    100,
    player,
    0.2
  );
}

function draw() {
  background(220);

  drawGrid();

  player.movePlayer();
  player.drawPlayer();

  enemyExample.drawEnemy();
  enemyExample.moveToPlayer();
}

function drawGrid() {
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
