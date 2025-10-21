function createGrid(rows, colsOdd) {
    // create a grid for the layout of the minesweeper game
    let colsEven = colsOdd + 1
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
    // randomly place the mines troughout the grid
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
    // find how many mines are around each cell
    let mineCount = 0

    const evenOffsets = [
        [-1, -1],
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
    ];

    const oddOffsets = [
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
    // loop the countneighbor function for each cell in the grid
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            grid[r][c].neighbors = countNeighbors(grid, r, c);
        }
    }
}

function createBoard(grid, event) {
    // add the html for each cell in the game
    const board = document.querySelector(".board");
    board.innerHTML = "";

    for (let r = 0; r < grid.length; r++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("hex_row");

        for (let c = 0; c < grid[r].length; c++) {

            const hex = document.createElement("div");
            hex.classList.add("hex")

            addClassLevel(hex, event)

            hex.dataset.row = r;
            hex.dataset.col = c;

            hex.addEventListener("click", () => {
                revealHex(grid, r, c);
            });

            hex.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                toggleFlag(grid, r, c);
            });

            rowDiv.appendChild(hex);
        }
        board.appendChild(rowDiv);
    }
}

function addClassLevel(hex, event) {
    // add a class to the div elements depending on what level was selected
    if (event.target.id === "easyModeButton") {
        hex.classList.add("easyMode")
    } else if (event.target.id === "mediumModeButton") {
        hex.classList.add("mediumMode")
    } else if (event.target.id === "hardModeButton") {
        hex.classList.add("hardMode")
    }
}

function revealHex(grid, row, col) {
    // reveal if the cell is a mine or show the number of neighbors for each cell
    const cell = grid[row][col];

    if (cell.revealed || cell.flagged) return;

    cell.revealed = true

    const hex = document.querySelector(`.hex[data-row="${row}"][data-col="${col}"]`);

    hex.classList.add("revealed");
    
    if (cell.mine) {
        hex.classList.add("mine");
        hex.textContent = "💣";
        gameOver(grid);
        return;
    }

    if (cell.neighbors > 0) {
        hex.textContent = cell.neighbors;
    }
    checkWin(grid);
}

function toggleFlag(grid, row, col) {
    // flag each cell that the user thinks is a mine
    const cell = grid[row][col];
    console.log(cell)
    const hex = document.querySelector(`.hex[data-row="${row}"][data-col="${col}"]`);
    if (cell.revealed) return
    if (cell.flagged == true) {
        cell.flagged = false
        hex.textContent= " ";
    } else {
        cell.flagged = true
        hex.textContent = "🚩"
    }
}

function checkWin(grid) {
    // check to see if all not mine cells are revealed
    let allSafeCellsReaveled = true
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const cell = grid[r][c]

            if (!cell.mine && !cell.revealed) {
                allSafeCellsReaveled = false;
                break;
            }
        }
    }
    if (allSafeCellsReaveled) {
        gameWon(grid)
    }
}

function gameWon(grid) {
    // display a screen telling them they won
    const board = document.querySelector(".board")
    const winConfetti = '<img class="gameWinConfetti" src="confetti.gif" alt="animation for when you win"></img>'
    board.insertAdjacentHTML("beforeend", winConfetti)
    revealBoard(grid)
}

function gameOver(grid) {
    // display a screen telling them they lost and letting them see where all the mines were
    const board = document.querySelector(".board")
    const loseExplostion = '<img class="loseExplostion" src="explosion.gif" alt="animation for when you lose">'
    board.insertAdjacentHTML("beforeend", loseExplostion)
    revealBoard(grid);
}

function revealBoard(grid) {
    // reveal all of the cells
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const cell = grid[r][c]
            const hex = document.querySelector(`.hex[data-row="${r}"][data-col="${c}"]`);

            if (!cell.flagged) {
                hex.classList.add("revealed");
                if (cell.neighbors > 0) {
                    hex.textContent = cell.neighbors;
                }
                if (cell.mine) {
                    hex.classList.add("mine");
                    hex.textContent = "💣";
                }
            }
            if (!cell.mine && cell.flagged) {
                hex.classList.add("revealed");
                if (cell.neighbors > 0) {
                    hex.innerHTML = cell.neighbors;   
                } else {
                    hex.innerHTML = " "
                }
            }
        }
    }
}

function easyLevel(event) {
    const grid = createGrid(9, 7)
    placeMines(grid, 13)
    calculateAllNeighbors(grid)
    createBoard(grid, event)
}

function mediumLevel(event) {
    const grid = createGrid(9, 7)
    placeMines(grid, 10)
    calculateAllNeighbors(grid)
    createBoard(grid, event)
}

function hardLevel(event) {
    const grid = createGrid(9, 7)
    placeMines(grid, 10)
    calculateAllNeighbors(grid)
    createBoard(grid, event)
}

const easyMode = document.querySelector("#easyModeButton");
easyMode.addEventListener("click", easyLevel)

const mediumMode = document.querySelector("#mediumModeButton");
mediumMode.addEventListener("click", mediumLevel)

const hardMode = document.querySelector("#hardModeButton");
hardMode.addEventListener("click", hardLevel)

// function getNeighbors() {}
// function revealNeighbors() {}
// function resetGame() {}