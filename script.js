
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
            throw new Error("Attempt to write to a non-empty square");
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
    let currentPlayer = "𐄂";
    let turnsPlayed = 0;
    const board = GameBoard();

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function play(row, col) {
        if (turnsPlayed >= 9) {
            throw new Error("Too many rounds for a TicTacToe game");
        }
        board.writeToSquare(row, col, currentPlayer);
        currentPlayer = (currentPlayer === "𐄂") ? "○" : "𐄂";
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
        gameOver
    }
}


/* ------------------------ */
/* GUI and DOM manipulation */
/* ------------------------ */


