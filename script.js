/* --------- */
/* CONSTANTS */
/* --------- */

const X_MARK = "×";
const O_MARK = "○";

/* --------------------- */
/* Underlying game logic */
/* --------------------- */

/**
 * @returns 3x3 board object with methods to read and write to squares
 */
function GameBoard() {
    // Private variable that holds the 3x3 board
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]
    /**
     * Retrieves the string character on a specified square
     * @param {Number} row 
     * @param {Number} col 
     * @returns String written on the square
     */
    function readSquare(row, col) {
        return board[row][col];
    }

    /**
     * Writes a character to a specified square on the board
     * @param {Number} row 
     * @param {Number} col 
     * @param {String} symbol Character to be written to the square
     */
    function writeToSquare(row, col, symbol) {
        if (readSquare(row, col) != "") {
            // Square has already been written to
            throw new Error("ClickError");
        }
        board[row][col] = symbol;
    }

    // Returned object only exposes methods to read and write to the board
    return {
        readSquare,
        writeToSquare
    };
}

/**
 * Creates and returns a new game of TicTacToe
 * @returns Instance of a TicTacToe game
 */
function TicTacToe() {
    const board = GameBoard();
    let turnsPlayed = 0;
    let gameOver = false;
    // Tells the game which player's turn it is (X or O)
    let currentPlayer = X_MARK;
    // Holds either X or O if there is a winner; empty if game is drawn
    let winner = "";
    // Stores the coordinates of the winning X or O line
    let winningLine = [];

    /**
     * @returns String X or O depending on who's turn it is to play
     */
    function getCurrentPlayer() {
        return currentPlayer;
    }
    /**
     * @returns True if game is over
     */
    function isGameOver() {
        return gameOver;
    }
    /**
     * @returns String X or O, if there is a winner; empty string if game tied
     */
    function getWinner() {
        return winner;
    }
    /**
     * @returns Coordinate array of the winning line if there is one
     */
    function getWinningLine() {
        return winningLine.slice();
    }
    /**
     * Looks up which player's turn it is and places their respective
     * mark on a specified square on the board
     * @param {Number} row 
     * @param {Number} col 
     */
    function play(row, col) {
        if (gameOver) {
            throw new Error("GameOver");
        }
        board.writeToSquare(row, col, currentPlayer);
        // Update which player's turn it is and increment rounds played
        currentPlayer = (currentPlayer === X_MARK) ? O_MARK : X_MARK;
        turnsPlayed++;
        checkGameOver();
    }
    
    /**
     * Checks whether a given line wins the game, i.e. whether the
     * line contains three consecutive X or O symbols
     * @param {Array} line Coordinate array of the line to be checked
     * @returns String X or O if the line wins the game; empty string if not
     */
    function checkLine(line) {
        const squares = [];
        // Read the each square on the board into the squares Array
        line.forEach((coord) => {
            squares.push(board.readSquare(coord[0], coord[1]));
        });
        //Check if all symbols read into the squares array are the same
        if (squares[0] == squares[1] && squares[1] == squares[2]) {
            return squares[0];
        } else {
            return "";
        }
    }

    /**
     * Run after every turn is played to check if the game is over.
     * If so, it updates game variables to reflect whether there is
     * a winner or the game is drawn.
     */
    function checkGameOver() {
        // All possible straight lines on a TicTacToe board
        const straightLines = [
            [[0, 0], [0, 1], [0, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[1, 0], [1, 1], [1, 2]],
            [[0, 1], [1, 1], [2, 1]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];
        // Check all straight lines in case one is winning
        for (let line of straightLines) {
            const hasWinner = checkLine(line);
            // If checkLine() returns non-empty string, the line is winning
            if (hasWinner) {
                gameOver = true;
                winner = hasWinner;
                winningLine = line;
                return;
            }
        }
        // If 9 rounds have been played then it is a tie
        if (turnsPlayed >= 9) {
            gameOver = true;
            winner = "";
        }
    }
    // Encapsulated TicTacToe object representing a single game.
    // Contains all the methods necessary to play one match.
    return {
        getCurrentPlayer,
        getWinner,
        getWinningLine,
        isGameOver,
        getSquare: board.readSquare, 
        play,
    }
}

/* ------------------------ */
/* GUI and DOM manipulation */
/* ------------------------ */

let game = TicTacToe();
// Array of divs representing the game's squares
const squaresArray = Array.from(document.querySelectorAll(".game-square"));
// Dynamic text informing the players who's turn it is
const playerHeading = document.querySelector(".header > label");

/**
 * Reads data from the underlying game object and displays it on the GUI
 */
function refresh() {
    // Update GUI game squares to show the played Xs and Os
    squaresArray.forEach((square) => {
        const row = Number(square.id.charAt(0));
        const col = Number(square.id.charAt(1));
        square.textContent = game.getSquare(row, col);
    });
    // Someone has won or all squares have been filled
    if (game.isGameOver()) {
        // If there is a winner, the winning line must be painted green and
        // the winner displayed on the screen
        if (game.getWinner()) {
            const winningPlayer = (game.getWinner() === X_MARK) ?
                "Player 1" : "Player 2";
            playerHeading.textContent = `🥳 ${winningPlayer} wins! 🥳`;
            paintWinningLine();
        // If game is tied, simply gray out the match board
        } else {
            playerHeading.textContent = "It's a tie!"
            squaresArray.forEach((square) => square.classList.add("draw"));
        }
    // Game goes on
    } else {
        playerHeading.textContent =
            (game.getCurrentPlayer() === X_MARK) ?
            `Player 1: ${X_MARK}` : `Player 2: ${O_MARK}` ;
    }
}

/**
 * Applies a CSS style to the winning line on the board so it is highlighted
 */
function paintWinningLine() {
    game.getWinningLine().forEach((winningSquare) => {
        const [row, col] = winningSquare;
        document.getElementById(`${row}${col}`)
            .classList.add("winning-line");
    });
}

/**
 * Run when the page loads to handle all clicks on the
 * game squares and the Reset button
 */
function applyClickHandlers() {
    // Game squares
    document.querySelector(".game-area")
    .addEventListener("click", (e) => {
        if (e.target.classList.contains("game-square")) {
            squareClicked(e.target.id);
        }
    });
    //Reset Button
    document.querySelector(".game-button")
    .addEventListener("click", (e) => {
        game = TicTacToe();
        squaresArray.forEach((square) => {
            square.classList.remove("winning-line", "draw")
        });
        refresh();
    });
}

/**
 * Informs the game object of the square that was clicked by the player
 * @param {String} id Unique ID of the specific square clicked
 */
function squareClicked(id) {
    const row = Number(id.charAt(0));
    const col = Number(id.charAt(1));
    try {
        game.play(row, col);
        refresh();
    } catch (e) {
        if (e.message === "ClickError") {
            console.log("Square already played");
        } else if (e.message === "GameOver") {
            console.log("Game Over");
        }
    }
}

applyClickHandlers();
