$(document).ready(initializeApp);
var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var cpuMatches = null;
var max_matches = 5;
var attempts = 0;
var gamesPlayed = 0;
var cardClicked = false;
var playerTurn = true;
var soundEffects = false;

var cardPool = [
  "blue-eyes",
  "exodia-head",
  "left-arm",
  "right-arm",
  "right-leg",
  "left-leg",
  "dark-mag",
  "summoned-skull",
  "red-eyes"];
var allCards = cardPool.concat(cardPool);

function initializeApp() {
  resetAllVariables();
  setUpCards();
  $(".turnInfo").on("click", showConcede);
  $(".light-sword").on("click", revealCards);
  $(".again").on("click", resetGame);
  $("#start").on("click", startGame);
  $(".volumeToggle").on("click", toggleVolume);
}

function showConcede() {
  $(".light-sword").toggleClass("hidden");
}

function startGame(){
  $(".openingBack").css("display", "none");
}

function toggleVolume() {
  soundEffects = !soundEffects;
  if(soundEffects){
    $(".volumeToggle").css("color", "green");
  } else {
    $(".volumeToggle").css("color", "red");
  }
}

function setUpCards() {
  var boardSize = { rows: 3, squares: 6 }
  var board = $("main");
  for (var rowIndex = 0; rowIndex < boardSize.rows; rowIndex++) {
    for (var squareIndex = 0; squareIndex < boardSize.squares; squareIndex++) {
      var gameSquare = $('<div>').addClass('card');
      board.append(prepareCard(gameSquare));
    }
  }
  turnOnClick();
}

function prepareCard(card) {
  card.append("<div class='front yugi-back'></div>");
  card.append(addRandomBack());
  return card;
}

function addRandomBack() {
  var cardBack = $('<div>').addClass('back');
  var randomIndex = Math.floor(Math.random() * allCards.length);
  var backClass = allCards.splice(randomIndex, 1);
  cardBack.addClass(backClass);

  return cardBack;
}

function turnOnClick() {
  $(".card").on("click", ".front", function () {
    handleCardClick(event);
  });
}
function flipCard(currentCard) {
  currentCard.children('.front').addClass("hidden");
  currentCard.addClass("flip");
}

function handleCardClick(event) {
  if (cardClicked) {
    return;
  }
  var currentCard = $(event.currentTarget);
  playSound("./assets/sounds/CARD_MOVE_2.mp3");
  if (playerTurn) {
    if (firstCardClicked === null) {
      firstCardClicked = currentCard;
      flipCard(currentCard);
    } else {
      secondCardClicked = currentCard;
      flipCard(currentCard)
      playerTurn = false;
      checkCards(firstCardClicked, secondCardClicked);
    }
  } else {
    return;
  }
}

function checkCards(first, second) {
  var firstImg = first.find(".back").css("background-image");
  var secondImg = second.find(".back").css("background-image");
  if (firstImg === secondImg && first !== null) {
    winCards();
  } else {
    setTimeout(resetCards, 1500);
  }
  if (!playerTurn) {
    cardClicked = true;
    attempts += 1;
  }
  if (!playerTurn && matches !== max_matches) {
    $(".turnInfo").text("My Move").css("color", "red");
    setTimeout(cpuTurn, 3000);
  }

  displayStats();
}

function cpuTurn() {
  firstCardClicked = $(cpuPick());
  flipCard(firstCardClicked);
  playSound("./assets/sounds/CARD_MOVE_2.mp3");
  secondCardClicked = $(cpuPick());
  flipCard(secondCardClicked);
  setTimeout(cpuTurnEnd, 2000);
}
function cpuTurnEnd() {
  playerTurn = true;
  checkCards(firstCardClicked, secondCardClicked);
  $(".turnInfo").text("Your Move").css("color", "goldenrod");
}

function resetCards() {
  firstCardClicked.removeClass('flip').children('.front').removeClass("hidden");
  secondCardClicked.removeClass('flip').children('.front').removeClass("hidden");
  resetCurrentCards();
  if (playerTurn) {
    cardClicked = false;
  }
}

