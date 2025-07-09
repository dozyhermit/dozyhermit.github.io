// CONSTANTS

// generic

const SEED_JSON_PATH = "static/seed.json";
const ERROR_MESSAGE_AS_HTML =
  "<h1><em>Dutton or Voldemort</em> is having problems. Please refresh or just come back later. This is just a pet project I spent an hour or so on, so it is what it is. <br/><br/> - dozyhermit</h1>";

// classes

const CONTAINER_CLASS = "container";

const HEADER_CLASS = "header";
const HEADER_SCORE_CLASS = "header-score";

const START_ROUND_CLASS = "round-start";
const END_ROUND_CLASS = "round-over";

const CORRECT_ROUND_CLASS = "round-correct";
const INCORRECT_ROUND_CLASS = "round-incorrect";
const NEXT_ROUND_CLASS = "round-next";

const ROUND_ACTION_CLASS = "round-action";
const ROUND_IMAGE_CLASS = "round-image";
const ROUND_SCORE_CLASS = "round-score";

const MASK_IX = "mask";
const UNMASK_IX = "unmask";

// game

const IS_DUTTON = "dutton";
const IS_VOLDEMORT = "voldemort";

let Game = {
  CurrentRound: 0,
  LastRound: 0,
  Score: 0,
  Seed: [],
};

// VISUAL

function displayElementByClassName(className, display = true) {
  const element = document.getElementsByClassName(className)[0];
  element.style.display = display == false ? "none" : "flex";
}

function displayNextElement(display = true) {
  displayElementByClassName(NEXT_ROUND_CLASS, display);
}

function displayActionElement(display = true) {
  displayElementByClassName(ROUND_ACTION_CLASS, display);
}

function displayIncorrectElement(display = true) {
  displayElementByClassName(INCORRECT_ROUND_CLASS, display);
}

function displayCorrectElement(display = true) {
  displayElementByClassName(CORRECT_ROUND_CLASS, display);
}

function displayRoundImage(display = true) {
  displayElementByClassName(ROUND_IMAGE_CLASS, display);
}

function displayRoundStart(display = true) {
  displayElementByClassName(START_ROUND_CLASS, display);
}

function displayHeaderScore(display = true) {
  displayElementByClassName(HEADER_SCORE_CLASS, display);
}

function displayRoundEnd(display = true) {
  displayElementByClassName(END_ROUND_CLASS, display);
}

function displayErrorElement() {
  const element = document.getElementsByClassName(CONTAINER_CLASS)[0];
  element.innerHTML = ERROR_MESSAGE_AS_HTML;

  // for better mobile padding for the error message
  element.style.padding = "2rem";
}

function setRoundImageElement(mask = true) {
  const suffix = mask === true ? `-${MASK_IX}` : `-${UNMASK_IX}`;
  const prefix = mask === true ? MASK_IX : UNMASK_IX;

  const base = `static/images/${prefix}/`;
  const roundString = Game.CurrentRound.toString().padStart(3, "0");

  const filename = `${base}${roundString}${suffix}.jpeg`;

  const element = document.getElementsByClassName(ROUND_IMAGE_CLASS)[0];
  element.style.backgroundImage = `url("${filename}")`;
}

function setScoreElement() {
  const score = document.getElementsByClassName(ROUND_SCORE_CLASS);

  Array.from(score).forEach((element) => {
    element.textContent = Game.Score;
  });
}

function resetHeaderWordWrap() {
  const element = document.getElementsByClassName(HEADER_CLASS)[0];
  element.style.whiteSpace = "normal";
}

// FUNCTIONAL

async function setSeedJson() {
  try {
    const result = await fetch(SEED_JSON_PATH);
    const seed = await result.json();

    if (!seed || !Array.isArray(seed) || seed.length === 0) {
      displayErrorElement();
      return;
    }

    Game.Seed = seed;
  } catch (e) {
    displayErrorElement();
  }
}

function endRound() {
  displayActionElement(false);
  displayHeaderScore(false);
  displayNextElement(false);
  displayRoundImage(false);
  displayRoundStart(false);

  return displayRoundEnd();
}

function getRound() {
  Game.LastRound = Game.CurrentRound;
  Game.CurrentRound = Game.LastRound + 1;

  // this shouldn't happen but just in case
  // things fall out of order
  if (
    Game.LastRound === Game.CurrentRound &&
    Game.LastRound !== 0 &&
    Game.CurrentRound !== 0
  ) {
    return getRound();
  }

  if (Game.CurrentRound >= Game.Seed.length - 1) {
    return endRound();
  }

  displayCorrectElement(false);
  displayIncorrectElement(false);
  displayNextElement(false);

  displayActionElement(true);
  setRoundImageElement(true);
}

function incrementScore() {
  Game.Score++;
  setScoreElement();
}

function isCorrect(value) {
  displayNextElement();

  displayActionElement(false);
  setRoundImageElement(false);

  if (
    Game.Seed &&
    Game.Seed[Game.CurrentRound] &&
    Game.Seed[Game.CurrentRound].answer !== value
  ) {
    return displayIncorrectElement();
  }

  displayCorrectElement();
  incrementScore();
}

function isDutton() {
  isCorrect(IS_DUTTON);
}

function isVoldemort() {
  isCorrect(IS_VOLDEMORT);
}

function startRound() {
  Game.CurrentRound = Game.LastRound = Game.Score = 0;
  setScoreElement();

  resetHeaderWordWrap();

  displayRoundEnd(false);
  displayRoundStart(false);
  displayHeaderScore(true);
  displayRoundImage(true);

  getRound();
}

(() => {
  setSeedJson();
})();
