/*
| TICTACTOE v1 by Doug Schrashun
| A one player tic tac toe game. 
| Computer player's moves are chosen randomly. Human player always moves first.
| Enjoy!
*/



//check submit form on index page
var checkForm = function () {
	var x = document.getElementById("x").checked;
	var o = document.getElementById("o").checked;
	console.log(x);
	console.log(o);
	if (x === false && o === false) {
		alert("Select X or O");
	}
	else {
		document.chooser.submit();
	}

}

//game logic, which is run on page load
var runGame = function () {

	//defining variables
	var nameloc = window.location.href.search("name=");
	var andloc = window.location.href.search("&");
	var xoroloc = andloc + 6;
	var xoro = window.location.href.substr(xoroloc);
	var name = window.location.href.substr(nameloc + 5, (andloc - nameloc - 5));
	var turnComplete = false;
	var gameOver = 0;

	//an inelegant solution - couldn't figure out how to keep a global turn variable in scope, so the program counts only human
	//turns up to 5 to determine whether or not the board is full
	var hTurn = 0;
	var last;
	var compXoro;
	if (xoro === "x") {
		compXoro = "o";
	}
	else {
		compXoro = "x";
	}
	var nameTurn = document.createTextNode("TICTACTOE");

	// defining event handlers and such
	// each td is assigned an event handler function, either addX or addO depending on which marker the player has chosen
	// upon click, the box will be marked off, and the turn will pass to the computer through the runTurn function
	var addX = function () {
		event.target.innerHTML = "x";
		event.target.removeEventListener("click", addX);
		turnComplete = true;
		hTurn++;
		runTurn(turnComplete, hTurn, compXoro, name);
	}
	var addO = function () {
		event.target.innerHTML = "o";
		event.target.removeEventListener("click", addO);
		turnComplete = true;
		hTurn++;
		runTurn(turnComplete, hTurn, compXoro, name);
	}
	for (var i = 1; i < 10; i++) {
		if (xoro === "x") {
			document.getElementById(i).addEventListener("click", addX);
		}
		else if (xoro === "o") {
			document.getElementById(i).addEventListener("click", addO);
		}

	}

	//initially attempted to add a dynamic header showing whose turn it was, but that necessitated using the setTimeout 
	//method which messed with calculations too much, so I settled for something static
	document.getElementById("turn").appendChild(nameTurn);
}

//logic for running computer turns, called from event handler following a human move
//a check is made for game over at the begginning of the function call to account for the human move
var runTurn = function (turnComplete, hTurn, compXoro, name) {
	if (turnComplete === true) {
		gameOver = checkGameOver(hTurn);
		if (gameOver === 0) {
			gameOver = compTurn(compXoro, hTurn, name);
			turnComplete = false;
			if (gameOver !== 0) {
				gameOverScenario(gameOver, turnComplete, name);
			}
		}
		else gameOverScenario(gameOver, turnComplete, name);
	}
}

//what happens on a computer turn, a randomly generated move. could not properly account for numbers rounding to 0
//so I faked that a little but rounding any 0 values up to 1
//this function also checks for a game over following the computer move
var compTurn = function (xoro, hTurn, name) {
	var box = Math.round(9 * Math.random());
	if (box < 1) {
		box = 1;
	}
	console.log(box);
	while (document.getElementById(box).hasChildNodes() === true) {
		box = Math.round(9 * Math.random());
		if (box < 1) {
			box = 1;
		}
		console.log(box);
	}
	doMove(xoro,box);
	return checkGameOver(hTurn);
}

//the computer's actual move function
var doMove = function (xoro, box) {
	var theMove = document.createTextNode(xoro);
	document.getElementById(box).appendChild(theMove);
}

//function to check if game is over, taking into account the possibility of a full board / stalemate
//as well as a win for either of the players
var checkGameOver = function (turns) {
	var rows = [[1,2,3],[4,5,6],[7,8,9]];
	var columns = [[1,4,7],[2,5,8],[3,6,9]];
	var diags = [[1,5,9],[3,5,7]];
	if (checkBoxes(rows) === 1 || checkBoxes(columns) === 1 || checkBoxes(diags) === 1) {
		return 1;
	}
	else if (turns === 5) {
		return 2;
	}
	else {
		return 0;
	}
}

//function for checking td contents, in order to check for game over conditions
var checkBoxes = function (boxArr) {
	var idArr = [[],[],[]];
	var result = 0;
	for (var j = 0; j < boxArr.length; j++) {
		for (var k = 0; k < boxArr[j].length; k++) {
			idArr[j][k] = document.getElementById(boxArr[j][k]).innerHTML;
		}
	}
	for (var i = 0; i < idArr.length; i++) {
		if (idArr[i][0] === "x" && idArr[i][1] === "x" && idArr[i][2] === "x") {
			result = 1;
		}
		else if (idArr[i][0] === "o" && idArr[i][1] === "o" && idArr[i][2] === "o") {
			result = 1;
		}
	}
	return result;
}

//logic run upon game over. adds a message showing who won, determined by whoever moved last
//as well as a button to click to play again
var gameOverScenario = function(go, turnComplete, name) {
	if (turnComplete === true) {
		last = name;
	}
	else {
		last = "Computer";
	}
	var wins = document.createTextNode(last + " Wins!");
	if (go === 1) {
		document.getElementById("winner").appendChild(wins);
	}
	else {
		document.getElementById("winner").innerHTML = "STALEMATE!";
	}
	var pAgain = document.createElement("P");
	var again = document.createTextNode("Play Again?");
	pAgain.appendChild(again);
	var theButton = document.createElement("BUTTON");
	var yes = document.createTextNode("Yes!");
	theButton.appendChild(yes);
	var replayLink = document.createElement("A");
	replayLink.setAttribute("href", window.location.href);
	replayLink.appendChild(theButton);
	document.getElementById("end").appendChild(pAgain);
	document.getElementById("end").appendChild(replayLink);
}
