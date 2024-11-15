currentIndexToShow = 1;

textToShow = "Press any key to start..."

let shouldShowLine = false;

let increaseIndexInterval;
let showLineInterval;

let isInteractPromptBeingShown = true;

function setUpPrompt() {
    textFont("CourierNew");
    textSize(32);
    textAlign(CENTER, CENTER);
    noStroke();
    increaseIndexInterval = setInterval(() => {
        currentIndexToShow++
    }, 75);
    showLineInterval = setInterval(() => {
        shouldShowLine = !shouldShowLine;
    }, 500);
}

function promptToInteract() {
    background(45, 45, 45);

    fill(255);
    text(`${textToShow.slice(0, currentIndexToShow)}${shouldShowLine ? "|" : ""}`, width / 2, height / 2);
}

function keyPressed() {
    if (!isInteractPromptBeingShown) return;
    clearInterval(increaseIndexInterval);
    clearInterval(showLineInterval);
    hasPlayerInteracted = true;
    mainMenuMusic.loop();
    mainMenuMusic.play();
    isInteractPromptBeingShown = false;
}