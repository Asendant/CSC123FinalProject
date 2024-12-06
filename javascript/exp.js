let currentPlayerLevel = 1;
let currentEXP = 0;
let baseEXP = 100;
let expToNextLevel = baseEXP;

let basePlayerSpeed = 0.2;
let playerSpeedIncrement = 0.03;
let playerBaseDamage = 30;

const GROWTH_FACTOR_EXP = 1.5;

let displayedEXP = 0;
let levelUpMessageTimer = 0; // Timer for "Level Up!" message
let glowIntensity = 0; // Glow effect intensity for the EXP bar

// Particle system variables
let particles = [];

const levelUp = () => {
  currentPlayerLevel++;
  currentEXP = 0;

  expToNextLevel = baseEXP * Math.pow(currentPlayerLevel, GROWTH_FACTOR_EXP);

  player.speed = basePlayerSpeed + currentPlayerLevel * playerSpeedIncrement;
  player.bulletDamage = playerBaseDamage + (currentPlayerLevel - 1) * 5; // Bullet damage scales positively

  // Start level-up visuals
  levelUpMessageTimer = 150; // Display message for 150 frames
  glowIntensity = 255; // Set max glow intensity

  // Add particles
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(WIDTH / 2, HEIGHT / 2));
  }

  // Play level-up sound
  if (levelUpSound) {
    levelUpSound.play();
  }

  console.log(`Level Up! New Level: ${currentPlayerLevel}`);
};

const addEXPToCurrentLevel = (expToAdd) => {
  currentEXP += expToAdd;

  // Play EXP orb sound
  if (expOrbSound) {
    const pitch = random(1.8, 2.0); // Slight pitch variation
    expOrbSound.rate(pitch);
    expOrbSound.play();
  }

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

  // EXP Bar Background
  fill(50);
  rect(barX, barY, barWidth, barHeight);

  // EXP Bar Fill with Glow
  fill(getBarColor(progress));
  drawingContext.shadowBlur = glowIntensity;
  drawingContext.shadowColor = color(255, 255, 0);
  rect(barX, barY, barWidth * progress, barHeight);
  drawingContext.shadowBlur = 0; // Reset shadow blur

  // EXP Bar Text
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

  // Level-Up Message
  if (levelUpMessageTimer > 0) {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255, 255, 0);
    text("Level Up!", WIDTH / 2, HEIGHT / 2 - 50);
    levelUpMessageTimer--;
    glowIntensity = max(0, glowIntensity - 5); // Gradually fade the glow
  }

  pop();

  // Update and draw particles
  particles = particles.filter((particle) => !particle.isDone());
  particles.forEach((particle) => particle.updateAndDraw());
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

// Particle class for level-up effects
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.life = 100;
    this.color = color(random(200, 255), random(200, 255), random(50, 150));
  }

  updateAndDraw() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    push();
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.life);
    ellipse(this.x, this.y, 10);
    pop();
  }

  isDone() {
    return this.life <= 0;
  }
}