function winCards() {
  firstCardClicked.off("click", ".front", handleCardClick);
  secondCardClicked.off("click", ".front", handleCardClick);
  if (!playerTurn) {
    matches += 1;
    var cpuBar = $(".cpuHP");
    hpLoss(cpuBar);
    resetCurrentCards();
  } else {
    cpuMatches += 1;
    var playerBar = $(".playerHP");
    hpLoss(playerBar);
    resetCurrentCards();
    cardClicked = false;
    if (cpuMatches === max_matches) {
      setTimeout(endScreen, 1350, "You lose, you second rate duelist.");
      $(".modal").css("background-image", "url('./assets/images/exodiaObliterate.gif')");
    }
    return;
  }

  if (matches === max_matches) {
    setTimeout(endScreen, 1350, "You win. Good job.");
    $(".modal").css("background-image", "url('./assets/images/yugiSwag.gif')");
  }

}

function hpLoss(bar) {

  var currentMatch;
  if (!playerTurn) {
    currentMatch = matches;
  } else {
    currentMatch = cpuMatches;
  }

  if (currentMatch === 1) {
    bar.addClass("hpBar-1st");
  } else if (currentMatch === 2) {
    bar.removeClass("hpBar-1st");
    bar.addClass("hpBar-2nd");
  } else if (currentMatch === 3) {
    bar.addClass("hpBar-3rd");
  } else if (currentMatch === 4) {
    bar.addClass("hpBar-4th");
  } else {
    bar.addClass("hpBar-empty");
  }
  playSound("./assets/sounds/points_drop.mp3");
}

function resetLife(bar) {
  bar.removeClass("hpBar-1st hpBar-2nd hpBar-3rd hpBar-4th hpBar-empty");
}

function displayStats() {
  $("#gamesPlayed").text("Games Played: " + gamesPlayed);
  $("#tries").text("Attempts: " + attempts);
  $("#accuracy").text("Accuracty: " + calculateAccuracy() + "%");
  matches ? $(".matches").text("Matches: " + matches) : $(".playerHP").text("Matches: " + 0);
}
function calculateAccuracy() {
  if (matches === null) {
    return 0;
  }
  return Math.floor(100 * (matches / attempts));
}

function endScreen(displayText) {
  $('header').text("SENT TO THE SHADOW REALM");
  $("#winModal").css("display", "flex");
  $(".endText").text(displayText);
}

function resetGame() {
  resetAllVariables();
  var cards = $(".card");
  cards.removeClass('flip');
  cards.children('.front').removeClass("hidden");
  $("#winModal").css("display", "none");
  gamesPlayed += 1;
  displayStats();
  playSound("./assets/sounds/sfx_shuffle.mp3");
  $("main").empty();
  populatePool();
  setUpCards();
  resetLife($(".cpuHP"));
  resetLife($(".playerHP"));
  $("header").text("Exodia Exodus");
  $(".light-sword").addClass("hidden");
}
function populatePool() {
  allCards = cardPool.concat(cardPool);
}
function resetAllVariables() {
  matches = null;
  cpuMatches = null;
  playerTurn = true;
  cardClicked = false;
  resetCurrentCards();
  attempts = 0;
}
function resetCurrentCards() {
  firstCardClicked = null;
  secondCardClicked = null;
}

function revealCards() {
  var wholeBoard = $('.card');
  $(".light-sword").toggleClass("hidden");
  flipCard(wholeBoard);
  playSound("./assets/sounds/i-totally-won-that-duel.mp3");
  setTimeout(endScreen, 2000, "BANISHED TO THE SHADOW REALM");
}

function cpuPick() {
  var randomIdx = Math.floor(Math.random() * 18)
  var cardPick = $(".card")[randomIdx];
  if ($(cardPick).hasClass("flip")) {
    return cpuPick();
  }
  return cardPick;
}

function playSound(soundSrc) {
  if(soundEffects) {
    var soundEffect = $(".sound-effects")[0];
    $(soundEffect).attr('src', soundSrc)
    soundEffect.play();
  }
}
