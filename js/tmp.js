// Selectors
const $allCards = $(".card");
const $playBtn = $("#play-game");
const $playAgainContainer = $(".play-again-container");
const $pickModeContainer = $(".pick-mode-container");

const $gameModeSpan = $("#game-mode");

const $nameSpan = $("#name");
const $timeSpan = $("#time");
const $bestScoreSpan = $("#score");
const $worstScoreSpan = $("#worst-score");

// Load music
const correctAudio = new Audio("sound/right.mp3");
const wrongAudio = new Audio("sound/wrong.mp3");
const winAudio = new Audio("sound/win.mp3");

// Number of card pairs
let TOTAL_CARD_PAIRS = 6;
let $prevCard = null;
let flippedCards = 0;
// Control that only 2 cards can be flipped
let isCardProcessing = false;
// count seconds
let counter = 0;
let isGameStarted = false;
// interval for the timer
let interval = null;
// game mode
let gameMode = null;

$allCards.css("display", "none");

function cardClicked($card) {
    if (isCardProcessing) return;
    if ($card.hasClass("flipped")) return;

    $card.addClass("flipped");
    if (!$prevCard) {
        if (!isGameStarted) {
            isGameStarted = true;
            interval = setInterval(stopWatch, 10);
        }
        console.log("first card");
        $prevCard = $card;
    } else {
        console.log("second card");
        checkCardsMatch($prevCard, $card);
        $prevCard = null;
    }
}

function checkCardsMatch($card1, $card2) {
    let firstCard = +$card1.attr("data-card");
    let secondCard = +$card2.attr("data-card");
    if (firstCard === secondCard) {
        console.log("cards match");
        flippedCards++;
        $card1.addClass("found");
        $card2.addClass("found");
        if (flippedCards !== TOTAL_CARD_PAIRS) {
            correctAudio.play();
        }
        if (flippedCards === TOTAL_CARD_PAIRS) {
            console.log("You won!");
            winAudio.play();
            $playAgainContainer.addClass("show");
        }
    } else {
        wrongAudio.play();
        isCardProcessing = true;
        setTimeout(() => {
            $card1.removeClass("flipped");
            $card2.removeClass("flipped");
            isCardProcessing = false;
        }, 1500);
    }
}

function restartGame() {
    shuffleCards();
    $allCards.removeClass("flipped found");
    flippedCards = 0;
    $playAgainContainer.removeClass("show");
    isGameStarted = false;
    gameStats(counter);
    counter = 0;
    $timeSpan.text("Click a card to start");
    $pickModeContainer.addClass("show");
}

function gameStats(score) {
    // Function content...

}

function formatCounterToTime(time) {
    // Function content

}

function changeUser() {
    let name = prompt(`Please Enter your name`);
    if (!name) {
        name = "Anonymous";
    }
    localStorage.setItem("name", name);
    $nameSpan.text(name !== null
        ? `Welcome, ${localStorage.getItem("name")} 😜 !`
        : `Welcome,Anonymous! 💀`
    );
}

if (localStorage.getItem("name") === null) {
    $pickModeContainer.addClass("show");
    changeUser();
}

function shuffleCards() {
    $allCards.each((i, card) => {
        let randPosition = Math.floor(Math.random() * $allCards.length);
        $(card).css("order", randPosition);
    });
}

function stopWatch() {
    // Function content...
}

function pickGameMode(mode) {
    // Function content...
}

// Attaching event listeners
$playBtn.click(restartGame);
$allCards.click((e) => cardClicked($(e.target)));
let miliSeconds = 0;
let seconds = 30;
let minutes = 1;
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
            if (minutes / 60 === 1) {
                minutes = 0;
                hours++;
            }
        }
    }

    let displayMiliSeconds = miliSeconds > 90 ? miliSeconds : `0${miliSeconds}`;
    let displaySeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    let displayMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    let displayHours = hours < 10 ? `0${hours}` : `${hours}`;

    $timeSpan.text(`${displayHours}:${displayMinutes}:${displaySeconds}.${displayMiliSeconds}`);
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
        if (seconds === 0) {
            seconds = 60;
            minutes--;
            if (minutes === 0) {
                if (hours === 1) {
                    minutes = 60;
                    hours = 0;
                } else if (hours > 0) {
                    hours--;
                }
            }
        }
    }

    let displayMiliSeconds = miliSeconds > 90 ? miliSeconds : `0${miliSeconds}`;
    let displaySeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    let displayMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    let displayHours = hours < 10 ? `0${hours}` : `${hours}`;

    $timeSpan.text(`${displayHours}:${displayMinutes}:${displaySeconds}.${displayMiliSeconds}`);
}

function showCards(amountOfSeconds) {
    $allCards.addClass("flipped");
    setTimeout(() => {
        $allCards.removeClass("flipped");
    }, amountOfSeconds);

}