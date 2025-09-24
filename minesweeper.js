const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const size = 25; // hex size
const rows = 10;
const cols = 10;
const mines = 15;

// Neighbor offsets (odd-r layout)
const neighborsOddR = {
    even: [
        [+1, 0], [0, -1], [-1, -1],
        [-1, 0], [-1, +1], [0, +1]
    ],
    odd: [
        [+1, 0], [+1, -1], [0, -1],
        [-1, 0], [0, +1], [+1, +1]
    ]
};

function getNeighbors(col, row) {
    const parity = row % 2 === 0 ? "even" : "odd";
    return neighborsOddR[parity].map(([dx, dy]) => [col + dx, row + dy]);
}

function createBoard(cols, rows, mineCount) {
    let board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, number: 0, revealed: false }))
    );

    let placed = 0;
    while (placed < mineCount) {
        let c = Math.floor(Math.random() * cols);
        let r = Math.floor(Math.random() * rows);
        if (!board[r][c].mine) {
            board[r][c].mine = true;
            placed++;
        }
    }

    for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        if (board[r][c].mine) continue;
        let neighbors = getNeighbors(c, r);
        board[r][c].number = neighbors.filter(([nc, nr]) =>
        board[nr]?.[nc]?.mine
        ).length;
    }
    }
return board;
}
function hexToPixel(col, row, size) {
    ctx.fillText(tile.number, x, y);
}


function pixelToHex(mx, my) {
    for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        let { x, y } = hexToPixel(c, r, size);
        let dx = mx - x;
        let dy = my - y;
        if (Math.sqrt(dx*dx + dy*dy) < size) {
            return [c, r];
        }
    }
    }
return null;
}

function floodReveal(c, r) {
    let stack = [[c, r]];
    while (stack.length) {
        let [cc, rr] = stack.pop();
        let tile = board[rr]?.[cc];
        if (!tile || tile.revealed) continue;
        tile.revealed = true;
        if (tile.number === 0 && !tile.mine) {
        getNeighbors(cc, rr).forEach(([nc, nr]) => stack.push([nc, nr]));
        }
    }
}

canvas.addEventListener("click", (e) => {
    let rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;
    let pos = pixelToHex(mx, my);
    if (pos) {
        let [c, r] = pos;
        let tile = board[r][c];
        if (tile.mine) {
            alert("Game Over!");
            board.forEach(row => row.forEach(t => t.revealed = true));
        } else {
            floodReveal(c, r);
        }
    drawBoard();
    }
});

let board = createBoard(cols, rows, mines);
drawBoard();