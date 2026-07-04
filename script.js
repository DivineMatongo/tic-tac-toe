/* ------- */
/* CONSTANTS */
/* ------- */

const X_MARK = "𐄂";
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
    
    function readSquare (row, col) {
        return board[row][col];
    }

    function writeToSquare(row, col, symbol) {
        if (readSquare(row, col) != "") {
            throw new Error("ClickError");
        }
        board[row][col] = symbol;
        console.log(board);
    }

    return {
        readSquare,
        writeToSquare
    };
}


function TicTacToe() {
    let currentPlayer = X_MARK;
    let turnsPlayed = 0;
    const board = GameBoard();

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function play(row, col) {
        if (turnsPlayed >= 9) {
            throw new Error("GameOver");
        }
        board.writeToSquare(row, col, currentPlayer);
        currentPlayer = (currentPlayer === X_MARK) ? O_MARK : X_MARK;
        turnsPlayed++;
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

    function gameOver() {
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
            const winner = checkLine(line);
            if (winner) {
                return {winner, line};
            }
        }

        if (turnsPlayed >= 9) {
            return {winner: null};
        }
    }
    
    return {
        getCurrentPlayer,
        play,
        gameOver,
        getSquare: board.readSquare, 
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
    playerHeading.textContent =
        (game.getCurrentPlayer === X_MARK) ?
        `Player 2: ${O_MARK}` : `Player 1: ${X_MARK}` ;
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
        }
    }
}

function main() {
    applyClickHandlers();
}

main();
