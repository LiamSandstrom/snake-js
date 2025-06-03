//----- Grid stuff -----//
const container = document.querySelector("#container");
const cells = [];
let tickRef;

/**
 * TODO:
 * spawn apples at random squares
 * make apples spawn with more logic
 * worm-whole
 **/

//----- Snake -----//
let length = 5;
let currCords;
const snakeCords = [];
let dir = "r";
let lastDir = "r";

//----- Start -----//
beginPlay();
function beginPlay() {
  fillCells();
  console.log(cells);

  createSnake();
  //tick();
  tickRef = setInterval(() => tick(), 100);
}

//----- Tick -----//
function tick() {
  console.log("tick");
  move();
}

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

function indexToCords(value) {
  const rowCalc = (value % 16) + "";
  const x = parseFloat(rowCalc.at(0)) - 1;
  const y = value - x * 16;

  return [x, y];
}

function cordsToIndex(x, y) {
  return x * 16 + y;
}

function move() {
  lastDir = dir;
  const x = snakeCords[snakeCords.length - 1].at(0);
  const y = snakeCords[snakeCords.length - 1].at(1);

  const endX = snakeCords[0].at(0);
  const endY = snakeCords[0].at(1);

  console.log(snakeCords);

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
      snakeCords.shift();
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
      snakeCords.shift();
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
      snakeCords.shift();
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
      snakeCords.shift();
      break;
  }

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

}

  function cellToSnake(x, y){
    if(x < 0 || x > 15 || y < 0 || y > 15) return;
    if(snakeCollision(x, y)) return;

    cells.at(cordsToIndex(x, y)).classList.add("snake");
  } 

  function removeSnakeCell(x, y){
    if(x < 0 || x > 15 || y < 0 || y > 15) return;
    cells.at(cordsToIndex(x, y)).classList.remove("snake");
  }

  function snakeCollision(x, y){
    if(cells.at(cordsToIndex(x, y)).classList.contains("snake")){
        die();
        return true;
    }
    return false;
  }

  function die(){
    clearInterval(tickRef);
    console.log("DIE");
  }
