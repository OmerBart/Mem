/*Selectors*/
const elAllCards = document.querySelectorAll(".card");
const playBtn = document.querySelector("#play-game");
const playAgainContainer = document.querySelector(".play-again-container");
const pickModeContainer = document.querySelector(".pick-mode-container");

const elGameModeSpan = document.querySelector("#game-mode");

const elNameSpan = document.querySelector("#name");
const elTimeSpan = document.querySelector("#time");
const elBestScoreSpan = document.querySelector("#score");
const elWorstScoreSpan = document.querySelector("#worst-score");

/*Load music*/
const correctAudio = new Audio("sound/right.mp3");
const wrongAudio = new Audio("sound/wrong.mp3");
const winAudio = new Audio("sound/win.mp3");

//Number of card pairs
let TOTAL_CARD_PAIRS = 6;
let elPrevCard = null;
let flippedCards = 0;
//Control that only 2 cards can be flipped
let isCardProcessing = false;
//count seconds
let counter = 0;
let isGameStarted = false;
//interval for the timer
let interval = null;
//game mode
let gameMode = null;

elAllCards.forEach((card) => {
  card.style.display = "none";
});

function cardClicked(elCard) {
  //Check if card is still flipped
  if (isCardProcessing) return;
  //Check if card is flipped, if it is i dont want to let the users to click on this card again
  if (elCard.classList.contains("flipped")) return;

  elCard.classList.add("flipped");
  if (elPrevCard === null) {
    //start the clock when the user clicks on the first card
    if (!isGameStarted) {
      isGameStarted = true;
      //Start the timer
      interval = setInterval(stopWatch, 10);
    }
    console.log("first card");
    elPrevCard = elCard;
    //Todo: Timer starts
  } else {
    console.log("second card");
    checkCardsMatch(elPrevCard, elCard);
    //rest the prevCard back to null;
    elPrevCard = null;
  }
}

//Check if cards match and victory
function checkCardsMatch(card1, card2) {
  let firstCard = +card1.getAttribute("data-card");
  let secondCard = +card2.getAttribute("data-card");
  //if the cards data-card matches
  if (firstCard === secondCard) {
    console.log("cards match");
    flippedCards++;
    //add to both cards a 'found' class if they have been found in order to know that i dont need to flip them back in cheat mode.
    card1.classList.add("found");
    card2.classList.add("found");
    if (flippedCards !== TOTAL_CARD_PAIRS) {
      correctAudio.play();
    }
    if (flippedCards === TOTAL_CARD_PAIRS) {
      console.log("You won!");
      winAudio.play();
      //Show restart game container
      playAgainContainer.classList.add("show");
    }
  } else {
    wrongAudio.play();
    //as long as this var is true we can't click on other cards
    isCardProcessing = true;
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      //only after we remove the flipped class from both cards set this var to be false and then user can click on cards again
      isCardProcessing = false;
    }, 1500);
  }
}

//this function rest all the neccessary things of the game
function restartGame() {
  //Shuffle the cards
  shuffleCards();
  //Flip all the cards back and remove the found class from all
  elAllCards.forEach((card) => {
    card.classList.remove("flipped");
    card.classList.remove("found");
  });
  //rest flipped cards
  flippedCards = 0;
  //remove restart popup
  playAgainContainer.classList.remove("show");
  //set the game back to false
  isGameStarted = false;
  //update game stats
  gameStats(counter);
  counter = 0;
  //Rest the timer variables
  elTimeSpan.innerText = `Click a card to start`;
  seconds = 0;
  minutes = 0;
  hours = 0;
  miliSeconds = 0;
  formatted = null;
  //Restart cheat feature
  isCheated = false;
  //show pick mode container
  pickModeContainer.classList.add("show");
}

