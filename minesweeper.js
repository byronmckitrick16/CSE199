function createGrid() {
    // when working on the other difficulties just make rows and cols = a parameter sent in by the addeventlistener to use this function each time no matter what the difficulty is
    let rows = 9;
    let cols = 7;
    let grid = [];

    for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
            grid[r][c] = {
                mine: false,
                revealed: false,
                flagged: false,
                neighbors: 0
            };
        }
    }
    placeMines(grid)
}
createGrid()
function placeMines(grid) {
    
}

function countNeighbors() {

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