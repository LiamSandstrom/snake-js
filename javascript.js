//----- Grid stuff -----//
const container = document.querySelector("#container");
const cells = [];

/**
 * TODO:
 * fix going into wall = come out other side
 * make snake cells use class instead of just bg
 * lose when going in to yourself
 * spawn apples at random squares
 * make apples spawn with more logic
 **/

//----- Snake -----//
let length = 3;
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
  setInterval(() => tick(), 100);
}

//----- Tick -----//
function tick() {
  move();
  console.log("tick");
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
    cells.at(cordsToIndex(7, y)).style.backgroundColor = "yellow";
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
        cells.at(cordsToIndex(x, 0)).style.backgroundColor = "yellow";
        snakeCords.push([x, 0]);
      } else {
        cells.at(cordsToIndex(x, y + 1)).style.backgroundColor = "yellow";
        snakeCords.push([x, y + 1]);
      }
      cells.at(cordsToIndex(endX, endY)).style.backgroundColor = "black";
      snakeCords.shift();
      break;

    case "l":
      if (y - 1 < 0) {
        cells.at(cordsToIndex(x, 15)).style.backgroundColor = "yellow";
        snakeCords.push([x, 15]);
      } else {
        cells.at(cordsToIndex(x, y - 1)).style.backgroundColor = "yellow";
        snakeCords.push([x, y - 1]);
      }
      cells.at(cordsToIndex(endX, endY)).style.backgroundColor = "black";
      snakeCords.shift();
      break;

    case "u":
      if (x - 1 < 0) {
        cells.at(cordsToIndex(15, y)).style.backgroundColor = "yellow";
        snakeCords.push([15, y]);
      } else {
        cells.at(cordsToIndex(x - 1, y)).style.backgroundColor = "yellow";
        snakeCords.push([x - 1, y]);
      }
      cells.at(cordsToIndex(endX, endY)).style.backgroundColor = "black";
      snakeCords.shift();
      break;

    case "d":
      if (x + 1 > 15) {
        cells.at(cordsToIndex(0, y)).style.backgroundColor = "yellow";
        snakeCords.push([0, y]);
      } else {
        cells.at(cordsToIndex(x + 1, y)).style.backgroundColor = "yellow";
        snakeCords.push([x + 1, y]);
      }
      cells.at(cordsToIndex(endX, endY)).style.backgroundColor = "black";
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