//set score and get stats from localStorage
function gameStats(score) {
  //format the counter to time format 00:00:00
  let formatted = formatCounterToTime(score);
  switch (gameMode) {
    case 1:
      if (localStorage.getItem("bestScoreHard") === null) {
        localStorage.setItem("bestScoreHard", score);
        elBestScoreSpan.innerText = `${formatted}`;
      }
      const currHardScore = localStorage.getItem("bestScoreHard");
      //check if the score is better than the currentHardScore that in storage
      if (score < currHardScore) {
        //set a new best score for the hard mode
        localStorage.setItem("bestScoreHard", score);
        elBestScoreSpan.innerText = `${formatted}`;
      } else {
        //check if there is already a worst score in easy mode, if not set one
        if (localStorage.getItem("worstScoreHard") === null) {
          localStorage.setItem("worstScoreHard", score);
          elWorstScoreSpan.innerText = `${formatted}`;
        }
        let currWorstScoreHard = localStorage.getItem("worstScoreHard");
        //check if the score is greater than the current worst score, if so we have a new worst score.
        if (score > currWorstScoreHard) {
          localStorage.setItem("worstScoreHard", score);
          elWorstScoreSpan.innerText = `${formatted}`;
        }
      }
      break;
    case 2:
      if (localStorage.getItem("bestScoreMedium") === null) {
        localStorage.setItem("bestScoreMedium", score);
        elBestScoreSpan.innerText = `${formatted}`;
      }
      const currMediumScore = localStorage.getItem("bestScoreMedium");
      if (score < currMediumScore) {
        //set a new best score for the hard mode
        localStorage.setItem("bestScoreMedium", score);
        elBestScoreSpan.innerText = `${formatted}`;
      } else {
        if (localStorage.getItem("worstScoreMedium") === null) {
          localStorage.setItem("worstScoreMedium", score);
          elWorstScoreSpan.innerText = `${formatted}`;
        }
        let currWorstScoreMedium = localStorage.getItem("worstScoreMedium");
        if (score > currWorstScoreMedium) {
          localStorage.setItem("worstScoreMedium", score);
          elWorstScoreSpan.innerText = `${formatted}`;
        }
      }
      break;
    case 3:
      if (localStorage.getItem("bestScoreEasy") === null) {
        localStorage.setItem("bestScoreEasy", score);
        elBestScoreSpan.innerText = `${formatted}`;
      }
      const currEasyScore = localStorage.getItem("bestScoreEasy");
      //if the score is greater than the current hard score there is a new best score
      if (score < currEasyScore) {
        localStorage.setItem("bestScoreEasy", score);
        elBestScoreSpan.innerText = `${formatted}`;
      } else {
        //check if there is already a worst score in easy mode, if not set one
        if (localStorage.getItem("worstScoreEasy") === null) {
          localStorage.setItem("worstScoreEasy", score);
          elWorstScoreSpan.innerText = `${formatted}`;
        }
        let currWorstScoreEasy = localStorage.getItem("worstScoreEasy");
        //check if the score is greater than the current worst score, if so we have a new worst score.
        if (score > currWorstScoreEasy) {
          localStorage.setItem("worstScoreEasy", score);
          elWorstScoreSpan.innerText = `${formatted}`;
        }
      }
      break;
  }
}

//I have a counter, this function format seconds to hours/minutues/seconds nicely in order to display best score/worst score
function formatCounterToTime(time) {
  let minutes = Math.floor(time / 60);
  let hours = Math.floor(time / 3600);
  let seconds = time - minutes * 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  return `${hours}:${minutes}:${seconds}`;
}

function changeUser() {
  let name = prompt(`Please Enter your name`);
  if (!name) {
    name = "Anonymous";
  }
  localStorage.setItem("name", name);
  elNameSpan.innerText = `${
    name !== null
      ? `Welcome, ${localStorage.getItem("name")} 😜 !`
      : `Welcome,Anonymous! 💀`
  }`;
}

//load data from localStorage when page refreshes
function getLocalStorageData() {
  let user = localStorage.getItem("name");
  elNameSpan.innerText = `${
    user === null || user === ""
      ? "Welcome Anonymous User!"
      : `Welcome, ${user} 😜!`
  }`;

  // //Show the current Best score and the current Worst score based on the game MODE!
  // switch (gameMode) {
  //   case 1:
  //     let hardBestScore = formatCounterToTime(
  //       localStorage.getItem('bestScoreHard')
  //     );
  //     elBestScoreSpan.innerText = `${
  //       !hardBestScore === null ? 'None' : `${hardBestScore}`
  //     }`;
  //     let worstScoreHard = formatCounterToTime(
  //       localStorage.getItem('worstScoreHard')
  //     );
  //     elWorstScoreSpan.innerText = `${
  //       worstScoreHard === null ? 'None' : `${worstScoreHard}`
  //     }`;
  //     break;
  //   case 2:
  //     let mediumBestScore = formatCounterToTime(
  //       localStorage.getItem('bestScoreMedium')
  //     );
  //     elBestScoreSpan.innerText = `${
  //       mediumBestScore === null ? 'None' : `${mediumBestScore}`
  //     }`;
  //     let mediumWorstScore = formatCounterToTime(
  //       localStorage.getItem('worstScoreMedium')
  //     );
  //     elWorstScoreSpan.innerText = `${
  //       mediumWorstScore === null ? 'None' : `${mediumWorstScore}`
  //     }`;
  //     break;
  //   case 3:
  //     let easyBestScore = formatCounterToTime(
  //       localStorage.getItem('bestScoreEasy')
  //     );
  //     elBestScoreSpan.innerText = `${
  //       easyBestScore === null ? 'None' : `${easyBestScore}`
  //     }`;
  //     let easyWorstScore = formatCounterToTime(
  //       localStorage.getItem('worstScoreEasy')
  //     );
  //     elWorstScoreSpan.innerText = `${
  //       easyWorstScore === null ? 'None' : `${easyWorstScore}`
  //     }`;
  //     break;
}

