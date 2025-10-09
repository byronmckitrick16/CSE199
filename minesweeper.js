function main() {
    const grid = createGrid()
    placeMines(grid, 30)
    calculateAllNeighbors(grid)
    createBoard(grid)
}

function createGrid() {
    // when working on the other difficulties just make rows and cols = a parameter sent in by the addeventlistener to use this function each time no matter what the difficulty is
    let rows = 9;
    let colsEven = 8;
    let colsOdd = 7;
    let grid = [];

    for (let r = 0; r < rows; r++) {
        grid[r] = [];
        if (r % 2 === 0) {
            for (let c = 0; c < colsEven; c++) {
                grid[r][c] = {
                    mine: false,
                    revealed: false,
                    flagged: false,
                    neighbors: 0
                };
            }

        }else if (r % 2 === 1) {
            for (let c = 0; c < colsOdd; c++) {
                grid[r][c] = {
                    mine: false,
                    revealed: false,
                    flagged: false,
                    neighbors: 0
                };
            }
        }
    }
    return grid
}

function placeMines(grid, mineCount) {
    let placed = 0;

    while (placed < mineCount) {
        const row = Math.floor(Math.random() * grid.length);
        const col = Math.floor(Math.random() * grid[row].length);
        const cell = grid[row][col];

        if (!cell.mine) {
            cell.mine = true;
            placed++;
        }
    }
}

function countNeighbors(grid, row, col) {
    let mineCount = 0

    const oddOffsets = [
        [-1, -1],
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
    ];

    const evenOffsets = [
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, 0],
        [1, 1]
    ];
    let  offsets = []
    if (row % 2 === 0) {
        offsets = evenOffsets;
    } else {
        offsets = oddOffsets;
    }

    for (const [dRow, dCol] of offsets) {
        const nRow = row + dRow;
        const nCol = col + dCol;

        if (nRow < 0 || nRow >= grid.length) continue;
        if (nCol < 0 || nCol >= grid[nRow].length) continue;

        if (grid[nRow][nCol].mine === true) {
            mineCount++;
        }
    }
    return mineCount;
}

function calculateAllNeighbors(grid) {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            grid[r][c].neighbors = countNeighbors(grid, r, c);
        }
    }
}

function createBoard(grid) {
    const board = document.querySelector(".board");
    board.innerHTML = "";

    for (let r = 0; r < grid.length; r++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("hex_row");

        for (let c = 0; c < grid[r].length; c++) {
            const cell = grid[r][c]

            const hex = document.createElement("div");
            hex.classList.add("hex");

            hex.dataset.row = r;
            hex.dataset.col = c;

            hex.addEventListener("click", () => {
                revealHex(grid, r, c);
            });

            hex.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                toggleFlag(r, c);
            });

            rowDiv.appendChild(hex);
        }
        board.appendChild(rowDiv);
    }
}

function revealHex(grid, row, col) {
    const cell = grid[row][col];

    if (cell.revealed || cell.flagged) return;

    cell.revealed = true

    console.log(cell)
}

function getNeighbors() {

}

function revealNeighbors() {

}

function toggleFlag(r, c) {
    console.log(r, c)
}

function checkWin() {

}

function gameOver() {

}

function resetGame() {

}

const startGame = document.querySelector("#startGame");
startGame.addEventListener("click", main)