const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const tileSize = 20;
const gridWidth = canvas.width / tileSize;
const gridHeight = canvas.height / tileSize;

let food, snake;

function draw() {
    // draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    // draw snake
    ctx.fillStyle = "lime";
    snake.forEach(s => {
       ctx.fillRect(s.x * tileSize, s.y * tileSize, tileSize, tileSize); 
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
}

function gameLoop() {

}

function moveSnake() {

}

function checkCollision() {

}

resetGame()
spawnFood()
draw()