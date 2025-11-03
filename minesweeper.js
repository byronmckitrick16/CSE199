let grid = [];
let timer;
let timeSec = 0;
let timeMin = 0;

function createGrid(rows, cols) {
    // create a grid for the layout of the minesweeper game
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
}

function placeMines(mineCount) {
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

function countNeighbors(row, col) {
    // find how many mines are around each cell
    let mineCount = 0

    const neighbors = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
    ];

    for (const [dRow, dCol] of neighbors) {
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

function calculateAllNeighbors() {
    // loop the countneighbor function for each cell in the grid
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            grid[r][c].neighbors = countNeighbors(r, c);
        }
    }
}

function createBoard(event) {
    // add the html for each cell in the game
    const board = document.querySelector(".board");

    for (let r = 0; r < grid.length; r++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        for (let c = 0; c < grid[r].length; c++) {

            const cell = document.createElement("div");
            cell.classList.add("cell")

            addClassLevel(cell, event)

            cell.dataset.row = r;
            cell.dataset.col = c;

            cell.addEventListener("click", () => {
                startTimer();
                revealHex(r, c);
            });

            cell.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                toggleFlag(r, c);
            });

            rowDiv.appendChild(cell);
        }
        board.appendChild(rowDiv);
    }
}

function addClassLevel(cell, event) {
    // add a class to the div elements depending on what level was selected
    if (event.target.id === "easyModeButton") {
        cell.classList.add("easyMode")
    } else if (event.target.id === "mediumModeButton") {
        cell.classList.add("mediumMode")
    } else if (event.target.id === "hardModeButton") {
        cell.classList.add("hardMode")
    }
}

function revealHex(row, col) {
    // reveal if the cell is a mine or show the number of neighbors for each cell
    const cell = grid[row][col];

    if (cell.revealed || cell.flagged) return;

    cell.revealed = true

    const cellDiv = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

    cellDiv.classList.add("revealed");
    
    if (cell.mine) {
        cellDiv.classList.add("mine");
        cellDiv.textContent = "💣";
        gameOver();
        return;
    }

    if (cell.neighbors > 0) {
        cellDiv.textContent = cell.neighbors;
    } else {
        setTimeout(revealNeighbors, 25, row, col)
    }

    checkWin();
}

function revealNeighbors(row, col) {
    const neighbors = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
    ];

    for (const [dRow, dCol] of neighbors) {
        const nRow = row + dRow;
        const nCol = col + dCol;
        const cellDiv = document.querySelector(`.cell[data-row="${nRow}"][data-col="${nCol}"]`);

        if (nRow < 0 || nRow >= grid.length) continue;
        if (nCol < 0 || nCol >= grid[nRow].length) continue;

        revealHex(nRow, nCol);
    }
}

function toggleFlag(row, col) {
    // flag each cell that the user thinks is a mine
    const cell = grid[row][col];
    const cellDiv = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (cell.revealed) return
    if (cell.flagged == true) {
        cell.flagged = false
        cellDiv.textContent= " ";
    } else {
        cell.flagged = true
        cellDiv.textContent = "🚩"
    }
}

function checkWin() {
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
        gameWon()
    }
}

function gameWon() {
    // display a screen telling them they won
    const board = document.querySelector(".board")
    const winConfetti = '<img class="gameWinConfetti animation" src="images/confetti.gif" alt="animation for when you win"></img>'
    board.insertAdjacentHTML("beforeend", winConfetti)
    revealBoard();
    stopTimer();
    setTimeout(stopAnimation, 5500)
}

function gameOver() {
    // display a screen telling them they lost and letting them see where all the mines were
    const board = document.querySelector(".board")
    const loseExplostion = '<img class="loseExplostion animation" src="images/explosion.gif" alt="animation for when you lose">'
    board.insertAdjacentHTML("beforeend", loseExplostion)
    revealBoard();
    stopTimer();
    setTimeout(stopAnimation, 2500)
}

function stopAnimation() {
    const animation = document.querySelector(".animation")
    animation.remove();
    clearTimeout();
}

function revealBoard() {
    // reveal all of the cells
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const cell = grid[r][c]
            const cellDiv = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);

            if (!cell.flagged) {
                cellDiv.classList.add("revealed");
                if (cell.neighbors > 0) {
                    cellDiv.textContent = cell.neighbors;
                }
                if (cell.mine) {
                    cellDiv.classList.add("mine");
                    cellDiv.textContent = "💣";
                }
            }
            if (!cell.mine && cell.flagged) {
                cellDiv.classList.add("revealed");
                if (cell.neighbors > 0) {
                    cellDiv.innerHTML = cell.neighbors;   
                } else {
                    cellDiv.innerHTML = " "
                }
            }
        }
    }
}

function easyLevel(event) {
    reset()
    createGrid(10, 10)
    placeMines(15)
    calculateAllNeighbors() 
    createBoard(event)
}

function mediumLevel(event) {
    reset()
    createGrid(15, 15)
    placeMines(34)
    calculateAllNeighbors()
    createBoard(event)
}

function hardLevel(event) {
    reset()
    createGrid(20, 20) // try a 15x15 grid to see how that would work or maybe a 20x20 grid and medium 15x15 or 12x12
    placeMines(80)
    calculateAllNeighbors()   
    createBoard(event)
}

function startTimer() {
    timer ??= setInterval(returnTime, 1000)
}

function stopTimer() {
        clearInterval(timer)
        timer = null
}

function returnTime() {
    timeSec += 1;
    if (timeSec > 59) {
        timeSec = 0;
        timeMin += 1;
    }

    const timerEl = document.querySelector("#timer")

    if (timeSec < 10) {
        timerEl.innerHTML = `${timeMin}:0${timeSec}`
    } else {
        timerEl.innerHTML = `${timeMin}:${timeSec}`
    }
}

function reset() {
    const board = document.querySelector(".board");
    board.innerHTML = "";

    grid = []

    stopTimer();
    timeSec = 0
    timeMin = 0
    document.querySelector("#timer").innerHTML = "0:00"
}

const easyMode = document.querySelector("#easyModeButton");
easyMode.addEventListener("click", easyLevel)

const mediumMode = document.querySelector("#mediumModeButton");
mediumMode.addEventListener("click", mediumLevel)

const hardMode = document.querySelector("#hardModeButton");
hardMode.addEventListener("click", hardLevel)