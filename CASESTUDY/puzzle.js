const puzzleContainer = document.getElementById('puzzle');
const resetButton = document.getElementById('reset-btn');
const size = 3; // Kích thước của puzzle (3x3)
let puzzle = [];

// Tạo các mảnh ghép
function createPuzzle() {
    const pieces = [];
    for (let i = 1; i <= size * size - 1; i++) {
        pieces.push(i);
    }
    pieces.push(null); // Ô trống cuối cùng

    // Trộn các mảnh ghép
    puzzle = shuffle(pieces);

    renderPuzzle();
}

// Trộn mảng
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Vẽ lại puzzle
function renderPuzzle() {
    puzzleContainer.innerHTML = ''; // Xóa các mảnh ghép cũ

    puzzle.forEach((piece, index) => {
        const div = document.createElement('div');
        div.classList.add('piece');
        
        if (piece !== null) {
            div.textContent = piece;
            div.addEventListener('click', () => movePiece(index));
        } else {
            div.classList.add('empty');
        }

        puzzleContainer.appendChild(div);
    });
}

// Di chuyển mảnh ghép
function movePiece(index) {
    const emptyIndex = puzzle.indexOf(null);
    const [row, col] = [Math.floor(index / size), index % size];
    const [emptyRow, emptyCol] = [Math.floor(emptyIndex / size), emptyIndex % size];

    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
        // Swap vị trí của mảnh ghép và ô trống
        puzzle[emptyIndex] = puzzle[index];
        puzzle[index] = null;
        renderPuzzle();
        checkWin();
    }
}

// Kiểm tra nếu game đã hoàn thành
function checkWin() {
    const correctPuzzle = [];
    for (let i = 1; i < size * size; i++) {
        correctPuzzle.push(i);
    }
    correctPuzzle.push(null); // Ô trống cuối cùng

    if (JSON.stringify(puzzle) === JSON.stringify(correctPuzzle)) {
        alert('Chúc mừng bạn đã hoàn thành trò chơi!');
    }
}

// Reset game
resetButton.addEventListener('click', createPuzzle);

// Khởi tạo game khi tải trang
createPuzzle();
