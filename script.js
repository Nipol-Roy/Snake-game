const board = document.querySelector(".board");
// console.log(board);

const boxHeight = 20;
const boxwidth = 20;

const cols = Math.floor(board.clientWidth / boxwidth);
const rows = Math.floor(board.clientHeight / boxHeight);

let blocks = [];
let direction = null;
let snakeMoveing;
let score = 0;
let highScore = 0;
let storedHighScore = JSON.parse(localStorage.getItem("highScore")) || 0;
let highScoreSelector = document.querySelector(".highScore");
const showModal = document.querySelector(".showModal");
const reStartBtn = document.querySelector("#reStart");
let scoreCounter = document.querySelector(".counter");
let finalScore = document.querySelector(".finalScore")

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

// console.log(food);

let snake = [{ x: 3, y: 5 }];

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const box = document.createElement("div");
    box.classList.add("box");
    board.appendChild(box);
    blocks[`${row}-${col}`] = box;
  }
}
// console.log(blocks);

function render() {
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("snake");
  });
  blocks[`${food.x}-${food.y}`].classList.add("food");
  if (!direction) {
    return;
  }
  let hade;

  if (direction == "left") {
    hade = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction == "right") {
    hade = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction == "up") {
    hade = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction == "down") {
    hade = { x: snake[0].x + 1, y: snake[0].y };
  }
  //   console.log(hade)
  //   let dHade = blocks[`${snake[0].x}-${snake[0].y}`].classList.add("snakeHade")
  //   console.log(dHade)
  // // console.log(snake[0])

  if (hade.x < 0 || hade.x >= rows || hade.y >= cols || hade.y < 0) {
    
    showModal.style.display = "flex";
    
    let finalScore = document.querySelector(".finalScore");
    finalScore.innerText = score;
    clearInterval(snakeMoveing);
    return;
  }
  //   console.log(hade);
  //   console.log(snake);

  if (snake.some((snake) => snake.x === hade.x && snake.y === hade.y)) {
    showModal.style.display = "flex";
    clearInterval(snakeMoveing);
    return;
  }

  blocks[`${food.x}-${food.y}`].classList.add("food");

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("snake");
  });

  snake.unshift(hade);
  snake.pop();

  //   console.log(snake)

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("snake");
  });

  if (food.x == snake[0].x && food.y == snake[0].y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };

    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(hade);

    score = score + 1;

    scoreCounter.innerText = score;
    finalScore.innerText = score

    if (score > storedHighScore) {
      storedHighScore = score;

      JSON.stringify(localStorage.setItem("highScore", storedHighScore));

      highScoreSelector.innerText = storedHighScore;
    }
  }
}
highScoreSelector.innerText = storedHighScore;
// console.log(storedHighScore);

addEventListener("keydown", (event) => {
  if (event.key == "ArrowDown" && direction !== "up") {
    direction = "down";
  } else if (event.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (event.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  } else if (event.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  }
});

// render();

function playGame() {
  snakeMoveing = setInterval(() => {
    render();
  }, 300);
}

playGame();

reStartBtn.addEventListener("click", () => {
  showModal.style.display = "none";
  direction = "";
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("snake");

    snake = [{ x: 3, y: 5 }];
    scoreCounter.innerText = 0;

    snake.forEach((segment) => {
      blocks[`${segment.x}-${segment.y}`].classList.add("snake");
    });
  });

  playGame();
});
