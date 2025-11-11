const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const tileSize = 20;
const gridWidth = canvas.width / tileSize;
const gridHeight = canvas.height / tileSize;

let food, snake, direction, score, speed, startGame;

function draw() {
    const img = new Image();
    img.src = "images/snake_food1.png";

    for (let x=0; x < gridWidth; x++) {
        for (let y=0; y < gridHeight; y++) {
            if ((y+x) % 2 == 0) {
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
    ctx.fillStyle = "#25aa0bff";
    snake.forEach(s => {
       ctx.fillRect(s.x * tileSize, s.y * tileSize, tileSize, tileSize);
    //    ctx.moveTo(s.x * tileSize, s.y * tileSize)
    //    ctx.lineTo(s.x * tileSize, s.y * tileSize + tileSize)
    });
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * gridWidth),
        y: Math.floor(Math.random() * gridHeight)   
    }
}

function resetGame() {
    snake = [
        {x:10, y:10},
        {x:9, y:10},
        {x:8, y:10}
    ]

    direction = {x:1, y:0};
    score = 0
    speed = 120
    spawnFood()
}

function gameLoop() {
    moveSnake();

    if (checkCollision()) {
        alert("Game Over! Final Score: " + score);
        clearTimeout(gameLoop)
        resetGame();
    }

    draw();
    setTimeout(gameLoop, speed);
}

function moveSnake() {
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    }

    snake.unshift(head);

    if (head.x == food.x && head.y == food.y) {
        score++;
        spawnFood();
        if (speed > 60) speed -= 2;
    } else {
        snake.pop();
    }
}

function checkCollision() {
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

    return false;
}

document.addEventListener("keydown", e => {
    if (e.key == "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight") {
        e.preventDefault()
    }
    if (e.key == "ArrowUp" && direction.y == 0) direction = {x:0, y:-1};
    else if (e.key == "ArrowDown" && direction.y == 0) direction = {x:0, y:1};
    else if (e.key == "ArrowLeft" && direction.x == 0) direction = {x:-1, y:0};
    else if (e.key == "ArrowRight" && direction.x == 0) direction = {x:1, y:0};
});

document.addEventListener("keydown", e => {
    if (!startGame) {
        startGame = true;
        gameLoop();
    }
});

resetGame();
draw();