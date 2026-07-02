function GameBoard() {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]
    
    const readSquare = (row, col) => {
        return board[row][col];
    }

    const writeToSquare = (row, col, symbol) => {
        if (readSquare(row, col) != "") {
            throw new Error("Attempt to write to a non-empty square");
        }
        board[row][col] = symbol;
    }

    return {
        readSquare,
        writeToSquare
    };
}