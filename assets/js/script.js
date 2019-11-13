$(document).ready(initializeApp);
var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var max_matches = 3;
var gamesPlayed = 0;
function initializeApp(){
  resetAllVariables();
  $(".card").on("click", ".front", function(){
    handleCardClick(event);
  });
}

function handleCardClick(event){
  //without bubbling
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
}
function showCards(){
  setTimeout(resetCards, 1200);
}
function resetCards(){
  $(".card").on("click", ".front", handleCardClick);
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
  $(".card").removeClass('flip');
  $(".card").children('.front').removeClass("hidden");
  $(".modal").css("display", "none");
  var currentPlayed = parseInt($("#gamesPlayed").text());
  currentPlayed += 1;
  $("#gamesPlayed").text(currentPlayed);
  $("header").text("Memory Match");
}

function resetAllVariables(){
  matches = null;
  firstCardClicked = null;
  secondCardClicked = null;

}
