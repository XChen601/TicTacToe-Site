const GameBoard = (() => {
    const board = [];
    const boardSize = 3;

    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i].push(' ');
        }
    }

    const getBoard = () => board;

    const setCell = (row, col, value) => {
        board[row][col] = value;
    };

    const getCell = (row, col) => board[row][col];

    const clearBoard = () => {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                board[i][j] = ' ';
            }
        }
    }

    return {getBoard, getCell, setCell, clearBoard};
})();


const GameController = (() => {
    const board = GameBoard;

    const getBoard = () => GameBoard.getBoard();
    const resetBoard = () => {
        board.clearBoard();
        currentPlayer = playerOne;
        
    }

    const Player = (name, symbol) => {
        return {name, symbol};
    };
    const playerOne = Player('Player 1', 'X');
    const playerTwo = Player('Player 2', 'O');
    let currentPlayer = playerOne;

    const checkWinner = () => {
        const board = GameBoard.getBoard();
        // for each row, check if all cells are the same
        for (let i = 0; i < board.length; i++) {
            const row = board[i];
            // check if row is equal
            const cellText = row[0];
            for (let j = 1; j < row.length; j++) {
                if (row[j] !== cellText || row[j] == ' ') break;
                if (j === row.length - 1) return cellText;
            }
        }

        // check columns
        for (let i = 0; i < board.length; i++) {
            const cellText = board[0][i];
            for (let j = 1; j < board.length; j++) {
                if (board[j][i] !== cellText || board[j][i] == ' ') break;
                if (j === board.length - 1) return cellText;
            }
        }

        // check diagonals
        const cellText = board[0][0];
        for (let i = 1; i < board.length; i++) {
            if (board[i][i] !== cellText || board[i][i] == ' ') break;
            if (i === board.length - 1) return cellText;
        }

        // check tie, if all cells are not empty
        let tie = true;
        for (let i = 0; i < board.length; i++) {
            const row = board[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j] === ' ') tie = false;
            }
        }
        if (tie) return 'tie';


        return false;
    }

    const playRound = (row, col) => {
        console.log(row,col)
        // check if cell is available, if not empty then return
        if (board.getCell(row, col) !== ' ') return;
        board.setCell(row, col, currentPlayer.symbol);


        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;

    }

    const getCurrentPlayer = () => currentPlayer;
    
    return {playRound, getCurrentPlayer, getBoard, checkWinner, resetBoard};
})();

const ScreenController = (() => {
    const game = GameController;
    const boardContainer = document.querySelector('.board-container');
    const turnDiv = document.querySelector('.turn');
    const winnerDiv = document.querySelector('.winner');
    const resetBoardBtn = document.querySelector('.reset-board');

    const updateWinner = (winner) => {
        if (winner){
            if (winner === 'tie') {
                winnerDiv.textContent = 'Tie!';
            }
            else{
                winnerDiv.textContent = `${winner} wins!`;
            }
            boardContainer.removeEventListener('click', clickHandlerBoard);
        }
        else {
            winnerDiv.textContent = '';
        }
    }

    const updateDisplay = () => {

        // update turn
        turnDiv.textContent = `${game.getCurrentPlayer().name}'s turn: ${game.getCurrentPlayer().symbol}`;

        // clear board
        boardContainer.innerHTML = '';

        // get board
        board = game.getBoard();
        const boardSize = board.length;
        for (let i = 0; i < boardSize; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement('button');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.textContent = board[i][j];
                if (cell.textContent == 'X') cell.classList.add('x');
                else if (cell.textContent == 'O') cell.classList.add('o');
                row.appendChild(cell);
            }
            boardContainer.appendChild(row);
        }
    }

    function clickHandlerBoard(e) {
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        game.playRound(row, col);
        updateDisplay();
        const winner = game.checkWinner();
        if (winner) {
            updateWinner(winner);
        }
    }

    function resetHandler(e) {
        game.resetBoard();
        updateDisplay();
        boardContainer.addEventListener('click', clickHandlerBoard);
        updateWinner(false);
    }

    boardContainer.addEventListener('click', clickHandlerBoard);
    resetBoardBtn.addEventListener('click', resetHandler);
    updateDisplay();

})();


ScreenController;
