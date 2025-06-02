//----- Grid stuff -----//
const container = document.querySelector("#container");
const cells = [];

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
  setInterval(() => tick(), 300);
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
      cells.at(cordsToIndex(x, y + 1)).style.backgroundColor = "yellow";
      cells.at(cordsToIndex(endX, endY)).style.backgroundColor = "black";
      snakeCords.shift();
      snakeCords.push([x, y + 1]);
      break;

    case "l":
      cells.at(cordsToIndex(x, y - 1)).style.backgroundColor = "yellow";
      cells.at(cordsToIndex(endX, endY)).style.backgroundColor = "black";
      snakeCords.shift();
      snakeCords.push([x, y - 1]);
      break;

    case "u":
      cells.at(cordsToIndex(x - 1, y)).style.backgroundColor = "yellow";
      cells.at(cordsToIndex(endX, endY)).style.backgroundColor = "black";
      snakeCords.shift();
      snakeCords.push([x - 1, y]);
      break;

    case "d":
      cells.at(cordsToIndex(x + 1, y)).style.backgroundColor = "yellow";
      cells.at(cordsToIndex(endX, endY)).style.backgroundColor = "black";
      snakeCords.shift();
      snakeCords.push([x + 1, y]);
      break;
  }

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "d":
        if(lastDir == "l") return;
        dir = "r";
        break;
      case "a":
        if(lastDir == "r") return;
        dir = "l";
        break;
      case "w":
        if(lastDir == "d") return;
        dir = "u";
        break;
      case "s":
        if(lastDir == "u") return;
        dir = "d";
        break;
    }
  });
}
