const playerFactory = (name, ai) => {
    return {name, ai};
};

const board = (function () {

    const boardHTML = [];
    const playerMarkers = ['X', 'O'];
    let currentPlayer = 0;
    
    for (let i = 0; i < 9; i++){
        let boardSquare = document.getElementById('s' + i);
        boardSquare.addEventListener('click', addMark);
        boardHTML.push(boardSquare);
    }

    let clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', clearBoard);

    function addMark() {
        if (this.innerHTML === ''){
            this.innerHTML = playerMarkers[currentPlayer];
            currentPlayer = 1 - currentPlayer;
        }
    }
    
    function getPlayer(){
        return playerMarkers[currentPlayer];
    }

    function clearBoard(){
        for (let i = 0; i < 9; i++){
            boardHTML[i].innerHTML = '';
        }
    }
    /*Return true when one player wins*/
    function checkWin(){

        return false;
    }

    return {clearBoard, getPlayer, checkWin};
})();

async function playRound(player1, player2) {
    board.clearBoard();
    let roundCounter = 0;
    let playerTurn = 1;
    while(!board.checkWin() && roundCounter < 9){
        let player;
        playerTurn === 1 ? player = player1 : player = player2;

        if (player.ai){

        } else {
            
        }

        playerTurn === 1 ? playerTurn = 2 : playerTurn = 1;
        roundCounter++;
    }
    
}