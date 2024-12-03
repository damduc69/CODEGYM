const chessboard = document.getElementById("chessboard");

const pieces = {
    r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟", // Black
    R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙"  // White
};

// Bàn cờ ban đầu
let board = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"]
];

// Trạng thái
let selectedPiece = null;
let turn = "white"; // Lượt chơi

// Tạo bàn cờ
function createBoard() {
    chessboard.innerHTML = "";
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.classList.add((row + col) % 2 === 0 ? "light" : "dark");
            tile.dataset.row = row;
            tile.dataset.col = col;

            const piece = board[row][col];
            if (piece) {
                tile.textContent = pieces[piece];
            }

            tile.addEventListener("click", () => handleTileClick(row, col));
            chessboard.appendChild(tile);
        }
    }
}

// Xử lý click vào ô
function handleTileClick(row, col) {
    if (selectedPiece) {
        // Đang chọn quân, thử di chuyển
        movePiece(row, col);
    } else {
        // Chọn quân cờ
        selectPiece(row, col);
    }
}

// Chọn quân cờ
function selectPiece(row, col) {
    const piece = board[row][col];
    if (!piece) return; // Ô trống
    if ((turn === "white" && piece === piece.toLowerCase()) || (turn === "black" && piece === piece.toUpperCase())) {
        return; // Không phải lượt của người chơi này
    }

    selectedPiece = { row, col, piece };
    highlightMoves(row, col);
}

// Di chuyển quân cờ
function movePiece(row, col) {
    if (!isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        selectedPiece = null;
        createBoard();
        return;
    }

    board[row][col] = selectedPiece.piece;
    board[selectedPiece.row][selectedPiece.col] = "";
    selectedPiece = null;

    // Đổi lượt
    turn = turn === "white" ? "black" : "white";
    createBoard();
}

// Tô sáng các ô có thể đi
function highlightMoves(row, col) {
    createBoard();
    const possibleMoves = getValidMoves(row, col);
    possibleMoves.forEach(([r, c]) => {
        const tile = document.querySelector(`.tile[data-row="${r}"][data-col="${c}"]`);
        tile.classList.add("highlight");
    });
}

function getValidMoves(row, col) {
    const moves = [];
    const piece = board[row][col].toLowerCase();
    const isWhite = board[row][col] === board[row][col].toUpperCase();

    const directions = {
        rook: [[1, 0], [0, 1], [-1, 0], [0, -1]],
        bishop: [[1, 1], [-1, 1], [-1, -1], [1, -1]],
        queen: [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [-1, -1], [1, -1]],
        knight: [
            [2, 1], [1, 2], [-1, 2], [-2, 1],
            [-2, -1], [-1, -2], [1, -2], [2, -1]
        ],
        king: [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [-1, -1], [1, -1]]
    };

    // Pawn
    if (piece === "p") {
        const direction = isWhite ? -1 : 1;
        if (board[row + direction] && board[row + direction][col] === "") {
            moves.push([row + direction, col]);
        }
        // Tấn công chéo
        [[row + direction, col - 1], [row + direction, col + 1]].forEach(([r, c]) => {
            if (board[r] && board[r][c] && board[r][c].toUpperCase() !== board[r][c].toLowerCase() && isWhite !== (board[r][c] === board[r][c].toUpperCase())) {
                moves.push([r, c]);
            }
        });
    }

    // Rook
    if (piece === "r" || piece === "q") {
        directions.rook.forEach(([dr, dc]) => {
            for (let i = 1; i < 8; i++) {
                const r = row + dr * i, c = col + dc * i;
                if (!board[r] || !board[r][c]) break;
                if (board[r][c] === "") {
                    moves.push([r, c]);
                } else {
                    if (isWhite !== (board[r][c] === board[r][c].toUpperCase())) moves.push([r, c]);
                    break;
                }
            }
        });
    }

    // Bishop
    if (piece === "b" || piece === "q") {
        directions.bishop.forEach(([dr, dc]) => {
            for (let i = 1; i < 8; i++) {
                const r = row + dr * i, c = col + dc * i;
                if (!board[r] || !board[r][c]) break;
                if (board[r][c] === "") {
                    moves.push([r, c]);
                } else {
                    if (isWhite !== (board[r][c] === board[r][c].toUpperCase())) moves.push([r, c]);
                    break;
                }
            }
        });
    }

    // Knight
    if (piece === "n") {
        directions.knight.forEach(([dr, dc]) => {
            const r = row + dr, c = col + dc;
            if (board[r] && board[r][c] !== undefined && (!board[r][c] || isWhite !== (board[r][c] === board[r][c].toUpperCase()))) {
                moves.push([r, c]);
            }
        });
    }

    // King
    if (piece === "k") {
        directions.king.forEach(([dr, dc]) => {
            const r = row + dr, c = col + dc;
            if (board[r] && board[r][c] !== undefined && (!board[r][c] || isWhite !== (board[r][c] === board[r][c].toUpperCase()))) {
                moves.push([r, c]);
            }
        });
    }

    return moves;
}
function isKingInCheck(isWhite) {
    let kingPosition;
    board.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            if (cell === (isWhite ? "K" : "k")) {
                kingPosition = [rIdx, cIdx];
            }
        });
    });

    return board.some((row, rIdx) =>
        row.some((cell, cIdx) => {
            if (cell && (cell === cell.toUpperCase()) !== isWhite) {
                const moves = getValidMoves(rIdx, cIdx);
                return moves.some(([r, c]) => r === kingPosition[0] && c === kingPosition[1]);
            }
        })
    );
}

