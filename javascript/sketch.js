// Tileset variables
let grid = []; // 2D array to store the grid
let cols = 8;
let rows = 8;
let tileSize;

// Canvas Variables
const [WIDTH, HEIGHT] = [600, 600];

// Class Variables
let player;

function setup() {
  createCanvas(WIDTH, HEIGHT);

  player = new Player(
    20,
    20,
    0.2,
    color(29, 255, 13),
    WIDTH / 2,
    HEIGHT / 2,
    100
  );

  frameRate(75);

  SpawnEnemies();

  // Call the function every 15 seconds (15000 milliseconds)
  // setInterval(SpawnSupply, 10000);
}

// Remove cleanup of collected supply drops from draw loop in draw()
function draw() {
  background(220);

  drawGrid();

  fill("black");
  text(
    `${enemies.length} enem${enemies.length === 1 ? "y" : "ies"}`,
    WIDTH - 50,
    50
  );

  text(`Round: ${enemyMultiplier}`, 10, 25);

  player.movePlayer();
  player.drawPlayer();

  if (bullets.length > 0) {
    bullets.forEach((bullet, index) => {
      bullet.moveBullet();
      bullet.drawBullet();
      if (bullet.getBounces() >= 3) bullets.splice(index, 1);
    });
  }

  if (enemies.length > 0) {
    enemies.map((enemy, index) => {
      enemy.moveEnemy();
      enemy.drawEnemy();

      if (enemy.health <= 0) {
        enemies.splice(index, 1);
        if (enemies.length <= 0) {
          setTimeout(SpawnEnemies, 5000);
        }
      }
    });
  }

  // Draw and update supply drops
  supplyDrops.forEach((supplyDrop) => {
    if (!supplyDrop.hasBeenPickedUp) {
      supplyDrop.drawSupply();
    }
  });

  updateGrid();
  checkCollisions();
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
