const board = document.getElementById('board');
const message = document.getElementById('message');
let currentPlayer = 'X';  // Player 'X' starts
let gameBoard = Array(24 * 24).fill(null);  // Board state (24x24 = 576 cells)

function renderBoard() {
    board.innerHTML = '';  // Clear the board
    gameBoard.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        
        // If the cell has a value (X or O), add the corresponding class
        if (cell) {
            cellDiv.classList.add(cell);  // Add class 'X' or 'O'
        }

        cellDiv.textContent = cell;
        cellDiv.addEventListener('click', () => handleCellClick(index));
        board.appendChild(cellDiv);
    });
}

function handleCellClick(index) {
    if (gameBoard[index] || checkWinner()) return;  // Cell already filled or game over

    gameBoard[index] = currentPlayer;  // Mark the cell
    if (checkWinner()) {
        message.textContent = `${currentPlayer} wins!`;
    } else if (gameBoard.every(cell => cell !== null)) {
        message.textContent = "It's a draw!";
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  // Switch player
        message.textContent = `${currentPlayer}'s turn`;
    }
    renderBoard();
}

function checkWinner() {
    // Check horizontal, vertical, and diagonal lines for a win
    for (let row = 0; row < 24; row++) {
        for (let col = 0; col < 24; col++) {
            if (gameBoard[row * 24 + col] && 
                checkDirection(row, col, 1, 0) ||  // Check right
                checkDirection(row, col, 0, 1) ||  // Check down
                checkDirection(row, col, 1, 1) ||  // Check diagonal down-right
                checkDirection(row, col, 1, -1)) { // Check diagonal down-left
                return true;
            }
        }
    }
    return false;
}

function checkDirection(row, col, dRow, dCol) {
    const start = gameBoard[row * 24 + col];
    if (!start) return false;

    for (let i = 1; i < 5; i++) {  // Check for 5 consecutive marks
        const r = row + dRow * i;
        const c = col + dCol * i;
        if (r < 0 || r >= 24 || c < 0 || c >= 24 || gameBoard[r * 24 + c] !== start) {
            return false;
        }
    }
    return true;
}

renderBoard();
message.textContent = `${currentPlayer}'s turn`;
