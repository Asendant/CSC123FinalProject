let button;

function setupControls() {
  textFont("Courier New"); // Retro-style font
  textSize(16); // Adjust for a pixel-art style
  textAlign(CENTER, CENTER); // Center text
  noStroke(); // Initially remove the stroke for the retro style

  // Create the button
  button = createButton("Start Game");
  button.style("font-family", "Courier New");
  button.style("font-size", "16px");
  button.style("background-color", "#000");
  button.style("color", "#FFF");
  button.style("border", "2px solid #FFF");
  button.style("padding", "10px 20px");

  // Set the button to center position in window
  button.mousePressed(startGame); // Attach the function
}

function displayControls() {
  background(45, 45, 45);

  // Display the controls text
  fill(255); // White text color
  text("Controls:", width / 2, height / 2 - 100);
  text("Move: WASD or Up/Down/Left/Right Arrows", width / 2, height / 2 - 50);
  text("Shoot: Left Click", width / 2, height / 2);

  // Dynamically center the button
  const buttonWidth = button.elt.offsetWidth; // Get actual button width
  const buttonHeight = button.elt.offsetHeight; // Get actual button height
  button.position(
    width / 2 - buttonWidth / 2,
    height / 2 + 60 - buttonHeight / 2
  );
  button.show();
}

function startGame() {
  isGameRunning = true;
  showControlsMenu = false;
  button.hide(); // Hide the button once clicked

  stroke(0); // Add the stroke back when the button is clicked
  strokeWeight(1); // Adjust stroke weight if necessary
}
