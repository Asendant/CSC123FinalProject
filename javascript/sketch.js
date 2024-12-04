// Tileset variables
let backgroundGrid = []; // 2D array to store the grid
let cols = 8;
let rows = 8;
let tileSize;

// Canvas Variables
const [WIDTH, HEIGHT] = [600, 600];

// Class Variables
let player;

// Booleans
let isGameRunning = false;
let showControlsMenu = false;
let haveControlsBeenSetup = false;
let hasPlayerInteracted = false;
let shouldShowDamageIndicator;

// Audio
let playerShootSound;
let mainMenuMusic;

// Colors
let damageColor;

function preload() {
  mainMenuMusic = createAudio("/assets/Audio/mainMenuMusic.mp3");
}

function setup() {
  createCanvas(WIDTH, HEIGHT);

  isGameRunning = false;
  showControlsMenu = false;

  frameRate(75);

  if (!hasPlayerInteracted) {
    setUpPrompt();
  } else {
    setupControls();
  }

  // Preload Audio
  playerShootSound = loadSound("/assets/Audio/fireballshootsound.mp3");
  mainMenuMusic.loop();

  // Initialize EXP variables (if not already in another file)
  currentPlayerLevel = 1;
  currentEXP = 0;
  expToNextLevel = baseEXP; // Defined in the leveling script

  damageColor = color(244, 106, 93);
  damageColor.setAlpha(255 / 2);
}

// Remove cleanup of collected supply drops from draw loop in draw()
function draw() {
  if (!hasPlayerInteracted) {
    promptToInteract();
    return;
  }

  if (!haveControlsBeenSetup) {
    setupControls();
  }

  if (isGameRunning) {
    background(45, 45, 45);

    // Update and draw game elements
    updateBullets();
    updateEnemies();
    updatePlayer();
    drawEnemyAndRoundText();
    updateGrid();
    checkCollisions();

    handleEXPOrbs();

    // Draw the EXP bar
    drawEXPBar(); // Calls the function from the leveling script

    showDamageIndicator();
  }

  if (showControlsMenu) {
    displayControls();
  }
}

function drawEnemyAndRoundText() {
  fill("white");
  text(
    `${enemies.length} enem${enemies.length === 1 ? "y" : "ies"}`,
    enemies.length === 1 ? WIDTH - 25 : WIDTH - 25,
    HEIGHT - 20
  );
  text(`Round: ${enemyMultiplier - 1}`, 90, HEIGHT - 20);
}

function updatePlayer() {
  player.movePlayer();
  player.drawPlayer();
}

function updateEnemies() {
  if (enemies.length > 0) {
    enemies.map((enemy, index) => {
      enemy.moveEnemy();
      enemy.drawEnemy();

      if (enemy.health <= 0) {
        enemies.splice(index, 1);
        if (enemies.length <= 0) {
          setTimeout(SpawnEnemies, 5000);
        }

        // Spawn EXP orbs with animation and scaling
        const numOrbs = Math.round(random(3, 5)); // Spawn between 3 and 5 orbs
        for (let i = 0; i < numOrbs; i++) {
          const angle = random(TWO_PI);
          const distance = random(50, 100); // Random distance for target position
          const orbX = enemy.xPos + cos(angle) * distance;
          const orbY = enemy.yPos + sin(angle) * distance;

          // Scale EXP amount with round difficulty
          const baseExpAmount = random(10, 30); // Base EXP value
          const scaledExpAmount = Math.round(baseExpAmount * enemyMultiplier); // Scale with difficulty
          expOrbs.push(
            new ExpOrb(enemy.xPos, enemy.yPos, orbX, orbY, 10, scaledExpAmount)
          );
        }
      }
    });
  }
}

function updateBullets() {
  if (bullets.length > 0) {
    bullets.forEach((bullet, index) => {
      bullet.moveBullet();
      bullet.drawBullet();

      // Check for collisions with enemies
      enemies.forEach((enemy) => {
        if (bullet.canCollideWith(enemy) && checkCollision(bullet, enemy)) {
          enemy.damage(bullet.damageAmount);
          bullets.splice(index, 1);
        }
      });

      // Check for collisions with the player
      if (bullet.canCollideWith(player) && checkCollision(bullet, player)) {
        player.damage(bullet.damageAmount);
        bullets.splice(index, 1);
      }

      // Remove bullets after 3 bounces
      if (bullet.getBounces() >= 3) bullets.splice(index, 1);
    });
  }
}

function showDamageIndicator() {
  if (shouldShowDamageIndicator) {
    push();
    fill(damageColor);
    rect(0, 0, WIDTH, HEIGHT);
    pop();
  }
}

function handleEXPOrbs() {
  expOrbs.forEach((orb, index) => {
    orb.draw();
    orb.move();
    if (orb.checkCollision(player)) {
      currentEXP += orb.expAmount;
      expOrbs.splice(index, 1);
      while (currentEXP >= expToNextLevel) {
        currentEXP -= expToNextLevel;
        levelUp();
      }
    }
  });
}
