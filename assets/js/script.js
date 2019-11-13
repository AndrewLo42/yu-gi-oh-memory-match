$(document).ready(initializeApp);
var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var max_matches = 3;
var attempts = 0;
var gamesPlayed = 0;

function initializeApp(){
  resetAllVariables();
  $(".card").on("click", ".front", function(){
    handleCardClick(event);
  });
}

function handleCardClick(event){
  var currentCard = $(event.currentTarget);
  currentCard.addClass("flip");
  currentCard.children('.front').addClass("hidden");
  //filling in the cardClicked
  if(firstCardClicked === null){
    firstCardClicked = currentCard;
  } else {
    secondCardClicked = currentCard;
    checkCards(firstCardClicked, secondCardClicked);
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
    showCards();
  }
  attempts += 1;
  displayStats();
}
function showCards(){
  setTimeout(resetCards, 1200);
}
function resetCards(){
  firstCardClicked.removeClass('flip');
  secondCardClicked.removeClass('flip');
  firstCardClicked.children('.front').removeClass("hidden");
  secondCardClicked.children('.front').removeClass("hidden");
  firstCardClicked = null;
  secondCardClicked = null;
}
function winCards(){
  matches += 1;
  firstCardClicked.off("click", ".front", handleCardClick);
  secondCardClicked.off("click", ".front", handleCardClick);
  firstCardClicked = null;
  secondCardClicked = null;
  if(matches === max_matches){
    victoryScreen();
  }
}

function displayStats(){
  $("#gamesPlayed").text(gamesPlayed);
  $("#tries").text(attempts);
  $("#accuracy").text(calculateAccuracy() + "%");
}
function calculateAccuracy(){
  if (matches === null)
  {
    return 0;
  }
  return Math.floor(100*(matches/attempts));
}

function victoryScreen(){
  $('header').text("YOU WIN");
  $(".modal").css("display", "flex");
  // $("#again").on("click", function(){
  //   resetAllVariables();
  //   resetGame();
  // });
}

function resetGame(){
  resetAllVariables();
  var cards = $(".card");
  cards.removeClass('flip');
  cards.children('.front').removeClass("hidden");
  $(".modal").css("display", "none");
  gamesPlayed += 1;
 displayStats();
  $("header").text("Memory Match");
}

function resetAllVariables(){
  matches = null;
  firstCardClicked = null;
  secondCardClicked = null;
  attempts = 0;
}
