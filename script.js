const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const squareWidth = width / 9;
const squareHeight = height / 9;

ctx.font = "16px Arial";

let testGrid = [
    [0, 0, 9, 0, 1, 5, 7, 0, 8],
    [0, 0, 0, 7, 0, 3, 2, 4, 0],
    [0, 0, 3, 0, 0, 0, 6, 0, 0],
    [0, 0, 0, 1, 5, 7, 3, 8, 0],
    [0, 0, 2, 0, 9, 6, 0, 0, 0],
    [0, 0, 0, 2, 8, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 4],
    [0, 0, 0, 0, 0, 1, 5, 2, 7],
    [0, 0, 8, 0, 0, 0, 0, 6, 0]
];

let easyGrid = [
    [0, 2, 0, 3, 0, 0, 5, 8, 0],
    [0, 0, 4, 5, 0, 7, 0, 1, 0],
    [5, 0, 6, 8, 0, 4, 0, 0, 0],
    [8, 5, 0, 0, 9, 0, 3, 0, 0],
    [0, 1, 3, 0, 4, 0, 0, 0, 8],
    [6, 0, 0, 0, 8, 3, 9, 0, 7],
    [1, 6, 0, 0, 0, 8, 0, 2, 3],
    [0, 7, 0, 2, 0, 6, 0, 0, 0],
    [2, 3, 0, 0, 0, 0, 8, 7, 6]
]

// TODO: use ESLint to check for missing semicolons
// TODO: make sure functions using firstEmptySquare will still work if firstEmptySquare returns false
// TODO: make sure everything still works if the initial state is already solved
// TODO: implement formal unit testing
// TODO: program exceeds maximum call stack size for hard puzzles

function zeros(rows, columns) {
    let zeroGrid = [];
    for (let i = 0; i < rows; i++) {
        zeroGrid.push([]);
        for (let j = 0; j < columns; j++) {
            zeroGrid[i].push(0);
        }
    }
    return zeroGrid;
}
// console.log(zeros(2, 3));

function copyGrid(grid) {
    let copy = zeros(9, 9);
    grid.forEach((row, rowNum) => {
        row.forEach((e, colNum) => {
            copy[rowNum][colNum] = e;
        });
    });
    return copy;
}
// console.log(copyGrid(testGrid));

function copyArray(arr) {
    let copy = [];
    for (let i = 0; i < arr.length; i++) {
        copy.push(arr[i]);
    }
    return copy;
}

function copy2DArray(arr) {
    let copy = [];
    for (let i = 0; i < arr.length; i++) {
        copy.push([]);
        for (const item of arr[i]) {
            copy[i].push(item);
        }
    }
    return copy;
}
// console.log(copy2DArray(testGrid));

function transpose(grid) {
    let transposedGrid = zeros(9, 9);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            transposedGrid[j][i] = grid[i][j];
        }
    }
    return transposedGrid;
}
// console.log(transpose(testGrid));

/**
 * @param row represents the row of the 3x3 box, from 0 to 2
 * @param column represents the column of the 3x3 box, from 0 to 2
 */
function boxAsArray(grid, row, column) {
    let result = [];
    for (let i = 3 * row; i < 3 * row + 3; i++) {
        for (let j = 3 * column; j < 3 * column + 3; j++) {
            result.push(grid[i][j]);
        }
    }
    return result;
}
// console.log(boxAsArray(testGrid, 1, 2));

function checkArrayValidity(arr) {
    let numOccurences = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    arr.forEach((e) => numOccurences[e]++);
    numOccurences.shift();
    return numOccurences.every((v) => v <= 1);
}
// const testArray1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// const testArray2 = [1, 2, 0, 2, 5, 6, 7, 8, 9];
// console.log(checkValidity(testArray1));
// console.log(checkValidity(testArray2));

function checkRows(grid) {
    for (const row of grid) {
        if (!checkArrayValidity(row)) {
            return false;
        }
    }
    return true;
}
// console.log(checkRows(testGrid));

function checkColumns(grid) {
    return checkRows(transpose(grid));
}
// console.log(checkColumns(testGrid));

function checkBoxes(grid) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const boxArray = boxAsArray(grid, i, j);
            if (!checkArrayValidity(boxArray)) {
                return false;
            }
        }
    }
    return true;
}

function checkGrid(grid) {
    if (!checkRows(grid)) {
        // console.log("row problem");
        return false;
    }
    if (!checkColumns(grid)) {
        // console.log("column problem");
        return false;
    }
    if (!checkBoxes(grid)) {
        // console.log("box problem");
        return false;
    }
    return true;
}
// console.log(checkGrid(testGrid));

