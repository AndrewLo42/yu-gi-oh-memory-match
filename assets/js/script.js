$(document).ready(initializeApp);

function initializeApp(){
  $(".front").on("click", function(){
    handleCardClick(event);
  });
}

function handleCardClick(event){
  console.log(event);
  $(event.currentTarget).addClass("hidden");
}
