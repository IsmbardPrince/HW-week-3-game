// object definition: gameHangman
//
// This object encapsulates all of the functional pieces required for the hangman game
// assigned for Homework 3. A game session is started on document load and transitions to game state
// are caused by calls to the playChar() function. When an individual game is completed, the game is reset
// and restarted. The game session is ended when the document is unloaded.
//
// The html required to render the game functionally complete requires the following element ids:
//		hmTitle - contains the overall title string for the game
//		hmStartMsg - contains a general message string to be displayed
//		hmLblTotalWins - the text label associated with the display of number of wins in the session
//		hmTotalWins - contains the number of wins in the session
//		hmLblCurrentWord - the text label associated with the display of correctly guessed letters for a game
//		hmCurrentWord - container for generated individual elements representing correctly guessed letters for a game
//		hmLblWrongLetters - the text label associated with the display of incorrectly guessed letters for a game
//		hmWrongLetters - container for generated individual elements representing incorrectly guessed letters for a game
//		hmLblGuessesRemaining - the text label associated with the display of number of guesses remaining for a game
//		hmGuessesRemaining - contains the number of guesses remaining in the current game
//		hmPictureWindow - container for game status images; there needs to be 'maxWrongGuesses + 2' images available,
//			named hmGameImg0.jpg - hmGameImg + 'maxWrongGuesses + 2'.jpg; hmGameImg + 'maxWrongGuesses + 2'.jpg will be the
//			image displayed at the start of a game; images will then be displayed in descending order as for each succeeding
//			incorrect guess; hmGameImg1.jpg will be displayed for a game loss and hmGameImg0.jpg will be displayed for
//			a game win
//	A default html is hard coded into this game object. A highly recommended improvement would be to load the html for the game
//	from an external file. As a related matter, the word list for the game is also hard-coded in the game object and it would
//	better to load that word list from an external file too.
//
//	This game object is designed to be self-contained such that it could easily be hosted in other web pages. As such, it provides
//	a minor level of customization beyond that already available through html and css. The following values can be set by a host
//	page to affect game play:
//		title - the overall title string for the game
//		msgStart - a general message string to be displayed
//		lblWinTotal - the text associated with the display of number of wins in the session
//		lblCurrentWord - the text associated with the display of correctly guessed letters for a game
//		lblWrongLetters - the text associated with the display of incorrectly guessed letters for a game
//		lblGuessesRemaining - the text associated with the display of number of guesses remaining for a game
//		maxWrongGuesses - the maximum number of incorrect guesses allowed per game
//		minWordLength - the minimum length of a word that can be used for a game
//		maxWordLength - the maximum length of a word that can be used for a game
//
var gameHangman = {

	// game values settable by the host page; see preamble for descriptions
	title: "Hangman",
	msgStart: "Press any key to get started!",
	lblWinTotal: "Games won:",
	lblCurrentWord: "Guess this word:",
	lblWrongLetters: "Letters you've guessed:",
	lblGuessesRemaining: "Guesses Remaining:",
	maxWrongGuesses: 10,
	minWordLength: 5,
	maxWordLength: 10,

	// variables used internally by the object
	winTotal: 0, // current number of won games for the session
	currentWord: [], // contains the characters of the word for the game
	guessedLetters: [], // contains correctly guessed word letters at their appropriate ndx for the current word
	wrongLetters: [], // contains incorrectly guessed letters in the sequence guessed
	guessedLetterCount: 0, // the number of character positions filled by correctly guessed letters
	guessesRemaining: 0, // the number of guesses remaining for the current game
	gameSetup: false, // true indicates the game's html has been correctly loaded and initialized
	gameStarted: false, // true indicates that a new game has been initialized and is ready to be played

	// the global data for the game
	gameBoard: document.getElementById("gameBoard"),
	gameHTML: "<div id='hmHeader'><h1 id='hmTitle'>hmTitle</h1><div id='hmMsgs'><h2 id='hmStartMsg'>hmStartMsg</h2></div></div><div id='hmSidebar'><table><tr><td><h2 id='hmLblTotalWins'>hmLblTotalWins</h2></td><td><div id='hmTotalWins'>hmTotalWins</div></td></tr></table><h3 id='hmLblCurrentWord'>hmLblCurrentWord</h3><div id='hmCurrentWord'>hmCurrentWord</div><h3 id='hmLblWrongLetters'>hmLblWrongLetters</h3><div id='hmWrongLetters'>hmWrongLetters</div><table><tr><td><h3 id='hmLblGuessesRemaining'>hmLblGuessesRemaining</h3></td><td><div id='hmGuessesRemaining'>hmGuessesRemaining</div></td></tr></table></div><div id='hmPictureWindow'><img id='hmStatusPicture' src='assets/images/hanged_man.png'></div><audio id='sndBadKey' src='assets/audio/beep10.mp3' type='audio/mpeg'></audio><audio id='sndWrongLetter' src='assets/audio/Evil_Laugh.mp3' type='audio/mpeg'></audio><audio id='sndCorrectLetter' src='assets/audio/Short_fanfare.mp3' type='audio/mpeg'></audio><audio id='sndLostGame' src='assets/audio/Funeral_March.mp3' type='audio/mpeg'></audio><audio id='sndWonGame' src='assets/audio/HappyMusic.mp3' type='audio/mpeg'></audio>",
	gameWords: ["vacation", "occupation", "depth", "hamlet", "automobile", "music", "pencil", "professor", "truck", "inertia"],

	// setup() returns: undefined
	// initializes the gameboard for the game by loading the game's html into the provided container
	setup: function() {

		this.gameBoard.innerHTML = this.gameHTML;

		document.getElementById("hmTitle").innerHTML = this.title;
		document.getElementById("hmStartMsg").innerHTML = this.msgStart;
		document.getElementById("hmLblTotalWins").innerHTML = this.lblWinTotal;
		document.getElementById("hmTotalWins").innerHTML = parseInt(this.winTotal);

		document.getElementById("hmLblCurrentWord").innerHTML = this.lblCurrentWord;
		document.getElementById("hmLblWrongLetters").innerHTML = this.lblWrongLetters;
		document.getElementById("hmLblGuessesRemaining").innerHTML = this.lblGuessesRemaining;

		this.gameSetup = true;

		this.reset();

	}, // end setup() {}

	// reset() returns: undefined
	// resets all variables and html elements to a game's starting values; this includes
	// selecting a new current word and associated actions
	reset: function() {

		this.currentWord = [];
		this.guessedLetters = [];
		document.getElementById("hmCurrentWord").innerHTML = "";
		this.guessedLetterCount = 0;
		this.wrongLetters = [];
		document.getElementById("hmWrongLetters").innerHTML = "";
		this.guessesRemaining = this.maxWrongGuesses;
		document.getElementById("hmGuessesRemaining").innerHTML = "";

		var word = "";
		do {
			word = this.gameWords[Math.floor(Math.random() * this.gameWords.length)];
		}
		while (word.length < this.minWordLength || word.length > this.maxWordLength);
		console.log("The current word is '" + word + "'");

		var tableChars = document.createElement("table");
		var tableBody =  document.createElement("tableBody");
		var tableRow = document.createElement("tableRow");
		var nodeLetter;
		for (var i = 0; i < word.length; i++) {
			this.currentWord.push(word.charAt(i));
			this.guessedLetters.push(" ");
			nodeLetter = document.createElement("tableData");
			nodeLetter.setAttribute("id", "cwLetter" + parseInt(i + 1));
			nodeLetter.setAttribute("class", "hmWordLetter");
			nodeLetter.innerHTML = "__";
			tableRow.appendChild(nodeLetter);
		}
		tableChars.appendChild(tableBody);
		tableBody.appendChild(tableRow);
		document.getElementById("hmCurrentWord").appendChild(tableChars);

		var tableChars = document.createElement("table");
		var tableBody =  document.createElement("tableBody");
		var tableRow = document.createElement("tableRow");
		nodeLetter = document.createElement("tableData");
		nodeLetter.setAttribute("class", "hmWrongLetter");
		nodeLetter.innerHTML = "{";
		tableRow.appendChild(nodeLetter);
		for (var i = 1; i <= this.maxWrongGuesses; i++) {
			nodeLetter = document.createElement("tableData");
			nodeLetter.setAttribute("id", "wgLetter" + parseInt(i));
			nodeLetter.setAttribute("class", "hmWrongLetter");
			nodeLetter.innerHTML = " ";
			tableRow.appendChild(nodeLetter);
		}
		nodeLetter = document.createElement("tableData");
		nodeLetter.setAttribute("class", "hmWrongLetter");
		nodeLetter.innerHTML = "}";
		tableRow.appendChild(nodeLetter);
		tableChars.appendChild(tableBody);
		tableBody.appendChild(tableRow);
		document.getElementById("hmWrongLetters").appendChild(tableChars);

		document.getElementById("hmGuessesRemaining").innerHTML = parseInt(this.maxWrongGuesses);


		this.gameStarted = true;

	}, // end reset() {}

//	playChar() returns: undefined
//	updates current game status based on key value provided; if a game ending condition is reached,
//	the end game actions are performed and a game reset is performed to initiate a new game
	playChar: function(c) {
		if (!this.gameSetup) this.setup();
		if (!this.gameStarted) this.reset();

		if (this.validChar(c)) {

			var cntFound = this.findCharInWord(c);
			var chgTopMargin = "";

			if (cntFound > 0) {
				this.guessedLetterCount += cntFound;
				if (this.guessedLetterCount >= this.currentWord.length) {
					this.gameOver(true);
				} else {
					document.getElementById("sndCorrectLetter").play();
				}
			} else {
				this.wrongLetters.push(c);
				document.getElementById("wgLetter" + parseInt(this.wrongLetters.length)).innerHTML = c;
				document.getElementById("hmGuessesRemaining").innerHTML = --this.guessesRemaining;
				var imageElement = document.getElementById("hmStatusPicture");
				if (this.guessesRemaining < 10 && this.guessesRemaining > 0) {
					if (this.guessesRemaining == 9) {
						imageElement.setAttribute("src", "assets/images/empty_gallows.png");
						chgTopMargin = "; margin-top: 0";
					}
					imageElement.setAttribute("style", "width: " + parseInt(100 - ((this.guessesRemaining - 1) * 10)) + "%; margin-top: " + parseInt(36 * (this.guessesRemaining - 1)) + "px");
				}
				document.getElementById("sndWrongLetter").play();
				if (this.guessesRemaining <= 0) {
					this.gameOver(false);
				}
			}
		}

	}, // end playChar() {}

//	validChar() returns: true or false depending whether provided character is a valid lower case character
//	support function which returns true or false depending on whether the provided character is a valid
//	lower case character
	validChar: function(c) {

    	if (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122) {
    		for (var i = 0; i < this.guessedLetters.length; i++) {
    			if (c == this.guessedLetters[i]) {
    				document.getElementById("sndBadKey").play();
    				return false;
    			}
    		}
    		for (var i = 0; i < this.wrongLetters.length; i++) {
    			if (c == this.wrongLetters[i]) {
    				document.getElementById("sndBadKey").play();
    				return false;
    			}
    		}
    		return true;
    	} else {
    		document.getElementById("sndBadKey").play();
    		return false;
    	}

	}, // end validChar() {}

//	findCharInWord() returns: integer denoting number of times provided character was found in current word
//	searches the current word for character matches with the provided character; if matches are found, the html
//	is updated to reflect those matches
	findCharInWord: function(c) {

		var cntFound = 0;

		for (var i = 0; i < this.currentWord.length; i++) {
			if (c == this.currentWord[i]) {
				this.guessedLetters[i] = c;
				document.getElementById("cwLetter" + parseInt(i + 1)).innerHTML = c;
				cntFound++;
			}
		}

		return cntFound;

	}, // end findCharInWord() {}

//	gameOver() returns: undefined
//	performs the game over actions for a completed game; if provided value is true, user won actions are performed;
//	if false user lost actions are performed; after game over actions are performed, the gameboard is reset and a
//	new game is started automatically
	gameOver: function(won) {

		var imageElement = document.getElementById("hmStatusPicture");

		if (won) {
			this.winTotal++;
			document.getElementById("hmTotalWins").innerHTML = parseInt(this.winTotal);
			imageElement.setAttribute("src", "assets/images/happy.jpg");
			imageElement.setAttribute("style", "width: 90%; margin-top: 120px");
			document.getElementById("sndWonGame").play();
		} else {
			imageElement.setAttribute("src", "assets/images/hanged_man.png");
			document.getElementById("sndLostGame").play();
		}

		this.gameStarted = false;
		this.reset();

	} // end gameOver() {}

} // end var gameHangman {}

gameHangman.setup();

document.onkeyup = function(event){

	gameHangman.playChar(String.fromCharCode(event.keyCode).toLowerCase());

}
