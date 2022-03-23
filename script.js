const playerFactory = (name, ai) => {
    return {name, ai};
};

const board = (function () {
    const boardArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    function addMark(position, mark){
        boardArray[position] = mark;
    }

    return {boardArray, addMark};
})();