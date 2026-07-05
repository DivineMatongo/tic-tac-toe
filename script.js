/* ------- */
/* CONSTANTS */
/* ------- */

const X_MARK = "×";
const O_MARK = "○";


/* --------------------- */
/* Underlying game logic */
/* --------------------- */

function GameBoard() {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]
    
    function readSquare(row, col) {
        return board[row][col];
    }

    function writeToSquare(row, col, symbol) {
        if (readSquare(row, col) != "") {
            throw new Error("ClickError");
        }
        board[row][col] = symbol;
    }

    return {
        readSquare,
        writeToSquare
    };
}


function TicTacToe() {
    let currentPlayer = X_MARK;
    let turnsPlayed = 0;
    let gameOver = false;
    let winner = "";
    let winningLine = [];
    const board = GameBoard();

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function isGameOver() {
        return gameOver;
    }

    function getWinner() {
        return winner;
    }

    function getWinningLine() {
        return winningLine.slice();
    }

    function play(row, col) {
        if (gameOver) {
            throw new Error("GameOver");
        }
        board.writeToSquare(row, col, currentPlayer);
        currentPlayer = (currentPlayer === X_MARK) ? O_MARK : X_MARK;
        turnsPlayed++;
        checkGameOver();
    }
   
    function checkLine(line) {
        const squares = [];
        line.forEach((coord) => {
            squares.push(board.readSquare(coord[0], coord[1]));
        });

        if (squares[0] == squares[1] && squares[1] == squares[2]) {
            return squares[0];
        } else {
            return "";
        }
    }

    function checkGameOver() {
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

        for (let line of straightLines) {
            const hasWinner = checkLine(line);
            if (hasWinner) {
                gameOver = true;
                winner = hasWinner;
                winningLine = line;
            }
        }

        if (turnsPlayed >= 9) {
            gameOver = true;
            winner = "";
        }
    }
    
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
const squaresArray = Array.from(document.querySelectorAll(".game-square"));
const playerHeading = document.querySelector(".header > h1");

function refresh() {
    squaresArray.forEach((square) => {
        const row = Number(square.id.charAt(0));
        const col = Number(square.id.charAt(1));
        square.textContent = game.getSquare(row, col);
    });
    if (game.isGameOver()) {
        if (game.getWinner()) {
            playerHeading.textContent = `${game.getWinner()} wins!`;
            paintWinningLine();
        } else {
            playerHeading.textContent = "It's a tie!"
        }
    } else {
        playerHeading.textContent =
            (game.getCurrentPlayer() === X_MARK) ?
            `Player 1: ${X_MARK}` : `Player 2: ${O_MARK}` ;
    }
}

function paintWinningLine() {
    game.getWinningLine().forEach((winningSquare) => {
        const [row, col] = winningSquare;
        document.getElementById(`${row}${col}`)
            .classList.add("winning-line");
    });
}

function applyClickHandlers() {
    document.querySelector(".game-area")
        .addEventListener("click", (e) => {
            if (e.target.classList.contains("game-square")) {
                squareClicked(e.target.id);
            }
        })
}

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
