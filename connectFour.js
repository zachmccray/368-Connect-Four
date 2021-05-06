let canvas;
let context;
let t = 0;
let i = 0;
let j = 0;
let winner = 0;
let model = {
    //board: "......./......./......./......./......./.......",
    // board[row][col]:
    // 0: Empty
    // 1: Red
    // 2: Blue
    board: [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        ],
    next: 1,
}

function tick()
{
    window.requestAnimationFrame(splat);
}

function splat()
{
    // let d = n - t;
    // t = n;
    context.clearRect(0, 0, canvas.width, canvas.height);

for(i = 0; i < 5; i++)
{
    context.beginPath();
    context.moveTo(0, 100 + i * 100);
    context.lineTo(700, 100 + i * 100);
    context.strokeStyle = "#0051ba";
    context.lineWidth = 3;
    context.stroke();
}

for(i = 0; i < 6; i++)
{
    context.beginPath();
    context.moveTo(100 + i * 100, 0);
    context.lineTo(100 + i * 100, 600);
    context.strokeStyle = "#e8000d";
    context.lineWidth = 3;
    context.stroke();
}

for(let i = 0; i < 6; i++){
    for(let j = 0; j < 7; j++){
        //let tempString = model.board.charAt(i + j * 8);
        // if(tempString != '.'){
        //     context.fillText(tempString, 25 + i * 100, 25 + j * 100);
        // }
        if(model.board[i][j] != 0){
            context.beginPath();
            context.arc(50 + j * 100, 50 + i * 100, 25, 0, 2*Math.PI);
            context.fillStyle = model.board[i][j] == 1 ? "#e8000d" : "#0051ba";
            context.fill();
        }
    }
}

//context.fillText(JSON.stringify(model), 30, 30);
//context.font = "28pt Calibri";
//context.fillStyle = "blue";

tick();
}

document.addEventListener("DOMContentLoaded", () => {
canvas = document.querySelector("#gameCanvas");
context = canvas.getContext("2d");
console.log(context);
splat();
})

function checkWin(x, y) {

    let rows = 6;
    let cols = 7;
    let check;

    //Check Horizontal
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++)
        {
            if(model.board[i][j] != 0){
                check = model.board[i][j];
            }
            else{ continue; }
            
            if(check == model.board[i][j-1] && check == model.board[i][j-2] && check == model.board[i][j-3]){
                console.log(`Horizontal Winner! Player: ${check == 1 ? 'Red' : 'Blue'} winning position row:${i} col:${j}`);
                return(check);
            }
        }
    }
    //Check Vertical
    for(let i = 0; i < rows - 3; i++){
        for(let j = 0; j < cols; j++){
            if(model.board[i][j] != 0)
            {
                check = model.board[i][j];
            }
            else{ continue; }
            
            if(check == model.board[i+1][j] && check == model.board[i+2][j] && check == model.board[i+3][j]){
                console.log(`Vertical Winner! Player: ${check == 1 ? 'Red' : 'Blue'} winning position row:${i} col:${j}`);
                return(check);
            }
        }
    }
    //Check Diagonal: bottom left to top right
    for(let i = 3; i < rows; i++){
        for(let j = 0; j < cols - 3; j++){
            if(model.board[i][j] != 0){
                check = model.board[i][j];
            }
            else{ continue; }
        
            if(check == model.board[i-1][j+1] && check == model.board[i-2][j+2] && check == model.board[i-3][j+3]){
                console.log(`Diagonal Winner! Player: ${check == 1 ? 'Red' : 'Blue'} winning position row:${i} col:${j}`);
                return(check);
            }
        }
    }
    //Check Diagonals: bottom right to top left
    for(let i = 3; i < rows; i++){
       for(let j = 3; j < cols; j++){
           if(model.board[i][j] != 0){
               check = model.board[i][j];
           }
           else{ continue; }
           
           if(check == model.board[i-1][j-1] && check == model.board[i-2][j-2] && check == model.board[i-3][j-3]){
                console.log(`Diagonal Winner! Player: ${check == 1 ? 'Red' : 'Blue'} winning position row:${i} col:${j}`);
                return(check);
            }
        }
    }
    return(0);
}
function resetBoard(){
    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 7; j++){
            model.board[i][j] = 0;
        }
    }
    winner = 0;
    let winnerText = document.getElementById("winner") 
    winnerText.innerHTML = "Winner:";
    winnerText.style.color = "black";
    splat();
}

function nextPlayer(){
    if (model.next == 1) {
        model.next = 2
    } else if (model.next == 2) {
        model.next = 1
    }
}

function roundMe(x){ return Math.ceil((x-20)/100)-1 }
//access with board[y][x]
 document.addEventListener("click", e => {
    const [i,j] = [e.x,e.y].map(roundMe);
    console.log(`click at x:${i+1} y:${j+1}`);
    if (i < 0 || i >= 7) return;
    if (j < 0 || j >= 6) return;

    if(winner != 0){
        return;
    }
    
    if(model.board[j][i] != 0){ return; }
    else if(model.board[5][i] == 0){
        model.board[5][i] = model.next;
        nextPlayer();
    } else{
        for(let k = 1; k < 6; k++){
            if(model.board[k][i] != 0){
                model.board[k-1][i] = model.next;
                nextPlayer();
                break;
            }
        }
    }
    
    splat();
    console.log(model.board);

    winner = checkWin();
    if (winner != 0){
        let winnerText = document.getElementById("winner") 
        winnerText.innerHTML = `Winner: ${winner == 1 ? 'Red' : 'Blue'}`;
        winnerText.style.color = `${winner == 1 ? "#e8000d" : "#0051ba"}`;
    }   
})