function isCheckmate(isWhite) {
    if (!isKingInCheck(isWhite)) return false;

    // Nếu tất cả các nước đi đều không thể thoát khỏi chiếu
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] && (board[r][c] === board[r][c].toUpperCase()) === isWhite) {
                const validMoves = getValidMoves(r, c);
                for (const [nr, nc] of validMoves) {
                    const temp = board[nr][nc];
                    board[nr][nc] = board[r][c];
                    board[r][c] = "";
                    const stillInCheck = isKingInCheck(isWhite);
                    board[r][c] = board[nr][nc];
                    board[nr][nc] = temp;

                    if (!stillInCheck) return false;
                }
            }
        }
    }
    return true;
}
function aiMove() {
    // AI chọn nước đi ngẫu nhiên
    const allMoves = [];
    board.forEach((row, rIdx) =>
        row.forEach((cell, cIdx) => {
            if (cell && cell === cell.toLowerCase()) {
                const moves = getValidMoves(rIdx, cIdx);
                moves.forEach(move => allMoves.push({ from: [rIdx, cIdx], to: move }));
            }
        })
    );

    const move = allMoves[Math.floor(Math.random() * allMoves.length)];
    if (move) {
        board[move.to[0]][move.to[1]] = board[move.from[0]][move.from[1]];
        board[move.from[0]][move.from[1]] = "";
    }
    createBoard();
    turn = "white";
}
let timerWhite = 300;
let timerBlack = 300;
let interval;

function startTimer() {
    interval = setInterval(() => {
        if (turn === "white") {
            timerWhite--;
        } else {
            timerBlack--;
        }
        if (timerWhite === 0 || timerBlack === 0) {
            alert(`${turn === "white" ? "Black" : "White"} wins by timeout!`);
            clearInterval(interval);
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById("timer").innerText = `White: ${timerWhite}s | Black: ${timerBlack}s`;
}



// Kiểm tra nước đi hợp lệ
function isValidMove(startRow, startCol, endRow, endCol) {
    const validMoves = getValidMoves(startRow, startCol);
    return validMoves.some(([r, c]) => r === endRow && c === endCol);
}

// Khởi tạo bàn cờ
createBoard();
