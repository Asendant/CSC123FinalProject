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
    })
  );

  // Add bullets to the grid
  bullets.forEach((bullet) => {
    const cell = getGridCell(bullet.xPos, bullet.yPos);
    collisionsGrid[cell.col][cell.row].bullets.push(bullet);
  });

  // Add enemies to the grid
  enemies.forEach((enemy) => {
    const cell = getGridCell(enemy.xPos, enemy.yPos);
    collisionsGrid[cell.col][cell.row].enemies.push(enemy);
  });

  supplyDrops.forEach((supplyDrop) => {
    const cell = getGridCell(supplyDrop.xPos, supplyDrop.yPos);
    collisionsGrid[cell.col][cell.row].supplyDrops.push(supplyDrop);
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

        // Check if the bullet can collide with the player
        if (bullet.canCollideWithPlayer() && checkCollision(bullet, player)) {
          player.takeDamage(bullet.damageAmount); // Damage the player
          bullets.splice(bulletIndex, 1); // Remove bullet
          continue; // Move to the next bullet
        }

        // Check for bullet and enemy collision
        for (
          let enemyIndex = cell.enemies.length - 1;
          enemyIndex >= 0;
          enemyIndex--
        ) {
          let enemy = cell.enemies[enemyIndex];

          if (bullet.canCollideWithPlayer() && checkCollision(bullet, enemy)) {
            // Handle collision with enemy
            enemy.damage(bullet.damageAmount);
            bullets.splice(bullets.indexOf(bullet), 1);
            break; // Exit loop once bullet hits enemy
          }

          // Check if the enemy collides with the player
          if (checkCollision(enemy, player)) {
            player.damage(20); // Example damage from enemies
          }
        }

        for (
          let supplyDropIndex = cell.supplyDrops.length - 1;
          supplyDropIndex >= 0;
          supplyDropIndex--
        ) {
          let supplyDrop = cell.supplyDrops[supplyDropIndex];

          console.log(checkCollision(supplyDrop, player));

          if (checkCollision(supplyDrop, player)) {
            console.log("Collected");
            supplyDrop.hasBeenPickedUp = true;
          }
        }
      }
    })
  );
}

// Simple bounding box collision check
function checkCollision(obj1, obj2) {
  return (
    obj1.xPos < obj2.xPos + obj2.sizeX &&
    obj1.xPos + obj1.size > obj2.xPos &&
    obj1.yPos < obj2.yPos + obj2.sizeY &&
    obj1.yPos + obj1.size > obj2.yPos
  );
}
