function createGrid() {
    // when working on the other difficulties just make rows and cols = a parameter sent in by the addeventlistener to use this function each time no matter what the difficulty is
    let rows = 9;
    let colsEven = 7;
    let colsOdd = 8;
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
    placeMines(grid, 30)
}
createGrid()
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
    countNeighbors(grid)
}

function countNeighbors(grid) {

}

function calculateAllNeighbors() {

}

function createBoard() {

}

function revealHex() {

}

function getNeighbors() {

}

function revealNeighbors() {

}

function toggleFlag() {

}

function checkWin() {

}

function gameOver() {

}

function resetGame() {

}