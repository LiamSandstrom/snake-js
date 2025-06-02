const container = document.querySelector("#container");

const cells = []; 

//----- Start -----//
beginPlay();
function beginPlay(){



    fillCells();
    console.log(cells)

    cells.at(cordsToIndex(2,15)).style.backgroundColor = "yellow"
}

//----- Tick -----//
function tick(){

}

function fillCells(){
    for(let x = 0; x < 16; x++){
        for(let y = 0; y < 16; y++){
            const cell = document.createElement("div");
            cell.classList = `cell`;
            cells.push(cell);
            container.appendChild(cell);
        }
    }
}

function createSnake(){
}

function indexToCords(value){
    const rowCalc = value % 16 + "";
    const x = parseFloat(rowCalc.at(0)) - 1;
    const y = value - x * 16;

    return [x,y];
}

function cordsToIndex(x, y){
    return x * 16 + y;
}
