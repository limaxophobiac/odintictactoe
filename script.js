const docMain = document.getElementById('topContainer')
const gameBoard = document.getElementById('tictacBoard');
const playerSubmit = document.getElementById('playerSubmit');
const restartButton = document.getElementById('clearButton');
const nameDisplay = document.getElementById('nameDisplay');
const changePlayers = document.getElementById('changePlayers');

let players = [];

const playerFactory = (playername, ai) => {
    return {playername, ai};
};

const board = (function () {

    const boardHTML = [];
    const playerMarkers = ['X', 'O'];
    let currentPlayer = 0;
    let active = false;

    for (let i = 0; i < 9; i++){
        let boardSquare = document.getElementById('s' + i);
        boardSquare.addEventListener('click', addMark);
        boardHTML.push(boardSquare);
    }

    function addMark() {
        if (this.innerHTML === '' && active){
            this.innerHTML = playerMarkers[currentPlayer];
            if (checkWin()){
                console.log('Player: ' + players[currentPlayer].playername + ' wins');
                active = false;
            } else if (checkDraw()){
                console.log("Draw, you're both losers.");
                active = false;
            } else {
            currentPlayer = 1 - currentPlayer;
            showActivePlayer();
            }
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
        let boardMap = boardHTML.map(elem => elem.innerHTML);

        if (boardMap[0] == boardMap[1] && boardMap[0] == boardMap[2] && boardMap[0] != '') return true;
        if (boardMap[3] == boardMap[4] && boardMap[3] == boardMap[5] && boardMap[3] != '') return true;
        if (boardMap[6] == boardMap[7] && boardMap[6] == boardMap[8] && boardMap[6] != '') return true;
        if (boardMap[0] == boardMap[3] && boardMap[0] == boardMap[6] && boardMap[0] != '') return true;
        if (boardMap[1] == boardMap[4] && boardMap[1] == boardMap[7] && boardMap[1] != '') return true;
        if (boardMap[2] == boardMap[5] && boardMap[2] == boardMap[8] && boardMap[2] != '') return true;
        if (boardMap[0] == boardMap[4] && boardMap[0] == boardMap[8] && boardMap[0] != '') return true;
        if (boardMap[2] == boardMap[4] && boardMap[2] == boardMap[6] && boardMap[2] != '') return true;
        return false;
    }

    function checkDraw(){
        let boardMap = boardHTML.map(elem => elem.innerHTML);
        if (boardMap.every(elem => elem != '')) return true;
        return false;
    }

    function startGame(){
        clearBoard();
        currentPlayer = Math.round(Math.random());
        active = true;
        showActivePlayer();
    }

    function showActivePlayer(){
        if (currentPlayer === 0){
            document.getElementById('player1Display').style.fontSize = '2rem';
            document.getElementById('player2Display').style.fontSize = '1rem';
        } else {
            document.getElementById('player1Display').style.fontSize = '1rem';
            document.getElementById('player2Display').style.fontSize = '2rem';
        }
    }

    return {startGame};
})();

gameBoard.style.display = 'none';
restartButton.style.display = 'none';
nameDisplay.style.display = 'none';
changePlayers.style.display = 'none';

restartButton.addEventListener('click', board.startGame);

playerSubmit.addEventListener('click', () => {
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    players[0] = playerFactory(player1Input.value, false);
    players[1] = playerFactory(player2Input.value, false);
    document.getElementById('player1Display').innerHTML = player1Input.value + ' X';
    document.getElementById('player2Display').innerHTML = player2Input.value + ' O';
    document.getElementById('playerNameInput').style.display = 'none';
    gameBoard.style.display = 'grid';
    restartButton.style.display = 'grid';
    nameDisplay.style.display = 'grid';
    changePlayers.style.display = 'grid';
    board.startGame();
});

changePlayers.addEventListener('click', () => {
    gameBoard.style.display = 'none';
    restartButton.style.display = 'none';
    nameDisplay.style.display = 'none';
    changePlayers.style.display = 'none';
    document.getElementById('playerNameInput').style.display = 'grid';
});