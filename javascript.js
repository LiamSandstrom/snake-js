const container = document.querySelector("#container");

fillCells();

function fillCells(){
    for(let x = 0; x < 16; x++){
        for(let y = 0; y < 16; y++){
            const cell = document.createElement("div");
            cell.classList = "cell";
            container.appendChild(cell);
        }
    }
}