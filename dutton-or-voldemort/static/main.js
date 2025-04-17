// CONSTANTS

const IS_DUTTON_VALUE = "dutton";
const IS_VOLDEMORT_VALUE = "voldemort";

let CURRENT_ROUND = 0,
  LAST_ROUND = 0,
  SCORE = 0;

let SEED = [];

// VISUAL

function displayElementByClassName(className, display = true) {
  const element = document.getElementsByClassName(className)[0];
  element.style.display = display == false ? "none" : "flex";
}

function displayNextElement(display = true) {
  displayElementByClassName("round-next", display);
}

function displayActionElement(display = true) {
  displayElementByClassName("round-action", display);
}

function displayIncorrectElement(display = true) {
  displayElementByClassName("round-incorrect", display);
}

function displayCorrectElement(display = true) {
  displayElementByClassName("round-correct", display);
}

function displayRoundImage(display = true) {
  displayElementByClassName("round-image", display);
}

function displayRoundStart(display = true) {
  displayElementByClassName("round-start", display);
}

function displayHeaderScore(display = true) {
  displayElementByClassName("header-score", display);
}

function displayRoundOver(display = true) {
  displayElementByClassName("round-over", display);
}

function displayErrorElement() {
  const element = document.getElementsByClassName("container")[0];
  element.innerHTML =
    "<h1><em>Dutton or Voldemort</em> is having problems. Please refresh or just come back later. This is just a pet project I spent an hour or so on, so it is what it is. <br/><br/> - dozyhermit</h1>";

  // hack for mobile padding on error message
  element.style.padding = "2rem";
}

function setRoundImageElement(mask = true) {
  const suffix = mask === true ? "-mask" : "-unmask";
  const prefix = mask === true ? "mask" : "unmask";

  const base = `static/images/${prefix}/`;
  const roundString = CURRENT_ROUND.toString().padStart(3, "0");

  const filename = `${base}${roundString}${suffix}.jpeg`;

  const element = document.getElementsByClassName("round-image")[0];
  element.style.backgroundImage = `url("${filename}")`;
}

function setScoreElement() {
  const score = document.getElementsByClassName("round-score");

  Array.from(score).forEach((element) => {
    element.textContent = SCORE;
  });
}

function resetHeaderWordWrap() {
  const element = document.getElementsByClassName("header")[0];
  element.style.whiteSpace = "normal";
}

// FUNCTIONAL

async function setSeedJson() {
  try {
    const seed = await fetch("static/seed.json");
    const seedAsJson = await seed.json();

    if (!seedAsJson || !Array.isArray(seedAsJson) || seedAsJson.length === 0) {
      displayErrorElement();
      return;
    }

    SEED = seedAsJson;
  } catch (e) {
    displayErrorElement();
  }
}

function endRound() {
  displayRoundStart(false);
  displayHeaderScore(false);
  displayRoundImage(false);
  displayActionElement(false);
  displayNextElement(false);

  return displayRoundOver();
}

function getRound() {
  LAST_ROUND = CURRENT_ROUND;
  CURRENT_ROUND = LAST_ROUND + 1;

  // this shouldn't happen but just in case
  if (LAST_ROUND === CURRENT_ROUND && LAST_ROUND !== 0 && CURRENT_ROUND !== 0) {
    return getRound();
  }

  // end round
  if (CURRENT_ROUND >= SEED.length - 1) {
    return endRound();
  }

  // hide previous round styles
  displayIncorrectElement(false);
  displayCorrectElement(false);
  displayNextElement(false);

  // show round action and image
  displayActionElement(true);
  setRoundImageElement(true);
}

function incrementScore() {
  SCORE++;
  setScoreElement();
}

function isCorrect(answer) {
  displayNextElement();

  // hide round actions
  displayActionElement(false);
  setRoundImageElement(false);

  // if there's a problem
  if (SEED && SEED[CURRENT_ROUND] && SEED[CURRENT_ROUND].answer !== answer) {
    return displayIncorrectElement();
  }

  // increment score
  displayCorrectElement();
  incrementScore();
}

function isDutton() {
  isCorrect(IS_DUTTON_VALUE);
}

function isVoldemort() {
  isCorrect(IS_VOLDEMORT_VALUE);
}

function startRound() {
  // reset score to zero
  CURRENT_ROUND = LAST_ROUND = SCORE = 0;
  setScoreElement();

  // remove start styles
  resetHeaderWordWrap();

  displayRoundOver(false);
  displayRoundStart(false);
  displayHeaderScore(true);
  displayRoundImage(true);

  // initiate round
  getRound();
}

(() => {
  setSeedJson();
})();
