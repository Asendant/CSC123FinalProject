let grid = []; // 2D array to store the grid
let cols = 8;
let rows = 8;
let tileSize;

const [WIDTH, HEIGHT] = [600, 600];

let player;
let enemyExample;
let bullet;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  player = new Player(20, 20, 0.25, color(29, 255, 13), WIDTH / 2, HEIGHT / 2);

  enemyExample = new Enemy(
    30,
    30,
    WIDTH / 2 + 200,
    HEIGHT / 2 + 200,
    "red",
    100,
    player,
    0.2
  );
}

function draw() {
  background(220);

  console.log(bullets);

  drawGrid();

  player.movePlayer();
  player.drawPlayer();

  enemyExample.drawEnemy();
  enemyExample.moveToPlayer();

  if (bullets.length > 0) {
    bullets.map((bullet, index) => {
      bullet.moveBullet();
      bullet.drawBullet();
      if (bullet.getBounces() >= 3) bullets.pop(index);
    });
  }
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
