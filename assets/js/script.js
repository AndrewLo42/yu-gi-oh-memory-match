$(document).ready(initializeApp);
var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var cpuMatches = null;
var max_matches = 3;
var attempts = 0;
var gamesPlayed = 0;
var cardClicked = false;
var playerTurn = true;

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

function initializeApp(){
  resetAllVariables();
  setUpCards();
  $(".light-sword").on("click", revealCards);
}

function setUpCards(){
  var boardSize = {rows: 3, squares: 6}
  var board = $('main');
  for(var rowIndex = 0; rowIndex < boardSize.rows; rowIndex++){
    var gameRow = $('<div>').addClass('row');
    for(var squareIndex = 0; squareIndex < boardSize.squares; squareIndex++){
      var gameSquare = $('<div>').addClass('card');
      gameRow.append(prepareCard(gameSquare));
    }
    board.append(gameRow);
  }
  turnOnClick();
}

function prepareCard(card){
  card.append("<div class='front yugi-back'></div>");
  card.append(addRandomBack());
  return card;
}

function addRandomBack(){
  var cardBack = $('<div>').addClass('back');
  var randomIndex = Math.floor(Math.random() * allCards.length);
  var backClass = allCards.splice(randomIndex, 1);
  cardBack.addClass(backClass);

  return cardBack;
}

function turnOnClick(){
  $(".card").on("click", ".front", function () {
    handleCardClick(event);
  });
}
function flipCard(currentCard){
  currentCard.children('.front').addClass("hidden");
  currentCard.addClass("flip");
}

function handleCardClick(event){
  if (cardClicked) {
    return;
  }
  var currentCard = $(event.currentTarget);
  playSound("./assets/sounds/CARD_MOVE_2.mp3");
  if(playerTurn){
    if(firstCardClicked === null){
      firstCardClicked = currentCard;
      flipCard(currentCard);
    } else{
      secondCardClicked = currentCard;
      flipCard(currentCard)
      // cardClicked = true;
      playerTurn = false;
      checkCards(firstCardClicked, secondCardClicked);
  }
  } else {
    return;
  }
}

function checkCards(first, second){
  var firstImg = first.find(".back").css("background-image");
  var secondImg = second.find(".back").css("background-image");
  if(firstImg === secondImg && first !== null){
    console.log("the cards match");
    winCards();
  } else{
    console.log("not a match");
    setTimeout(resetCards, 1500);
  }
  if (!playerTurn){
    cardClicked = true;
    attempts += 1;
  }
  if (!playerTurn && matches !== max_matches) {
    $(".turnInfo").text("My Move").css("color", "red");
    setTimeout(cpuTurn, 1500);
  }

  displayStats();
}

function cpuTurn(){
  firstCardClicked = $(cpuPick());
  flipCard(firstCardClicked);
  playSound("./assets/sounds/CARD_MOVE_2.mp3");
  secondCardClicked = $(cpuPick());
  flipCard(secondCardClicked);
  playerTurn = true;
  checkCards(firstCardClicked, secondCardClicked);
  $(".turnInfo").text("Your Move").css("color", "green");
}

function resetCards(){
  firstCardClicked.removeClass('flip').children('.front').removeClass("hidden");
  secondCardClicked.removeClass('flip').children('.front').removeClass("hidden");
  resetCurrentCards();
  if(playerTurn){
    cardClicked = false;
  }
}

function winCards(){
  firstCardClicked.off("click", ".front", handleCardClick);
  secondCardClicked.off("click", ".front", handleCardClick);
  if(!playerTurn){
    matches += 1;
    var cpuBar = $(".cpuHP");
    hpLoss(cpuBar);
    resetCurrentCards();
  } else {
    cpuMatches += 1;
    resetCurrentCards();
    cardClicked = false;
    if (cpuMatches === max_matches) {
      setTimeout(endScreen, 1350, "You lose, you second rate duelist.");
    }
    return;
  }

  if(matches === max_matches){
    setTimeout(endScreen, 1350, "You win. Excelent job.");
  } else if (cpuMatches === max_matches){
    setTimeout(endScreen, 1350, "You lose, you second rate duelist.");
  }

}

function hpLoss(bar){
  bar.removeClass().addClass("lifeBar");
  if (matches === 1){
  bar.addClass("cpuHP-1st");
  }
}

function displayStats(){
  $("#gamesPlayed").text("Games Played: " + gamesPlayed);
  $("#tries").text("Attempts: " + attempts);
  $("#accuracy").text(calculateAccuracy() + "%");
}
function calculateAccuracy(){
  if (matches === null)
  {
    return 0;
  }
  return Math.floor(100*(matches/attempts));
}

function endScreen(displayText){
  $('header').text("SENT TO THE SHADOW REALM");
  $(".modal").css("display", "flex");
  $(".endText").text(displayText);
}

function resetGame(){
  resetAllVariables();
  var cards = $(".card");
  cards.removeClass('flip');
  cards.children('.front').removeClass("hidden");
  $(".modal").css("display", "none");
  gamesPlayed += 1;
  displayStats();
  playSound("./assets/sounds/sfx_shuffle.mp3");
  $(".row").remove();
  populatePool();
  setUpCards();

  $("header").text("Exodia Exodus");
  $(".light-sword").css("display", "block");
}
function populatePool() {
  allCards = cardPool.concat(cardPool);
}
function resetAllVariables(){
  matches = null;
  cpuMatches = null;
  playerTurn = true;
  cardClicked = false;
  resetCurrentCards();
  attempts = 0;
}
function resetCurrentCards(){
  firstCardClicked = null;
  secondCardClicked = null;
  // cardClicked = false;
}

function revealCards(){
  var wholeBoard = $('.card');
  $(".light-sword").css("display","none");
  flipCard(wholeBoard);
  playSound("./assets/sounds/i-totally-won-that-duel.mp3");
  setTimeout(endScreen, 2000, "YOU HAVE BEEN BANISHED TO THE SHADOW REALM");
}

function cpuPick(){
  var randomIdx = Math.floor(Math.random() * 18)
  var cardPick = $(".card")[randomIdx];
  if($(cardPick).hasClass("flip")){
    return cpuPick();
  }
  return cardPick;
}

function playSound(soundSrc) {
  var soundEffect = $(".sound-effects")[0];
  $(soundEffect).attr('src', soundSrc)
  soundEffect.play();
}
