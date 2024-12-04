let currentPlayerLevel = 1;
let currentEXP = 0;
let baseEXP = 100;
let expToNextLevel = baseEXP;

let basePlayerSpeed = 0.2;
let playerSpeedIncrement = 0.03;
let playerBaseDamage = 30;

const GROWTH_FACTOR_EXP = 1.5;

let displayedEXP = 0;

const levelUp = () => {
  currentPlayerLevel++;
  currentEXP = 0;

  expToNextLevel = baseEXP * Math.pow(currentPlayerLevel, GROWTH_FACTOR_EXP);

  player.speed = basePlayerSpeed + currentPlayerLevel * playerSpeedIncrement;
  player.bulletDamage = playerBaseDamage + (currentPlayerLevel - 1) * 5; // Bullet damage scales positively

  console.log(`Level Up! New Level: ${currentPlayerLevel}`);
};

const addEXPToCurrentLevel = (expToAdd) => {
  currentEXP += expToAdd;

  while (currentEXP >= expToNextLevel) {
    currentEXP -= expToNextLevel;
    levelUp();
  }
};

function drawEXPBar() {
  const barWidth = 400;
  const barHeight = 30;
  const barX = (WIDTH - barWidth) / 2;
  const barY = 10;

  displayedEXP = lerp(displayedEXP, currentEXP, 0.1);

  const progress = displayedEXP / expToNextLevel;

  push();
  fill(50);
  rect(barX, barY, barWidth, barHeight);

  fill(getBarColor(progress));
  rect(barX, barY, barWidth * progress, barHeight);

  fill(255);
  textSize(16);
  textAlign(LEFT, CENTER);
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
  pop();
}

function getBarColor(progress) {
  let r, g, b;
  if (progress < 0.33) {
    r = 255;
    g = map(progress, 0, 0.33, 0, 165);
    b = 0;
  } else if (progress < 0.66) {
    r = 255;
    g = 165 + map(progress, 0.33, 0.66, 0, 90);
    b = 0;
  } else {
    r = map(progress, 0.66, 1, 255, 0);
    g = 255;
    b = 0;
  }
  return color(r, g, b);
}
