$(document).ready(initializeApp);
var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var max_matches = 3;
function initializeApp(){
  $(".card").on("click", function(){
    handleCardClick(event);
  });
}

function handleCardClick(event){
  // console.log(event);
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

  if(firstImg === secondImg){
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
  firstCardClicked.removeClass('flip');
  secondCardClicked.removeClass('flip');
  firstCardClicked.children('.front').removeClass("hidden");
  secondCardClicked.children('.front').removeClass("hidden");
  firstCardClicked = null;
  secondCardClicked = null;
}
function winCards(){
  matches += 1;
  firstCardClicked.off("click");
  secondCardClicked.off("click");
  firstCardClicked = null;
  secondCardClicked = null;
  if(matches === max_matches){
    victoryScreen();
  }
}
function victoryScreen(){
  $('header').text("YOU WIN");
}
