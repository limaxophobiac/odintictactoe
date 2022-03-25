const gameBoard = document.getElementById('tictacBoard');
const playerSubmit = document.getElementById('playerSubmit');
const restartButton = document.getElementById('clearButton');

let players = [];

const playerFactory = (playername, ai) => {
    return {playername, ai};
};

const inputController = (() => {

    const nameDisplay = document.getElementById('nameDisplay');
    const changePlayers = document.getElementById('changePlayers');
    const winDraw = document.getElementById('winDraw');
    const winDrawText = document.querySelector('#winDraw p');
    const winDrawButton = document.querySelector('#winDraw button');
 
    winDrawButton.addEventListener('click', hideWinDraw);

    changePlayers.addEventListener('click', () => {
        showPlayerInput();
    });

    function showPlayerInput(){
        gameBoard.style.display = 'none';
        restartButton.style.display = 'none';
        nameDisplay.style.display = 'none';
        changePlayers.style.display = 'none';
        document.getElementById('playerNameInput').style.display = 'grid';
    }

    function hidePlayerInput(){
        document.getElementById('playerNameInput').style.display = 'none';
        gameBoard.style.display = 'grid';
        restartButton.style.display = 'grid';
        nameDisplay.style.display = 'grid';
        changePlayers.style.display = 'grid';
    }

    function showWinDraw(draw, winnerName = ''){
        gameBoard.style.display = 'none';
        restartButton.style.display = 'none';
        nameDisplay.style.display = 'none';
        changePlayers.style.display = 'none';
        winDraw.style.display = 'grid';
        if (!draw) {
            winDrawText.innerHTML = winnerName + ' wins!';
        } else {
            winDrawText.innerHTML = "Draw, you're both losers!"
        }
    }

    function hideWinDraw(){
        gameBoard.style.display = 'grid';
        restartButton.style.display = 'grid';
        nameDisplay.style.display = 'grid';
        changePlayers.style.display = 'grid';
        winDraw.style.display = 'none';
    }

    return {showPlayerInput, hidePlayerInput, showWinDraw};
})();

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
            afterMove();
        }
    }

    function aiMove(){
        active = false;
        let move = aiController.getMove(getBoardMap(), playerMarkers[currentPlayer]);
        active = true;
        boardHTML[move].innerHTML = playerMarkers[currentPlayer];
        afterMove();
    }
    
    function afterMove(){
        if (checkWin()){
            inputController.showWinDraw(false, players[currentPlayer].playername);
            active = false;
        } else if (checkDraw()){
            inputController.showWinDraw(true);
            active = false;
        } else {
            currentPlayer = 1 - currentPlayer;
            showActivePlayer();
            if (players[currentPlayer].ai){
                aiMove();
            }
        }
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

    function getBoardMap(){
        let boardMap = boardHTML.map(elem => elem.innerHTML);
        return boardMap;
    }

    function startGame(){
        clearBoard();
        currentPlayer = Math.round(Math.random());
        active = true;
        showActivePlayer();
        if (players[currentPlayer].ai){
            aiMove();
        }
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

const aiController = (function(){

    let difficulty = 1;

    /*sets difficulty, 0 for easy, 1 for average, 3 for impossible*/
    function setDifficulty(number){
        difficulty = number;
    }
    /*Takes an Array of the board + the symbol for the AI player, f.ex. (['','','O','O','X','','X','',''], 'X')*/
    function getMove(boardMap, aiSymbol){
        if (difficulty === 0) return stupidMove(boardMap);
        if (difficulty === 2) return goodMove(boardMap, aiSymbol);
        return averageMove(boardMap, aiSymbol);
    }

    function stupidMove(boardMap){
        let boardPosition;
        do {
            boardPosition = Math.floor(Math.random()*9);
        } while (boardMap[boardPosition] != '');

        return boardPosition;
    }

    function averageMove(boardMap, aiSymbol){
        if (Math.random() < 0.25) return stupidMove(boardMap);
        return goodMove(boardMap, aiSymbol);
    }

    function goodMove(boardMap, aiSymbol){
 
        let boardNumMap = boardMap.map(elem => {
            if (elem == aiSymbol) return 1;
            if (elem == '') return 0;
            return 2;
        });
        let possibleMoves = getMoves(boardNumMap, 1);
        let bestMove = [];
        let bestScore = -1000;
        for (let elem of possibleMoves){
            let score = minimax(elem, false);
            if (score > bestScore){
                bestScore = score;
                bestMove = elem;
            } 
        }

        let moveSquare;

        for (let i = 0; i < 9; i++){
            if(bestMove[i] != boardNumMap[i]){
                moveSquare = i;
            }
        }

        return moveSquare;
    }

    function getMoves(boardNumMap, playerNumber){
        let moveArray = [];
        for (let i = 0; i < 9; i++){
            let boardClone = [...boardNumMap]
            if (boardClone[i] == 0) {
                boardClone[i] = playerNumber;
                moveArray.push(boardClone);
            }
        }
        return moveArray;
    }

    function minimax(boardNumMap, maximizingPlayer){

        let whoWon = evaluateBoard(boardNumMap, 1);
        let isDraw = boardNumMap.every(elem => elem != 0);
        if (whoWon != 0 || isDraw){
            return whoWon;
        }
        if (maximizingPlayer) {
            let value = -1000;
            let possibleMoves = getMoves(boardNumMap, 1);
            for (let elem of possibleMoves){
                value = Math.max(value, minimax(elem, false));
            }
            return value;
        }
        let value = 1000;
        let possibleMoves = getMoves(boardNumMap, 2);
        for (let elem of possibleMoves){
            value = Math.min(value, minimax(elem, true));
        }
        return value;

        
    }

    function evaluateBoard(boardMap, aiSymbol){
        /*Winning board good*/
        if (boardMap[0] == boardMap[1] && boardMap[0] == boardMap[2] && boardMap[0] == aiSymbol) return 1;
        if (boardMap[3] == boardMap[4] && boardMap[3] == boardMap[5] && boardMap[3] == aiSymbol) return 1;
        if (boardMap[6] == boardMap[7] && boardMap[6] == boardMap[8] && boardMap[6] == aiSymbol) return 1;
        if (boardMap[0] == boardMap[3] && boardMap[0] == boardMap[6] && boardMap[0] == aiSymbol) return 1;
        if (boardMap[1] == boardMap[4] && boardMap[1] == boardMap[7] && boardMap[1] == aiSymbol) return 1;
        if (boardMap[2] == boardMap[5] && boardMap[2] == boardMap[8] && boardMap[2] == aiSymbol) return 1;
        if (boardMap[0] == boardMap[4] && boardMap[0] == boardMap[8] && boardMap[0] == aiSymbol) return 1;
        if (boardMap[2] == boardMap[4] && boardMap[2] == boardMap[6] && boardMap[2] == aiSymbol) return 1;
        /*Losing board bad*/
        if (boardMap[0] == boardMap[1] && boardMap[0] == boardMap[2] && boardMap[0] != aiSymbol && boardMap[0] != 0) return -1;
        if (boardMap[3] == boardMap[4] && boardMap[3] == boardMap[5] && boardMap[3] != aiSymbol && boardMap[3] != 0) return -1;
        if (boardMap[6] == boardMap[7] && boardMap[6] == boardMap[8] && boardMap[6] != aiSymbol && boardMap[6] != 0) return -1;
        if (boardMap[0] == boardMap[3] && boardMap[0] == boardMap[6] && boardMap[0] != aiSymbol && boardMap[0] != 0) return -1;
        if (boardMap[1] == boardMap[4] && boardMap[1] == boardMap[7] && boardMap[1] != aiSymbol && boardMap[1] != 0) return -1;
        if (boardMap[2] == boardMap[5] && boardMap[2] == boardMap[8] && boardMap[2] != aiSymbol && boardMap[2] != 0) return -1;
        if (boardMap[0] == boardMap[4] && boardMap[0] == boardMap[8] && boardMap[0] != aiSymbol && boardMap[0] != 0) return -1;
        if (boardMap[2] == boardMap[4] && boardMap[2] == boardMap[6] && boardMap[2] != aiSymbol && boardMap[2] != 0) return -1;
        /*Draw is neutral*/
        return 0;
        
    }

    return {getMove, setDifficulty};
})();

playerSubmit.addEventListener('click', () => {
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const player1IsAi = document.getElementById('player1Ai').checked;
    const player2IsAi = document.getElementById('player2Ai').checked;
    players[0] = playerFactory(player1Input.value, player1IsAi);
    players[1] = playerFactory(player2Input.value, player2IsAi);
    document.getElementById('player1Display').innerHTML = player1Input.value + ' X';
    document.getElementById('player2Display').innerHTML = player2Input.value + ' O';
    inputController.hidePlayerInput();
    board.startGame();
});


inputController.showPlayerInput();

restartButton.addEventListener('click', board.startGame);