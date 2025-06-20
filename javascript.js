//----- Grid stuff -----//
const container = document.querySelector("#container");
const cells = [];
let tickRef;

//----- Scoreboard vars -----//
const scoreboard = document.querySelector(".scoreboard");
const scoreText = document.querySelector(".score");
const highScoreText = document.querySelector(".high-score");

//----- Info Panel vars -----//
const infoBtn = document.querySelector(".info-btn");
const infoPanel = document.querySelector(".info-panel");
const infoCloseBtn = document.querySelector(".info-close-btn");

//----- Snake vars -----//
let length = 3;
let currCords;
const snakeCords = [];
let dir = "r";
let lastDir = "r";
let score = 0;
let jumpDist = 3;
let newHighScore = false;

//const snakeLight = getComputedStyle(document.documentElement).getPropertyValue("--snake-light").trim();
//const snakeColor = document.documentElement.style.getPropertyValue("--snake-color");
//const wormholeColor = document.documentElement.style.getPropertyValue("--snake-wormhole-color");
let isWormholeMode = false;
let wormholeEnd = 0;
const normalHue = 109;    // Green hue
const wormholeHue = 296;  // Purple hue
const normalLight = 55;   // Normal lightness
const brightLight = 70;   // Pickup lightness

//----- Start -----//
beginPlay();
function beginPlay() {
  fillCells();
  updateSnakeColor();
  createSnake();
  //tick();
  tickRef = setInterval(() => tick(), 90);
  spawnApple();

  if(localStorage.getItem("visited") == null){
    localStorage.setItem("highScore", 0);
  }
  localStorage.setItem("visited", 1);
  highScoreText.textContent = localStorage.getItem("highScore");
}

//----- Tick -----//
function tick() {
  move();
}

//----- pre-game -----//
function fillCells() {
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      const cell = document.createElement("div");
      cell.classList = `cell`;
      cells.push(cell);
      container.appendChild(cell);
    }
  }
}

function createSnake() {
  const startPos = 6;
  for (let y = startPos; y < startPos + length; y++) {
    cellToSnake(7, y);
    snakeCords.push([7, y]);
  }
}

function updateSnakeColor(lightness = normalLight) {
    const hue = isWormholeMode ? wormholeHue : normalHue;
    const color = `hsl(${hue}, 78%, ${lightness}%)`;
    document.documentElement.style.setProperty("--snake-color", color);
}

//---- Movement ----//
function move() {
  lastDir = dir;
  const x = snakeCords[snakeCords.length - 1].at(0);
  const y = snakeCords[snakeCords.length - 1].at(1);

  const endX = snakeCords[0].at(0);
  const endY = snakeCords[0].at(1);

  switch (dir) {
    case "r":
      if (y + 1 > 15) {
        cellToSnake(x, 0);
        snakeCords.push([x, 0]);
      } else {
        cellToSnake(x, y + 1);
        snakeCords.push([x, y + 1]);
      }
      removeSnakeCell(endX, endY);
      break;

    case "l":
      if (y - 1 < 0) {
        cellToSnake(x, 15);
        snakeCords.push([x, 15]);
      } else {
        cellToSnake(x, y - 1);
        snakeCords.push([x, y - 1]);
      }
      removeSnakeCell(endX, endY);
      break;

    case "u":
      if (x - 1 < 0) {
        cellToSnake(15, y);
        snakeCords.push([15, y]);
      } else {
        cellToSnake(x - 1, y);
        snakeCords.push([x - 1, y]);
      }
      removeSnakeCell(endX, endY);
      break;

    case "d":
      if (x + 1 > 15) {
        cellToSnake(0, y);
        snakeCords.push([0, y]);
      } else {
        cellToSnake(x + 1, y);
        snakeCords.push([x + 1, y]);
      }
      removeSnakeCell(endX, endY);
      break;
  }
}

function wormHole() {
    if(isWormholeMode) return;
  console.log(snakeCords[snakeCords.length - 1].at(0));
  const currX = snakeCords[snakeCords.length - 1].at(0);
  const currY = snakeCords[snakeCords.length - 1].at(1);
  cells.at(cordsToIndex(currX, currY)).classList.remove("snake");
  snakeCords.pop();
  wormHoleAnimation();
  switch (dir) {
    case "r":
      if (currY + jumpDist > 15) {
        cellToSnake(currX, currY + jumpDist - 15);
        snakeCords.push([currX, currY + jumpDist - 15]);
        wormholeEnd = [currX, currY + jumpDist - 15];
      } else {
        cellToSnake(currX, currY + jumpDist);
        snakeCords.push([currX, currY + jumpDist]);
        wormholeEnd = [currX, currY + jumpDist];
      }
      break;

    case "l":
      if (currY - jumpDist < 0) {
        cellToSnake(currX, currY - jumpDist + 15);
        snakeCords.push([currX, currY - jumpDist + 15]);
        wormholeEnd = [currX, currY - jumpDist + 15];
      } else {
        cellToSnake(currX, currY - jumpDist);
        snakeCords.push([currX, currY - jumpDist]);
        wormholeEnd = [currX, currY - jumpDist];
      }
      break;

    case "u":
      if (currX - jumpDist < 0) {
        cellToSnake(currX - jumpDist + 15, currY);
        snakeCords.push([currX - jumpDist + 15, currY]);
        wormholeEnd = [currX - jumpDist + 15, currY];
      } else {
        cellToSnake(currX - jumpDist, currY);
        snakeCords.push([currX - jumpDist, currY]);
        wormholeEnd = [currX - jumpDist, currY];
      }
      break;

    case "d":
      if (currX + jumpDist > 15) {
        cellToSnake(currX + jumpDist - 15, currY);
        snakeCords.push([currX + jumpDist - 15, currY]);
        wormholeEnd = [currX + jumpDist - 15, currY];
      } else {
        cellToSnake(currX + jumpDist, currY);
        snakeCords.push([currX + jumpDist, currY]);
        wormholeEnd = [currX + jumpDist, currY];
      }
      break;
  }
}

