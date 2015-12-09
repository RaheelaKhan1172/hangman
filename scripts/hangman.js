var game = {
  dashDisplay: '',
  wordToGuess: "",
  wrongGuesses: "",
  wrongGuessCount: 0,
  myCanvas: document.getElementById("myCanvas"),
  context: myCanvas.getContext('2d')
};

game.drawLine = function(context,from,to) {
  context.beginPath();
  context.moveTo(from[0],from[1]);
  context.lineTo(to[0],to[1]);
  context.stroke();        
}

game.lose = function() {
  game.drawLine(game.context,[145,130],[160,170]);
  $("#guess").off("input");
  
  $("#display").text("The word was:" + game.guessMe); 
  $("#wrong").text("You Lose! Press restart if you would like to play again!");
  //score will also be decremented 
}

game.win = function() {
  $("#guess").off("input");
  $("#wrong").text("Congratulations! You win!");
  
  $("input").on("input", function() {
    $("#wrong").text("Press restart to play again");
  });

}
  


game.drawCanvas = function() {
  game.myCanvas.width = game.myCanvas.width;
  game.context.lineWidth = 10;
  game.context.strokeStyle = 'green';
  game.context.font = 'bold 24px Optimer, Arial, Helvetica, sans-serif';
  game.context.fillStyle = 'red';
  
  //guess count and resulting drawing 
  if (game.wrongGuessCount > 0) {
    game.context.strokeStyle = "#A52A2A";
    //call drawLine to draw the line
    game.drawLine(game.context,[30,185], [30,10]);
    if (game.wrongGuessCount > 1) {
      game.context.lineTo(150,10);
      game.context.stroke();
    } 
    if (game.wrongGuessCount > 2) {
      game.context.strokeStyle = 'black';
      game.context.lineWidth = 3;
      game.drawLine(game.context,[145,15],[145,30]);
      game.context.beginPath();
      game.context.moveTo(160,45);
      game.context.arc(145,45,15,0, (Math.PI/180)*360);
      game.context.stroke();
    }
    if (game.wrongGuessCount > 3) {
      //body
      game.drawLine(game.context,[145,60],[145,130]);
    }
    if (game.wrongGuessCount > 4) {
      game.drawLine(game.context,[145,80],[110,90]);
    }
    if (game.wrongGuessCount > 5) {
      game.drawLine(game.context,[145,80],[180,90]);
    }
    if (game.wrongGuessCount > 6) {
      game.drawLine(game.context,[145,130],[130,170]);
    }
    if (game.wrongGuessCount > 7) {
      //send to game.lose to handle drawing of legs, display lose message and correct ans, wait for restart
      game.lose();
    }
  }
}
   

//api to get word
game.getWord = function() {
  console.log('im git');
  var request = "http://randomword.setgetgo.com/get.php";
  $.ajax({
    type: "GET",
    url: request,
    dataType:"jsonp",
    jsonpCallback: 'game.randomWord'
  })
};

game.randomWord = function(data) {
  game.wordToGuess =  data.Word;
  game.wordToGuess =  game.wordToGuess.toLowerCase();
  return game.wordToGuess;
};

game.restart = function() {
  game.getWord();
  console.log(game.wordToGuess);
  game.wrongGuesses = "";
  game.wrongGuessCount = 0;
  game.guessMe = game.wordToGuess; //ok, the word changed when inSession is called, why? temp fix, store current result in var
  game.dashDisplay = '-'.repeat(game.guessMe.length);
  game.drawCanvas();

  $("#display").text(game.dashDisplay); 
  $("progress").val('0');
  $("#wrong").text('');
  $("#guess").val("");
  $("#guess").focus();
  game.play();
  console.log('word', game.wordToGuess);
};

game.play = function() {
  console.log('why',game.wordToGuess);

  $("input").off("input");
  $("input").on("input", game.inSession);

};

game.inSession = function() {
  console.log('right',game.wordToGuess);
  var userGuess = $("input").val().toLowerCase();
  var position = game.guessMe.indexOf(userGuess);
    if(position >= 0) {
      while ( position >= 0) {
        game.dashDisplay = game.dashDisplay.substring(0, position) + userGuess + game.dashDisplay.substring(position + 1);
        position = game.guessMe.indexOf(userGuess, position + 1);
        };
    $("#display.letters").text(game.dashDisplay); 
  } else {
    game.wrongGuesses += userGuess;
    game.wrongGuessCount += 1;
    $("#wrong").text(game.wrongGuesses);
    //if there is a bad guess, count is incremented, and hangman is drawn.
    game.drawCanvas(); //draw canvas update
  }; 
  setTimeout(function(){ $("#guess").val("");},1000);
 if (game.dashDisplay === game.guessMe && game.guessMe !== "") {
    //draw canvas with win 
   $("#guess").val('');
    game.win();
  } else {
     if (game.wrongGuessCount === 7) {
    //draw canvas for losing 
    $("input").val('');
    game.lose();
    };  
  };
};


$(document).ready(function() {
   game.restart();
 // $("#guess").on("input",game.play);
  $("button").click(game.restart);
});

