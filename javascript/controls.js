let button;

function setupControls() {
  textFont("Courier New");
  textSize(16);
  textAlign(CENTER, CENTER);

  button = createButton("Start Game");
  button.style("font-family", "Courier New");
  button.style("font-size", "16px");
  button.style("background-color", "#000");
  button.style("color", "#FFF");
  button.style("border", "2px solid #FFF");
  button.style("padding", "10px 20px");

  button.mousePressed(startGame);
  haveControlsBeenSetup = true;
  showControlsMenu = true;
}

function displayControls() {
  background(45, 45, 45);
  fill(255);
  text("Controls:", width / 2, height / 2 - 100);
  text("Move: WASD or Arrow Keys", width / 2, height / 2 - 50);
  text("Shoot: Left Click", width / 2, height / 2);

  const buttonWidth = button.elt.offsetWidth;
  const buttonHeight = button.elt.offsetHeight;
  button.position(
    width / 2 - buttonWidth / 2,
    height / 2 + 60 - buttonHeight / 2
  );
  button.show();
}

function startGame() {
  if (mainMenuMusic) {
    mainMenuMusic.stop();
  } else {
    console.warn("Main menu music is not loaded.");
  }

  showControlsMenu = false;
  button.hide();

  player = new Player(
    20,
    20,
    0.2,
    color(29, 255, 13),
    WIDTH / 2,
    HEIGHT / 2,
    100
  );
  SpawnEnemies();

  isGameRunning = true;
}
