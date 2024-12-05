const cellSize = 100; // Define the size of each grid cell

// Function to get the grid cell index for a given position
function getGridCell(x, y) {
  return {
    col: Math.min(Math.floor(x / cellSize), Math.floor(WIDTH / cellSize) - 1),
    row: Math.min(Math.floor(y / cellSize), Math.floor(HEIGHT / cellSize) - 1),
  };
}

// Initialize a 2D grid for spatial partitioning
let collisionsGrid = Array(Math.ceil(WIDTH / cellSize))
  .fill()
  .map(() =>
    Array(Math.ceil(HEIGHT / cellSize))
      .fill()
      .map(() => ({ bullets: [], enemies: [], supplyDrops: [] }))
  );

function updateGrid() {
  // Clear the grid
  collisionsGrid.forEach((col) =>
    col.forEach((cell) => {
      cell.bullets = [];
      cell.enemies = [];
      cell.supplyDrops = [];
    })
  );

  // Add bullets to the grid
  bullets.forEach((bullet) => {
    const cell = getGridCell(bullet.xPos, bullet.yPos);
    if (cell) collisionsGrid[cell.col][cell.row].bullets.push(bullet);
  });

  // Add enemies to the grid
  enemies.forEach((enemy) => {
    const cell = getGridCell(enemy.xPos, enemy.yPos);
    if (cell) collisionsGrid[cell.col][cell.row].enemies.push(enemy);
  });

  // Add supply drops to the grid
  supplyDrops.forEach((drop) => {
    const cell = getGridCell(drop.xPos, drop.yPos);
    if (cell) collisionsGrid[cell.col][cell.row].supplyDrops.push(drop);

    console.log(collisionsGrid[cell.col][cell.row].supplyDrops); // Logs the supplyDrops array, no longer undefined
  });
}

function checkCollisions() {
  // Loop through grid cells
  collisionsGrid.forEach((col) =>
    col.forEach((cell) => {
      // Check for collisions within each cell
      for (
        let bulletIndex = cell.bullets.length - 1;
        bulletIndex >= 0;
        bulletIndex--
      ) {
        let bullet = cell.bullets[bulletIndex];

        // Update bullet position
        bullet.moveBullet();

        // Check for bullet and player collision
        if (bullet.canCollideWith(player) && checkCollision(bullet, player)) {
          player.damage(bullet.damageAmount);
          bullets.splice(bullets.indexOf(bullet), 1);
          cell.bullets.splice(bulletIndex, 1);
          continue;
        }

        // Check for bullet and enemy collision
        for (
          let enemyIndex = cell.enemies.length - 1;
          enemyIndex >= 0;
          enemyIndex--
        ) {
          let enemy = cell.enemies[enemyIndex];

          if (bullet.canCollideWith(enemy) && checkCollision(bullet, enemy)) {
            enemy.damage(bullet.damageAmount);
            bullets.splice(bullets.indexOf(bullet), 1);
            cell.bullets.splice(bulletIndex, 1);
            break;
          }
        }
      }

      // Check for supply drop collisions
      for (
        let supplyDropIndex = cell.supplyDrops.length - 1;
        supplyDropIndex >= 0;
        supplyDropIndex--
      ) {
        let drop = cell.supplyDrops[supplyDropIndex];

        if (checkCollision(player, drop, true)) {
          drop.restoreHealth(player);
          supplyDrops.splice(supplyDrops.indexOf(drop), 1);
          cell.supplyDrops.splice(supplyDropIndex, 1);
        }
      }
    })
  );
}

// Simple bounding box or spherical collision check
function checkCollision(obj1, obj2, useSpherical = false) {
  if (useSpherical) {
    // Spherical collision detection
    const distance = dist(
      obj1.xPos + obj1.size / 2,
      obj1.yPos + obj1.size / 2,
      obj2.xPos,
      obj2.yPos
    );
    const combinedRadius = obj1.size / 2 + obj2.size / 2;
    return distance < combinedRadius;
  } else {
    // Bounding box collision detection
    return (
      obj1.xPos < obj2.xPos + obj2.sizeX &&
      obj1.xPos + obj1.size > obj2.xPos &&
      obj1.yPos < obj2.yPos + obj2.sizeY &&
      obj1.yPos + obj1.size > obj2.yPos
    );
  }
}
