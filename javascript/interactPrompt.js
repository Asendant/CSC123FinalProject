let currentIndexToShow = 1;
let textToShow = "Press any key to start...";
let shouldShowLine = false;
let increaseIndexInterval;
let showLineInterval;
let isInteractPromptBeingShown = true;

function setUpPrompt() {
  textFont("Courier New");
  textSize(32);
  textAlign(CENTER, CENTER);
  noStroke();

  // Typing animation for text
  increaseIndexInterval = setInterval(() => {
    if (currentIndexToShow < textToShow.length) {
      currentIndexToShow++;
    } else {
      clearInterval(increaseIndexInterval); // Stop incrementing when complete
    }
  }, 75);

  // Blinking line animation
  showLineInterval = setInterval(() => {
    shouldShowLine = !shouldShowLine;
  }, 500);
}

function promptToInteract() {
  background(45, 45, 45);
  fill(255);

  // Render the text with a blinking cursor effect
  const displayText = `${textToShow.slice(0, currentIndexToShow)}${
    shouldShowLine ? "|" : ""
  }`;
  text(displayText, width / 2, height / 2);
}

function keyPressed() {
  if (isInteractPromptBeingShown) {
    // Clear intervals to avoid lingering animations
    clearInterval(increaseIndexInterval);
    clearInterval(showLineInterval);

    // Transition to the main game
    isInteractPromptBeingShown = false;
    hasPlayerInteracted = true;

    mainMenuMusic.loop();
    mainMenuMusic.play();
  }
}
