const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const tileSize = 20;
const gridWidth = canvas.width / tileSize;
const gridHeight = canvas.height / tileSize;

let food, snake, direction, score, speed, startGame, running, gameOver;
let ladder = 0
let deadSnake = []

function draw() {
    // draw the different things for the game on te canvas
    const img = new Image();
    img.src = "images/snake_food.png";

    // draw checkered grid
    for (let x=0; x < gridWidth; x++) {
        for (let y=0; y < gridHeight; y++) {
            if ((y + x) % 2 == 0) {
                ctx.fillStyle = "#2F2D2E"
            } else {
                ctx.fillStyle = "#2E4057"
            }
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
        }
    }

    // draw food
    ctx.drawImage(img, food.x * tileSize, food.y * tileSize);

    // draw snake
    snake.forEach(s => { 
        const x = s.x * tileSize;
        const y = s.y * tileSize;
        ctx.fillStyle = "#25aa0bff";
        ctx.roundRect(x, y, tileSize, tileSize, 5)
        ctx.fill()
    });

    drawDeadSnake()

    // draw the eyes on the snake
    const offset = tileSize / 4;
    const x = snake[0].x * tileSize;
    const y = snake[0].y * tileSize;
    ctx.fillStyle = "black"
    ctx.beginPath();
    if (direction.x == 0) {
        ctx.arc(x + tileSize / 2 - offset / 1.5, y + tileSize / 2 - offset / 2, 2, 0, Math.PI * 2);
        ctx.arc(x + tileSize / 2 + offset / 1.5, y + tileSize / 2 - offset / 2, 2, 0, Math.PI * 2);
    } else {
        ctx.arc(x + tileSize / 2 - offset / 2, y + tileSize / 2 - offset / 1.5, 2, 0, Math.PI * 2);
        ctx.arc(x + tileSize / 2 - offset / 2, y + tileSize / 2 + offset / 1.5, 2, 0, Math.PI * 2);
    }
    ctx.fill()
}

function drawDeadSnake() {
    deadSnake.forEach(snake => {
        snake.forEach(s => {
            const x = s.x * tileSize;
            const y = s.y * tileSize;
            ctx.fillStyle = "#25aa0bff"
            ctx.roundRect(x, y, tileSize, tileSize, 5)
            ctx.fill()
        })
    })
}

function spawnFood() {
    // get random spot on canvas for the food to be
    food = {
        x: Math.floor(Math.random() * gridWidth),
        y: Math.floor(Math.random() * gridHeight)   
    }

    for (let i = 0; i < deadSnake.length; i++) {
        for (let j = 0; j < deadSnake[i].length; j++) {
            if (deadSnake[i][j].x == food.x && deadSnake[i][j].y == food.y) {
                spawnFood();
            }
        }
    }
}

function restartGame() {
    gameOver = false;
    score = 5
    deadSnake = []
    resetGame();
}

function resetGame() {
    snake = [
        {x:10, y:10},
        {x:9, y:10},
        {x:8, y:10}
    ]

    direction = {x:1, y:0};
    score -= 5
    speed = 120
    startGame = false;
    running = false;
    spawnFood()
    inputScore()
    draw()

    if (gameOver) {
        const gameOverDiv = document.querySelector(".gameOver");
        gameOverDiv.remove();
        gameOver = false;
    }
}

function gameLoop() {
    // loop so that the snake looks like it is moving starting at 120 milisec and speeding up by 2 milisec every time they score till it gets to 60 milisec
    if (!running) return;

    moveSnake();

    if (checkCollision()) {
        const gameOverDiv = `<div class="gameOver">
                <p>Current Score: ${(score - 5)}</p>
                <button class="restart">Continue</button></div>`
        const contentDiv = document.querySelector(".gameContent")
        contentDiv.insertAdjacentHTML("beforeend", gameOverDiv)
        running = false;

        const restartButton = document.querySelector(".restart");
        restartButton.addEventListener("click", resetGame);
        gameOver = true;
        setHighScore();
        saveSnake();
        return
    }

    draw();
    const snakeLoop = setTimeout(gameLoop, speed);
}

function saveSnake() {
    deadSnake.push(snake)
}

function moveSnake() {
    // gives the new inputs for where the snake should be and check if the user got to the food
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    }

    snake.unshift(head);
    addScore(head);
}

function addScore(head) {
    if (head.x == food.x && head.y == food.y) {
        score++;
        spawnFood();
        inputScore();
        if (speed > 60) speed -= 2;
    } else {
        snake.pop();
    }
}

function checkCollision() {
    // see if the user hit a wall or hit another part of the snake
    const head = snake[0];

    if (
        head.x < 0 ||
        head.x >= gridWidth ||
        head.y < 0 ||
        head.y >= gridHeight
    ) return true;

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x == head.x && snake[i].y == head.y) return true;
    }

    for (let i = 0; i < deadSnake.length; i++) {
        for (let j = 0; j < deadSnake[i].length; j++) {
            if (deadSnake[i][j].x == head.x && deadSnake[i][j].y == head.y) return true;
        }
    }

    return false;
}

function inputScore() {
    // update the scoreboard everytime they score
    scoreDiv = document.querySelector(".score")
    scoreDiv.innerHTML = `<p>Score: ${score}</p>`
}

function setHighScore() {
    // save the users high score to local storage and check if a new score is better then the previous high score
    let highScore = localStorage.getItem("ladderSnakeHighScore")
    if (!highScore) {
        highScore = 0
    }
    highScore = Number(highScore)

    if (score > highScore) {
        highScore = score
        localStorage.setItem("ladderSnakeHighScore", highScore)
    }
    highScoreToHtml(highScore)
}

function highScoreToHtml(highScore) {
    // put the highscore in the div to display to the user
    const highScoreDiv = document.querySelector(".highScore")
    highScoreDiv.innerHTML = `<p>High Score: ${highScore}</p>`
}

document.addEventListener("keydown", e => {
    if (e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "ArrowLeft" || e.key == "ArrowRight") {
        e.preventDefault()
    }
    if (e.key == "ArrowUp" && direction.y == 0) direction = {x:0, y:-1};
    else if (e.key == "ArrowDown" && direction.y == 0) direction = {x:0, y:1};
    else if (e.key == "ArrowLeft" && direction.x == 0) direction = {x:-1, y:0};
    else if (e.key == "ArrowRight" && direction.x == 0) direction = {x:1, y:0};
});

document.addEventListener("keydown", e => {
    if (!startGame && (e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "ArrowLeft" || e.key == "ArrowRight")) {
        startGame = true;
        running = true;
        gameLoop();
    }
});

document.querySelector(".reset").addEventListener("click", restartGame)

restartGame();
setHighScore()