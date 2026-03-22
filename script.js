const board = document.querySelector(".board");
// console.log(board);

const boxHeight = 20;
const boxwidth = 20;

const cols = Math.floor(board.clientWidth / boxwidth);
const rows = Math.floor(board.clientHeight / boxHeight);

let blocks = [];
let direction = "right";

let snakeMoveing;
let score = 0;
let highScore = 0;

let storedHighScore = JSON.parse(localStorage.getItem("highScore")) || 0;
let highScoreSelector = document.querySelector(".highScore");
const showModal = document.querySelector(".showModal");
const reStartBtn = document.querySelector("#reStart");
let scoreCounter = document.querySelector(".counter");
let finalScore = document.querySelector(".finalScore");
const notice = document.querySelector(".notice");

const startBtn = document.querySelector("#start");
const modalHome = document.querySelector(".modalHome");
const showModalHome = document.querySelector(".showModalHome");

const startingModal = document.querySelector(".startingModal");
const startingTimer = document.querySelector(".startingTimer");

const pause = document.querySelector(".pause");
const play = document.querySelector(".play");
const navTimer = document.querySelector(".nav-timer");
const timeCounter = document.querySelector(".timeCounter");

let timeLeft = `02:00`;
let speed = 300;

const OnPlayBg = "#68d391";
const OnPauseBg = "#6b240f";

let countingTimeIntervel = null;
let timerStatus = false;
let isPlayingGame = false

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
    notice.style.display = "flex";
    modalHome.style.display = "none";
    

    let finalScore = document.querySelector(".finalScore");
    finalScore.innerText = score;
    clearInterval(snakeMoveing);
    clearInterval(countingTimeIntervel);
    isPlayingGame = false
    return;
  }
  //   console.log(hade);
  //   console.log(snake);

  if (snake.some((snake) => snake.x === hade.x && snake.y === hade.y)) {
    showModal.style.display = "flex";
    notice.style.display = "flex";
   
    clearInterval(snakeMoveing);
    clearInterval(countingTimeIntervel);
     isPlayingGame = false
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

    if (timerStatus === true) {
      score = score + 13;
    } else {
      score = score + 8;
    }

    if (timerStatus === true) {
      speed = Math.max(50, speed - 10);
    } else {
      speed = Math.max(50, speed - 5);
    }
   
    console.log(speed);

    scoreCounter.innerText = score;
    finalScore.innerText = score;

    if (score > storedHighScore) {
      storedHighScore = score;

      JSON.stringify(localStorage.setItem("highScore", storedHighScore));

      highScoreSelector.innerText = storedHighScore;
    }

    playGame()
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
  if(isPlayingGame) return;

  snakeMoveing = setInterval(() => {
    render();
  }, speed);

  isPlayingGame = true
}


function showTime() {
  let StartingTimer;
  let timeCount = 4;

  let count = document.querySelector(".count");

  StartingTimer = setInterval(() => {
    startingModal.style.display = "flex";
    startingTimer.style.display = "flex";
    modalHome.style.display = "none";
    console.log("hello");
    timeCount--;

    count.innerText = timeCount;
    if (timeCount < 0) {
      startingModal.style.display = "none";
      startingTimer.style.display = "none";
      clearInterval(StartingTimer);
      playGame();
      if (timerStatus === true) {
        startTimeCounter();
      }
    }
  }, 1000);
}

function welcomeNotice() {
  showModalHome.style.display = "flex"; // off this game for some time
  modalHome.style.display = "flex";

  startBtn.addEventListener("click", () => {
    notice.style.display = "none";
    showTime();
  });
}
welcomeNotice();

function restartGame() {
  showModal.style.display = "none";
  notice.style.display = "none";
  direction = "";
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("snake");

    snake = [{ x: 3, y: 5 }];
    scoreCounter.innerText = 0;

    snake.forEach((segment) => {
      blocks[`${segment.x}-${segment.y}`].classList.add("snake");
    });
  });

  showTime();
  direction = "right";
  speed = 300

  showTime.onloded = () => {
    if (timerStatus === true) {
      startTimeCounter();
    }
  };
}
reStartBtn.addEventListener("click", () => {
  restartGame();
});

play.style.display = "none";

timeCounter.innerText = "00:00s";
navTimer.style.backgroundColor = OnPauseBg;

pause.addEventListener("click", () => {
  timerStatus = true;
  pause.style.display = "none";
  play.style.display = "flex";
  navTimer.style.backgroundColor = OnPlayBg;
  timeCounter.innerText = timeLeft + "s";
  console.log("hello world");
});

play.addEventListener("click", () => {
  timerStatus = false;
  play.style.display = "none";
  pause.style.display = "flex";
  navTimer.style.backgroundColor = OnPauseBg;
  clearInterval(countingTimeIntervel);
});

function startTimeCounter() {
  let [min, sec] = timeLeft.split(":").map(Number);

  countingTimeIntervel = setInterval(() => {
    if (sec == 0) {
      if (min == 0) {
        clearInterval(snakeMoveing);
        clearInterval(countingTimeIntervel);
        countingTimeIntervel = null;
        showModal.style.display = "flex";
        notice.style.display = "flex";

        return;
      } else {
        min--;
        sec = 59;
      }
    } else {
      sec--;
    }
    let formateMin = min < 10 ? "0" + min : min;
    let formateSec = sec < 10 ? "0" + sec : sec;

    timeCounter.innerText = `${formateMin}:${formateSec}s`;
    console.log(min, sec);
  }, 1000);
}
