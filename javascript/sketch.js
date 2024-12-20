const [WIDTH, HEIGHT] = [600, 600];

// Class Variables
let player;

// Booleans
let isGameRunning = false;
let showControlsMenu = false;
let haveControlsBeenSetup = false;
let hasPlayerInteracted = false;
let isGameOver = false;
let shouldShowDamageIndicator = false;

// Global Variables
let restartButton;
let damageColor;
let playerShootSound;
let enemyHitSound;
let enemyDestroySound;
let expOrbSound;
let levelUpSound;
let backgroundMusic;

function preload() {
  playerShootSound = loadSound("assets/Audio/fireballshootsound.mp3");
  playerShootSound.setVolume(0.4);

  playerDamageSound = loadSound("assets/Audio/damagetaken.mp3");
  playerDamageSound.setVolume(0.5);

  enemyHitSound = loadSound("assets/Audio/enemyDamaged.wav"); // Enemy hit sound
  enemyHitSound.setVolume(0.4);

  enemyDestroySound = loadSound("assets/Audio/enemyExplosion.wav"); // Enemy destroy sound
  enemyDestroySound.setVolume(0.45);

  expOrbSound = loadSound("assets/Audio/expPickup.wav"); // EXP orb sound
  expOrbSound.setVolume(0.35);

  levelUpSound = loadSound("assets/Audio/levelup.wav"); // Level-up sound
  levelUpSound.setVolume(0.5);

  backgroundMusic = loadSound("assets/Audio/backgroundMusic.mp3");
  backgroundMusic.setVolume(0.3);
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(75);

  damageColor = color(244, 106, 93, 128);

  if (!hasPlayerInteracted) {
    setUpPrompt();
  } else {
    setupControls();
  }
}

function draw() {
  if (isInteractPromptBeingShown) {
    promptToInteract();
    return;
  }

  if (!haveControlsBeenSetup) {
    setupControls();
  }

  if (isGameOver) {
    drawGameOverScreen();
    return;
  }

  if (isGameRunning) {
    if (!backgroundMusic.isPlaying()) {
      backgroundMusic.loop(); // Ensure the music loops
    }

    updateGrid(); // Update spatial partitioning
    background(45, 45, 45); // Clear background
    updateGameElements(); // Update player, bullets, enemies
    handleEXPOrbs(); // Draw and manage EXP orbs
    handleSupplyDrops(); // Draw and manage supply drops
    drawEXPBar(); // Update EXP bar
    showDamageIndicator(); // Show damage effect
  } else {
    // Stop the music when the game is paused or not running
    if (backgroundMusic.isPlaying()) {
      backgroundMusic.stop();
    }
  }

  if (showControlsMenu) {
    displayControls();
  }
}

// Update all game elements during the main loop
function updateGameElements() {
  player.movePlayer();
  updateBullets();
  updateEnemies();
  player.drawPlayer();
  handleSupplyDrops();
  checkCollisions(); // Ensure collisions are checked after updates
  drawEnemyAndRoundText();
}

// Update enemy behavior
function updateEnemies() {
  if (enemies.length > 0) {
    enemies.forEach((enemy, index) => {
      enemy.moveEnemy();
      enemy.drawEnemy();

      if (enemy.health <= 0) {
        if (enemy instanceof Boss) {
          console.log("Boss defeated!");
          // Boss drops 50–100 EXP orbs
          spawnEXPOrbs(enemy, random(50, 100));
        } else {
          console.log("Enemy defeated!");
          // Normal enemies drop 3–5 EXP orbs
          spawnEXPOrbs(enemy, random(3, 5));
        }

        enemies.splice(index, 1);
      }
    });

    if (enemies.length === 0) {
      setTimeout(SpawnEnemies, 5000);
    }
  }
}

// Spawn EXP orbs
function spawnEXPOrbs(enemy, numOrbs) {
  for (let i = 0; i < numOrbs; i++) {
    const angle = random(TWO_PI);
    const distance = random(20, 50);
    const orbX = enemy.xPos + cos(angle) * distance;
    const orbY = enemy.yPos + sin(angle) * distance;

    // Scale orb EXP based on player level
    const baseExp = 10; // Minimum EXP per orb
    const expScalingFactor = 1.2; // Determines how EXP increases with level
    const maxAdditionalExp = 50; // Caps additional EXP scaling for normal enemies

    const orbExp = Math.round(
      baseExp +
        Math.min(maxAdditionalExp, (currentPlayerLevel - 1) * expScalingFactor)
    );

    expOrbs.push(new ExpOrb(enemy.xPos, enemy.yPos, orbX, orbY, 10, orbExp));
  }
}

function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.moveBullet();
    bullet.drawBullet();

    // Check for collisions with enemies
    enemies.forEach((enemy) => {
      if (bullet.canCollideWith(enemy) && checkCollision(bullet, enemy)) {
        enemy.damage(bullet.damageAmount);
        bullets.splice(index, 1); // Remove bullet after collision
      }
    });

    // Check for collisions with the player
    if (bullet.canCollideWith(player) && checkCollision(bullet, player)) {
      player.damage(bullet.damageAmount);
      bullets.splice(index, 1); // Remove bullet after hitting the player
    }

    // Remove bullet after 3 bounces
    if (bullet.getBounces() >= 3) {
      bullets.splice(index, 1);
    }
  });
}

// Draw the Game Over screen
function drawGameOverScreen() {
  background(20);
  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("Game Over", WIDTH / 2, HEIGHT / 2 - 40);

  if (!restartButton) {
    restartButton = createButton("Restart");
    restartButton.style("font-family", "Courier New");
    restartButton.style("font-size", "16px");
    restartButton.style("background-color", "#000");
    restartButton.style("color", "#FFF");
    restartButton.style("border", "2px solid #FFF");
    restartButton.style("padding", "10px 20px");

    restartButton.position(WIDTH / 2 - 50, HEIGHT / 2 + 40);
    restartButton.mousePressed(() => {
      restartGame();
      restartButton.hide();
      restartButton = null;
    });
  }
}

// Show a damage overlay when the player takes damage
function showDamageIndicator() {
  if (shouldShowDamageIndicator) {
    push();
    fill(damageColor);
    rect(0, 0, WIDTH, HEIGHT);
    pop();
  }
}

// Draw the enemy count and round text at the bottom of the screen
function drawEnemyAndRoundText() {
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(16);

  text(`Enemies: ${enemies.length}`, 10, HEIGHT - 30);
  text(`Round: ${enemyMultiplier - 1}`, WIDTH - 100, HEIGHT - 30);
}

// Handle EXP orbs: move, draw, and check collisions
function handleEXPOrbs() {
  expOrbs = expOrbs.filter((orb) => {
    if (orb.isExpired()) {
      return false; // Remove expired orbs
    }

    orb.move();
    orb.draw();

    if (orb.checkCollision(player)) {
      addEXPToCurrentLevel(orb.expAmount); // Award EXP to player
      return false; // Remove orb after collection
    }

    return true; // Keep orb if not expired or collected
  });
}

// Restart the game
function restartGame() {
  player = new Player(
    20,
    20,
    0.2,
    color(29, 255, 13),
    WIDTH / 2,
    HEIGHT / 2,
    100
  );

  bullets = [];
  enemies = [];
  expOrbs = [];
  currentEXP = 0;
  currentPlayerLevel = 1;
  expToNextLevel = baseEXP;
  enemyMultiplier = 1;

  isGameOver = false;
  isGameRunning = true;

  SpawnEnemies();

  if (restartButton) {
    restartButton.hide();
    restartButton = null;
  }
}