function isFull(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}

function gridStatus(grid) {
    if (!checkGrid(grid)) {
        return "invalid";
    }
    if (!isFull(grid)) {
        return "incomplete";
    }
    return "complete";
}

function drawLine(x1, y1, x2, y2, width = 1) {
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.lineWidth = 1;
}

function drawGridLines() {
    for (let i = 0; i <= 9; i++) {
        const bold = 2 * ((i % 3) === 0);
        drawLine(0, squareHeight * i, width, squareHeight * i, 1 + bold);
        drawLine(squareWidth * i, 0, squareWidth * i, height, 1 + bold);
    }
}

function drawSudokuGrid(grid) {
    ctx.clearRect(0, 0, width, height);
    drawGridLines();
    const rowOffset = .6; // adjusts position of number so it is centered
    const colOffset = .45; // adjusts position of number so it is centered
    grid.forEach((row, rowNum) => {
        row.forEach((e, colNum) => {
            if (e !== 0) {
                ctx.fillText(e.toString(), (colNum + colOffset) * squareHeight, (rowNum + rowOffset) * squareWidth);
            }
        });
    });
}

/**
 * returns false if there are no empty squares
 * @param {*} grid 
 */
function firstEmptySquare(grid) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (grid[r][c] === 0) {
                return [r, c];
            }
        }
    }
    return false;
}
// console.table(firstEmptySquare(testGrid));

function makeGuess(grid, guess = 1) {
    let gridWithGuess = copyGrid(grid);
    let guessSquare = firstEmptySquare(grid);
    gridWithGuess[guessSquare[0]][guessSquare[1]] = guess;
    return {
        grid: gridWithGuess,
        row: guessSquare[0],
        column: guessSquare[1]
    };
}
// console.log(makeGuess(testGrid));

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function solveGrid(grid, squareOfInterest = firstEmptySquare(grid), previousMoves = [], makeChange = false) {
    // sleep(100).then(()=>{
    drawSudokuGrid(grid);
    let newGrid = copyGrid(grid);
    let newPreviousMoves = copy2DArray(previousMoves);
    let currentRow = squareOfInterest[0];
    let currentCol = squareOfInterest[1];
    const status = gridStatus(newGrid);
    // console.log(status);
    if (status === "complete") {
        // console.log(newGrid);
        return newGrid;
    }
    else if (makeChange) {
        if (newGrid[currentRow][currentCol] < 9) {
            newGrid[currentRow][currentCol]++;
            return solveGrid(newGrid, [currentRow, currentCol], newPreviousMoves);
        }
        else {
            newGrid[currentRow][currentCol] = 0;
            let temp = newPreviousMoves.pop(); // TODO: change variable name
            if (temp === undefined) {
                return false;
            }
            let newSquareOfInterest = [temp[0], temp[1]];
            return solveGrid(newGrid, newSquareOfInterest, newPreviousMoves, true);
        }
    }
    else if (status === "invalid") {
        if (newGrid[currentRow][currentCol] < 9) {
            newGrid[currentRow][currentCol]++;
            return solveGrid(newGrid, [currentRow, currentCol], newPreviousMoves);
        }
        else {
            newGrid[currentRow][currentCol] = 0;
            let temp = newPreviousMoves.pop();
            if (temp === undefined) {
                console.log("this sudoku is impossible");
                return false;
            }
            let newSquareOfInterest = [temp[0], temp[1]];
            return solveGrid(newGrid, newSquareOfInterest, newPreviousMoves, true);
        }
    }
    else if (status === "incomplete") {
        if (newGrid[currentRow][currentCol] === 0) {
            newGrid[currentRow][currentCol]++;
            return solveGrid(newGrid, [currentRow, currentCol], newPreviousMoves);
        }
        else {
            // console.log("moving on to new square");
            let newSquareOfInterest = firstEmptySquare(newGrid);
            newPreviousMoves.push([currentRow, currentCol]);
            return solveGrid(newGrid, newSquareOfInterest, newPreviousMoves);
        }
    }
    // });
}

let currentGrid = testGrid;
drawSudokuGrid(currentGrid);
solveGrid(currentGrid);

// function programLoop() {
//     drawSudokuGrid(currentGrid);
// }

//console.log(solveGrid(currentGrid));

// setInterval(programLoop, 500);