//---- Converters ----//
function indexToCords(value) {
  const rowCalc = (value % 16) + "";
  const x = parseFloat(rowCalc.at(0)) - 1;
  const y = value - x * 16;

  return [x, y];
}

function cordsToIndex(x, y) {
  return x * 16 + y;
}

//----- Input -----//
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "d":
      if (lastDir == "l") return;
      dir = "r";
      break;
    case "a":
      if (lastDir == "r") return;
      dir = "l";
      break;
    case "w":
      if (lastDir == "d") return;
      dir = "u";
      break;
    case "s":
      if (lastDir == "u") return;
      dir = "d";
      break;
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case " ":
      wormHole();
      break;
  }
});

//----- Cell manipulation -----//
function cellToSnake(x, y) {
  if (x < 0 || x > 15 || y < 0 || y > 15) return;
  if (snakeCollision(x, y)) return;

  cells.at(cordsToIndex(x, y)).classList.add("snake");
  calcWormholeEnd();
}

function removeSnakeCell(x, y) {
  if (x < 0 || x > 15 || y < 0 || y > 15) return;
  if (snakeCords.length <= length) return;
  cells.at(cordsToIndex(x, y)).classList.remove("snake");
  snakeCords.shift();
}

//----- Snake logic -----//
function snakeCollision(x, y) {
  if (cells.at(cordsToIndex(x, y)).classList.contains("snake")) {
    die();
    return true;
  }
  if (cells.at(cordsToIndex(x, y)).classList.contains("apple")) {
    length++;
    cells.at(cordsToIndex(x, y)).classList.remove("apple");
    spawnApple();
    score += 100;
    pickupAnimation();
  }
  return false;
}

function die() {
  clearInterval(tickRef);
  if (score > localStorage.getItem("highScore")) {
    console.log(localStorage.getItem("highScore"));
    localStorage.setItem("highScore", score);
    newHighScore = true;
  }
  animateScoreboard();
}

//----- Appool -----//
function spawnApple() {
  const snakeHead = snakeCords.at(snakeCords.length - 1);
  let appleX;
  let appleY;
  if (snakeHead.at(0) > 7) {
    appleX = randNumb(1, 4);
  } else {
    appleX = randNumb(10, 14);
  }
  if (snakeHead.at(1) > 7) {
    appleY = randNumb(1, 4);
  } else {
    appleY = randNumb(10, 14);
  }
  cells.at(cordsToIndex(appleX, appleY)).classList.add("apple");
}

//----- helpers -----//
function randNumb(min, max) {
  let numb = Math.floor(Math.random() * (max + 1));
  if (numb < min) {
    return min;
  }
  return numb;
}

function calcWormholeEnd(){
    if(!isWormholeMode) return;

    const tailX = snakeCords[0][0];
    const tailY = snakeCords[0][1];
    const endX = wormholeEnd[0];
    const endY = wormholeEnd[1];
    
    console.log(`Tail: [${tailX}, ${tailY}]  End: [${endX}, ${endY}]`);
    
    if(tailX === endX && tailY === endY){
        isWormholeMode = false;
        updateSnakeColor();
        console.log("Wormhole mode ended!");
    }
}

//----- UI / Animations -----//
function animateScoreboard() {
  scoreboard.animate(
    [
      { transform: "scale(0)", offset: 0 },
      { transform: "scale(1.2)", offset: 0.4 },
      { transform: "scale(0.9)", offset: 0.8 },
      { transform: "scale(1)", offset: 1 },
    ],
    {
      duration: 400,
      fill: "forwards",
    }
  );
  setTimeout(() => animateScore(), 300);
}

function animateScore() {
  const timerRef = setInterval(() => {
    const currScore = parseInt(scoreText.textContent);
    const newScore = currScore + 10;
    scoreText.textContent = newScore;
    if (newScore >= score) {
      clearInterval(timerRef);
      if (newHighScore) {
        setTimeout(() => animateHighScore(), 100);
      } else {
        scoreText.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.2)" },
            { transform: "scale(1.22)" },
            { transform: "scale(1.25)" },
            { transform: "scale(1)" },
          ],
          {
            duration: 300,
            fill: "forwards",
          }
        );
      }
    }
  }, 14);
}

function animateHighScore() {
  const timerRef = setInterval(() => {
    const currScore = parseInt(highScoreText.textContent);
    const newScore = currScore + 10;
    highScoreText.textContent = newScore;
    if (newScore >= score) {
      clearInterval(timerRef);
      highScoreText.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.6)" },
          { transform: "scale(1.62)" },
          { transform: "scale(1.55)" },
          { transform: "scale(1.1)" },
        ],
        {
          duration: 300,
          fill: "forwards",
        }
      );
    }
  }, 8);
}

infoBtn.addEventListener("click", () => {
  infoPanel.style.visibility = "visible";
});

infoCloseBtn.addEventListener("click", () => {
  infoPanel.style.visibility = "hidden";
});

function wormHoleAnimation() {
    isWormholeMode = true;
    updateSnakeColor();
}

function pickupAnimation() {
    updateSnakeColor(brightLight);
    setTimeout(() => {
        updateSnakeColor();
    }, 120);
}