//check if we already have a name, if not we get the user name
if (localStorage.getItem("name") === null) {
  pickModeContainer.classList.add("show");
  changeUser();
}

/*Shuffle all Cards in random positions!*/
function shuffleCards() {
  elAllCards.forEach((card) => {
    //generate a random num
    let randPosition = Math.floor(Math.random() * elAllCards.length);
    card.style.order = `${randPosition}`;
  });
}

//Stopwatch variables
let miliSeconds = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;
function stopWatch() {
  //check if i flipped all cards, if so we stop the clock
  if (flippedCards === TOTAL_CARD_PAIRS) {
    clearInterval(interval);
    console.log("interval cleaned");
  }
  miliSeconds += 10;
  if (miliSeconds >= 1000) {
    miliSeconds = 0;
    counter++;
    console.log("counter is", counter);
    seconds++;
    //if seconds /60 is 1 then rest seconds
    if (seconds / 60 === 1) {
      seconds = 0;
      //start increment minutes
      minutes++;
      //if minutes / 60 is 1 then minutes also rest
      if (minutes / 60 === 1) {
        minutes = 0;
        hours++;
      }
    }
  }
  //add a leading 0 if seconds/minutes/hours is a 1 digit
  let displayMiliSeconds = `${
    miliSeconds > 90 ? miliSeconds : `0${miliSeconds}`
  }`;
  let displaySeconds = `${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
  let displayMinutes = `${minutes < 10 ? `0${minutes}` : `${minutes}`}`;
  let displayHours = `${hours < 10 ? `0${hours}` : `${hours}`}`;

  //Display the stopwatch
  elTimeSpan.innerText = `${displayHours}:${displayMinutes}:${displaySeconds}.${displayMiliSeconds}`;
}
function timer() {
  //check if i flipped all cards, if so we stop the clock
  if (flippedCards === TOTAL_CARD_PAIRS) {
    clearInterval(interval);
    console.log("interval cleaned");
  }
  miliSeconds -= 10;
  if (miliSeconds <= 10) {
    miliSeconds = 990;
    counter--;
    console.log("counter is", counter);
    seconds--;
    //if seconds /60 is 1 then rest seconds
    if (seconds === 0) {
      seconds = 60;
      //start increment minutes
      minutes--;
      //if minutes / 60 is 1 then minutes also rest
      if (minutes === 0) {
        if (hours === 1) {
          minutes = 60;
          hours = 0;
        }
        else if (hours > 0) {
          hours--;
        }

      }
    }
  }
  //add a leading 0 if seconds/minutes/hours is a 1 digit
  let displayMiliSeconds = `${miliSeconds > 90 ? miliSeconds : `0${miliSeconds}`
  }`;
  let displaySeconds = `${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
  let displayMinutes = `${minutes < 10 ? `0${minutes}` : `${minutes}`}`;
  let displayHours = `${hours < 10 ? `0${hours}` : `${hours}`}`;

  //Display the stopwatch
  elTimeSpan.innerText = `${displayHours}:${displayMinutes}:${displaySeconds}.${displayMiliSeconds}`;
}

//Show the cards for a X amount of seconds in the beginning when we pick a mode.
function showCards(amountOfSeconds) {
  elAllCards.forEach((card) => {
    card.classList.add("flipped");
  });
  setTimeout(() => {
    elAllCards.forEach((card) => {
      card.classList.remove("flipped");
    });
  }, amountOfSeconds);
}

//This function handles the cheat feature
let isCheated = false;
function cheat(btn) {
  console.log(btn);
  console.log("You can cheat 1 time");
  if (!isGameStarted) {
    alert("You can cheat only when game begins");
    return;
  }
  //if the user didnt clicked on the cheat btn flip the cards for a little
  if (!isCheated) {
    isCheated = true;
    //fix the issue that the user can click again on the btn and because of the alert he can see the cards for a long time until he press ok;
    btn.disabled = true;
    elAllCards.forEach((card) => {
      //check if the card is not flipped, if not then we flip it
      if (!card.classList.contains("flipped")) {
        card.classList.add("flipped");
      }
      setTimeout(() => {
        btn.disabled = false;
        elAllCards.forEach((card) => {
          //if the card not contains a found class it means this class isn't found yet, and we remove it!
          if (!card.classList.contains("found")) {
            //if we cheat and we a card already flipped i want this card to stay flipped
            if (elPrevCard !== null) {
              elPrevCard.classList.add("flipped");
            }
            card.classList.remove("flipped");
          }
        });
      }, 1000);
    });
  } else {
    alert("You already used this feature  😭");
    return;
  }
}

//Pick a game mode
function pickMode(btn) {
  console.log(btn.id);
  switch (btn.id) {
    case "large":
      gameMode = 1;
      TOTAL_CARD_PAIRS = 10;
      //show current game-mode
      elGameModeSpan.innerText = `Hard`;
      elBestScoreSpan.innerText = formatCounterToTime(
        localStorage.getItem("bestScoreHard")
      );
      elWorstScoreSpan.innerText = formatCounterToTime(
        localStorage.getItem("worstScoreHard")
      );
      showCards(5000);
      //Show the cards for x amount of seconds
      elAllCards.forEach((card) => {
        let dataCard = card.getAttribute("data-card");
        let possibleCards = "12345678910";
        if (possibleCards.includes(dataCard)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
        if (
          card.classList.contains("medium-mode") ||
          card.classList.contains("small-mode")
        ) {
          card.classList.remove("medium-mode");
          card.classList.remove("small-mode");
        }
        card.classList.add("large-mode");
        pickModeContainer.classList.remove("show");
      });
      break;
    case "medium":
      TOTAL_CARD_PAIRS = 6;
      gameMode = 2;
      elGameModeSpan.innerText = `Medium`;
      elBestScoreSpan.innerText = formatCounterToTime(
        localStorage.getItem("bestScoreMedium")
      );
      elWorstScoreSpan.innerText = formatCounterToTime(
        localStorage.getItem("worstScoreMedium")
      );
      showCards(3000);
      elAllCards.forEach((card) => {
        let dataCard = card.getAttribute("data-card");
        let possibleCards = "123456";
        if (possibleCards.includes(dataCard)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
        if (
          card.classList.contains("large-mode") ||
          card.classList.contains("small-mode")
        ) {
          card.classList.remove("large-mode");
          card.classList.remove("small-mode");
        }
        card.classList.add("medium-mode");
        pickModeContainer.classList.remove("show");
      });
      break;
    case "small":
      gameMode = 3;
      TOTAL_CARD_PAIRS = 4;
      elGameModeSpan.innerText = `Easy`;
      elBestScoreSpan.innerText = formatCounterToTime(
        localStorage.getItem("bestScoreEasy")
      );
      elWorstScoreSpan.innerText = formatCounterToTime(
        localStorage.getItem("worstScoreEasy")
      );
      showCards(1500);
      elAllCards.forEach((card) => {
        let dataCard = card.getAttribute("data-card");
        let possibleCards = "1234";
        if (possibleCards.includes(dataCard)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
        if (
          card.classList.contains("large-mode") ||
          card.classList.contains("medium-mode")
        ) {
          card.classList.remove("large-mode");
          card.classList.remove("medium-mode");
        }
        card.classList.add("small-mode");
        pickModeContainer.classList.remove("show");
      });
      break;
    case "countdown":

      gameMode = 4;
      TOTAL_CARD_PAIRS = 15
      let countDownTime = prompt(`Please Enter your time in seconds`);
        if (countDownTime === null) {
            alert("Please enter a number");
            return;
        }
        if (countDownTime === "") {
            alert("Please enter a number");
            return;
        }
        //take input seconds and calcuate how many hours and minutes and seconds the user entered

      elGameModeSpan.innerText = `Harder`;
      elBestScoreSpan.innerText = formatCounterToTime(
          localStorage.getItem("bestScoreHard")
      );
      elWorstScoreSpan.innerText = formatCounterToTime(
          localStorage.getItem("worstScoreHard")
      );
      showCards(1500);
      elAllCards.forEach((card) => {
        let dataCard = card.getAttribute("data-card");
        let possibleCards = "123456789101112131415";
        if (possibleCards.includes(dataCard)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
        if (
            card.classList.contains("medium-mode") ||
            card.classList.contains("small-mode") ||
            card.classList.contains("large-mode")
        ) {
          card.classList.remove("large-mode");
          card.classList.remove("medium-mode");
          card.classList.remove("small-mode");
        }
        card.classList.add("large-mode");
        pickModeContainer.classList.remove("show");
      });
        break;
  }
}

//Load data from localStorage
document.addEventListener("DOMContentLoaded", getLocalStorageData);
//show mode
pickModeContainer.classList.add("show");
shuffleCards();
