let currentPlayerLevel = 1;
let currentEXP = 0;
let baseEXP = 100;
let expToNextLevel = baseEXP;

let basePlayerSpeed = 0.2;
let playerSpeedIncrement = 0.03;
let playerBaseDamage = 30;

const GROWTH_FACTOR_EXP = 1.5;
const GROWTH_FACTOR_DAMAGE = 0.75;

let displayedEXP = 0; // Smoothly animates the EXP display

// Level-up logic
const levelUp = () => {
  console.log(`Level Up! New Level: ${currentPlayerLevel}`);
  currentPlayerLevel += 1;
  currentEXP = 0;

  // Scale EXP
  expToNextLevel = baseEXP * Math.pow(currentPlayerLevel, GROWTH_FACTOR_EXP);

  // Update stats (ensure bullet damage does not decrease)
  player.speed = basePlayerSpeed + currentPlayerLevel * playerSpeedIncrement;

  // Fix bullet damage to always increase or remain constant
  const damageIncrement = 5; // Increase damage by a fixed amount per level
  player.bulletDamage = Math.max(
    playerBaseDamage,
    playerBaseDamage + (currentPlayerLevel - 1) * damageIncrement
  );

  // Debugging info
  console.log(`EXP to Next Level: ${expToNextLevel}`);
  console.log(`Player Speed: ${player.speed}`);
  console.log(`Bullet Damage: ${player.bulletDamage}`);
};

// Add EXP logic
const addEXPToCurrentLevel = (expToAdd) => {
  currentEXP += expToAdd;

  // Handle multiple level-ups
  while (currentEXP >= expToNextLevel) {
    currentEXP -= expToNextLevel; // Carry over excess EXP
    levelUp();
  }
};

// p5.js draw function
function drawEXPBar() {
  let barWidth = 400;
  let barHeight = 30;
  let barX = (WIDTH - barWidth) / 2;
  let barY = 10;

  // Smoothly update the displayed EXP
  displayedEXP = lerp(displayedEXP, currentEXP, 0.1);

  // Calculate progress
  let progress = displayedEXP / expToNextLevel;

  // Get the bar color based on progress
  let barColor = getBarColor(progress);

  // Draw the outer bar
  fill(50);
  rect(barX, barY, barWidth, barHeight);

  // Draw the inner progress bar with dynamic color
  fill(barColor);
  rect(barX, barY, barWidth * progress, barHeight);

  // Draw text
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(16);
  text(
    `${Math.floor(displayedEXP)}/${Math.floor(expToNextLevel)}`,
    barX - 80,
    barY + barHeight / 2
  );

  textAlign(RIGHT, CENTER);
  text(
    `Level: ${currentPlayerLevel}`,
    barX + barWidth + 80,
    barY + barHeight / 2
  );
}

function getBarColor(progress) {
  let r, g, b;

  if (progress < 0.33) {
    // Red to Orange
    r = 255;
    g = map(progress, 0, 0.33, 0, 165); // Green increases
    b = 0;
  } else if (progress < 0.66) {
    // Orange to Yellow
    r = 255;
    g = 165 + map(progress, 0.33, 0.66, 0, 90); // Green increases
    b = 0;
  } else {
    // Yellow to Green
    r = map(progress, 0.66, 1, 255, 0); // Red decreases
    g = 255;
    b = 0;
  }

  return color(r, g, b);
}
