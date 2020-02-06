const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasStyle = getComputedStyle(canvas);
const solveButtonFast = document.getElementById("solveButtonFast");
const solveButtonSlow = document.getElementById("solveButton");
const updateFrequencyIndicator = document.getElementById("updateFrequency");
const resetButton = document.getElementById("resetButton");
const clearFilledButton = document.getElementById("clearFilled");
const premadePuzzleButton = document.getElementById("premadePuzzle");

const width = canvas.width;
const height = canvas.height;
const styleWidth = parseInt(canvasStyle.width);
const styleHeight = parseInt(canvasStyle.height);
const squareWidth = width / 9;
const squareHeight = height / 9;
const defaultFont = "16px Arial";
const boldFont = "bold 16px Arial";
let updateFrequency = parseInt(updateFrequencyIndicator.nodeValue);

let mousePosObject = {
    x: -100,
    y: -100,
    onCanvas: false,
    gridX: function () {
        if (this.onCanvas) {
            return Math.floor(this.x / squareWidth);
        }
        return -1;
    },
    gridY: function () {
        if (this.onCanvas) {
            return Math.floor(this.y / squareHeight);
        }
        return -1;
    }
};

let selectedSquare = {
    row: -1,
    column: -1,
    reset: function () {
        this.row = -1;
        this.column = -1;
    },
    isActive: function () {
        return !(this.row === -1 && this.column === -1);
    }
};

ctx.font = defaultFont;

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

let blank = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
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
];

let mediumGrid = [
    [0, 0, 0, 0, 8, 0, 0, 0, 0],
    [0, 0, 3, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 0, 0, 5, 0, 4, 0],
    [0, 0, 8, 0, 0, 0, 2, 6, 0],
    [9, 0, 0, 3, 2, 0, 4, 5, 0],
    [0, 5, 0, 0, 0, 0, 0, 0, 9],
    [0, 0, 4, 6, 0, 1, 7, 0, 0],
    [0, 0, 0, 0, 0, 9, 0, 0, 0],
    [0, 3, 0, 7, 0, 0, 8, 0, 0]
];

let hardGrid = [
    [0, 5, 0, 0, 0, 0, 4, 0, 0],
    [1, 6, 0, 8, 0, 0, 7, 0, 5],
    [4, 0, 0, 0, 0, 0, 0, 2, 6],
    [0, 4, 9, 0, 0, 0, 0, 0, 0],
    [8, 0, 5, 6, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 8, 7, 0],
    [0, 0, 0, 3, 9, 0, 0, 6, 4],
    [0, 0, 0, 0, 0, 6, 0, 1, 0],
    [9, 0, 0, 0, 2, 0, 0, 0, 0]
];

let veryHardGrid = [
    [0, 5, 0, 0, 0, 0, 4, 0, 0],
    [1, 6, 0, 8, 0, 0, 7, 0, 5],
    [4, 0, 0, 0, 0, 0, 0, 2, 6],
    [0, 4, 9, 0, 0, 0, 0, 0, 0],
    [8, 0, 5, 6, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 8, 7, 0],
    [0, 0, 0, 3, 9, 0, 0, 6, 4],
    [0, 0, 0, 0, 0, 6, 0, 1, 0],
    [9, 0, 0, 0, 2, 0, 0, 0, 0]
];



function genState(grid) {
    return {
        grid: copyGrid(grid),
        squareOfInterest: firstEmptySquare(grid),
        previousMoves: [],
        makeChange: false,
        invalid: gridStatus(grid) === "invalid",
        done: gridStatus(grid) === "complete"
    };
}

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

function blankGrid() {
    return zeros(9, 9);
}

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

function addGrids(grid1, grid2) {
    let result = zeros(9, 9);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            result[i][j] = grid1[i][j] + grid2[i][j];
        }
    }
    return result;
}

function subtractGrids(grid1, grid2) {
    let result = zeros(9, 9);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            result[i][j] = grid1[i][j] - grid2[i][j];
        }
    }
    return result;
}

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

function drawGridNumbers(grid, bold = false) {
    if (bold) {
        ctx.fillStyle = "blue";
        ctx.font = boldFont;
    }
    const rowOffset = .6; // adjusts position of number so it is centered
    const colOffset = .45; // adjusts position of number so it is centered
    grid.forEach((row, rowNum) => {
        row.forEach((e, colNum) => {
            if (e !== 0) {
                ctx.fillText(e.toString(), (colNum + colOffset) * squareHeight, (rowNum + rowOffset) * squareWidth);
            }
        });
    });
    ctx.font = defaultFont;
    ctx.fillStyle = "black";
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

function solveStep(grid, squareOfInterest = firstEmptySquare(grid), previousMoves = [], makeChange = false) {
    // drawGridNumbers(grid);
    let newGrid = copyGrid(grid);
    let status = gridStatus(newGrid);
    // console.log(status);
    if (status === "complete") {
        // console.log(newGrid);
        return {
            grid: newGrid,
            squareOfInterest: null,
            previousMoves: null,
            makeChange: false,
            done: true
        };
    }
    else {
        let newPreviousMoves = copy2DArray(previousMoves);
        let currentRow = squareOfInterest[0];
        let currentCol = squareOfInterest[1];
        if (makeChange || status === "invalid") {
            if (newGrid[currentRow][currentCol] < 9) {
                newGrid[currentRow][currentCol]++;
                status = gridStatus(newGrid);
                return {
                    grid: newGrid,
                    squareOfInterest: [currentRow, currentCol],
                    previousMoves: newPreviousMoves,
                    makeChange: false,
                    invalid: false,
                    done: false
                };
            }
            else {
                newGrid[currentRow][currentCol] = 0;
                let lastMoveInList = newPreviousMoves.pop();
                if (lastMoveInList === undefined) {
                    // alert("This sudoku has no solution");
                    return {
                        grid: newGrid,
                        squareOfInterest: [currentRow, currentCol],
                        previousMoves: newPreviousMoves,
                        makeChange: false,
                        invalid: true,
                        done: false
                    };
                }
                let newSquareOfInterest = [lastMoveInList[0], lastMoveInList[1]];
                // return solveGrid(newGrid, newSquareOfInterest, newPreviousMoves, true);
                return {
                    grid: newGrid,
                    squareOfInterest: newSquareOfInterest,
                    previousMoves: newPreviousMoves,
                    makeChange: true,
                    invalid: false,
                    done: false
                };
            }
        }
        else if (status === "incomplete") {
            if (newGrid[currentRow][currentCol] === 0) {
                newGrid[currentRow][currentCol]++;
                // return solveGrid(newGrid, [currentRow, currentCol], newPreviousMoves);
                return {
                    grid: newGrid,
                    squareOfInterest: [currentRow, currentCol],
                    previousMoves: newPreviousMoves,
                    makeChange: false,
                    invalid: false,
                    done: false
                };
            }
            else {
                // console.log("moving on to new square");
                let newSquareOfInterest = firstEmptySquare(newGrid);
                newPreviousMoves.push([currentRow, currentCol]);
                // return solveGrid(newGrid, newSquareOfInterest, newPreviousMoves);
                return {
                    grid: newGrid,
                    squareOfInterest: newSquareOfInterest,
                    previousMoves: newPreviousMoves,
                    makeChange: false,
                    invalid: false,
                    done: false
                };
            }
        }
    }
}

function solveGridNoRecursion(grid) {
    let currentState = genState(grid);
    do {
        currentState = solveStep(currentState.grid, currentState.squareOfInterest, currentState.previousMoves, currentState.makeChange);
    } while (currentState.done === false && !currentState.invalid);
    // drawGridNumbers(currentState.grid);
    if (currentState.done){
        return currentState.grid;
    }
    else if (currentState.invalid){
        console.log("no solution")
        return null;
    }
}

/**
 * Changes a global variable called mousePosObject
 * @param {*} e 
 */
function mouseMoveHandler(e) {
    const canvasRect = canvas.getBoundingClientRect();
    mousePosObject.x = (e.clientX - canvasRect.left) * width / styleWidth;
    mousePosObject.y = (e.clientY - canvasRect.top) * height / styleHeight;
    mousePosObject.onCanvas = ((mousePosObject.x <= width) && (mousePosObject.x >= 0) && (mousePosObject.y <= height) && (mousePosObject.y >= 0));
}

function clickHandler() {
    if (mousePosObject.onCanvas) {
        if ((mousePosObject.gridY() === selectedSquare.row) && (mousePosObject.gridX() === selectedSquare.column)) {
            selectedSquare.reset();
        }
        else {
            selectedSquare.row = mousePosObject.gridY();
            selectedSquare.column = mousePosObject.gridX();
        }
    }
    else {
        selectedSquare.reset();
    }
}

function keyDownHandler(e) {
    const keyCode = e.keyCode;
    if (keyCode >= 48 && keyCode <= 57) { // Numbers 0-9
        const numberPressed = keyCode - 48;
        if (canEdit && selectedSquare.isActive()) {
            initialGrid[selectedSquare.row][selectedSquare.column] = numberPressed;
            currentState = genState(blankGrid());
            solveFast = false;
            solveSlow = false;
        }
    }
    else if (keyCode === 8) { // Backspace
        if (canEdit && selectedSquare.isActive()) {
            initialGrid[selectedSquare.row][selectedSquare.column] = 0;
            currentState = genState(blankGrid());
            solveFast = false;
            solveSlow = false;
        }
    }
    else if (keyCode === 37) { // left arrow
        if (selectedSquare.column > 0) {
            selectedSquare.column--;
        }
        else if (!selectedSquare.isActive()) {
            selectedSquare.row = 8;
            selectedSquare.column = 8;
        }
    }
    else if (keyCode === 38) { // up arrow
        if (selectedSquare.row > 0) {
            selectedSquare.row--;
        }
        else if (!selectedSquare.isActive()) {
            selectedSquare.row = 8;
            selectedSquare.column = 8;
        }
    }
    else if (keyCode === 39) { // right arrow
        if (selectedSquare.column < 8 && selectedSquare.column !== -1) {
            selectedSquare.column++;
        }
        else if (!selectedSquare.isActive()) {
            selectedSquare.row = 0;
            selectedSquare.column = 0;
        }
    }
    else if (keyCode === 40) { // down arrow
        if (selectedSquare.row < 8 && selectedSquare.column !== -1) {
            selectedSquare.row++;
        }
        else if (!selectedSquare.isActive()) {
            selectedSquare.row = 0;
            selectedSquare.column = 0;
        }
    }
}

function programLoop() {
    ctx.clearRect(0, 0, width, height);
    loopCount++;
    let framesPerUpdate = Math.floor(50 / parseInt(Math.min(updateFrequencyIndicator.value, 50)));
    drawGridLines();
    if (selectedSquare.isActive()) {
        ctx.fillStyle = "#d3d3d3";
        ctx.fillRect(selectedSquare.column * squareWidth, selectedSquare.row * squareHeight, squareWidth, squareHeight);
        ctx.fillStyle = "black";
    }
    drawGridNumbers(initialGrid, true);
    if (solveSlow) {
        drawGridNumbers(subtractGrids(currentState.grid, initialGrid));
        if (loopCount % framesPerUpdate === 0) {
            if (!currentState.done && !currentState.invalid) {
                currentState = solveStep(currentState.grid, currentState.squareOfInterest, currentState.previousMoves, currentState.makeChange);
            }
            else if (currentState.done) {
                canEdit = true;
            }
            else if (currentState.invalid){
                alert("This sudoku has no solution");
                solveFast = false;
                solveSlow = false;
                canEdit = true;
                currentState = genState(blankGrid());
            }
        }
    }
    if (solveFast) {
        drawGridNumbers(subtractGrids(currentState.grid, initialGrid));
    }
}

let initialGrid = zeros(9, 9);
let filledNumbers = zeros(9, 9);

let loopCount = 0;
let solveFast = false;
let solveSlow = false;
let canEdit = true;
let currentState = genState(blankGrid());
const preMadePuzzles = [easyGrid, mediumGrid, hardGrid];
let puzzleChoice = 0;

document.addEventListener("mousemove", mouseMoveHandler);
document.addEventListener("click", clickHandler)
document.addEventListener("keydown", keyDownHandler);
solveButtonSlow.addEventListener("click", () => {
    solveFast = false;
    solveSlow = true;
    canEdit = false;
    currentState = genState(initialGrid);
});
solveButtonFast.addEventListener("click", () => {
    solveSlow = false;
    solveFast = true;
    let fastSolution = solveGridNoRecursion(initialGrid);
    if (fastSolution !== null){
        currentState = genState(fastSolution);
    }
    else{
        alert("This sudoku has no solution");
        solveFast = false;
        currentState = genState(blankGrid());
    }
    canEdit = true;
});
resetButton.addEventListener("click", () => {
    solveFast = false;
    solveSlow = false;
    canEdit = true;
    initialGrid = blankGrid();
    currentState = genState(blankGrid());
});
clearFilledButton.addEventListener("click", () => {
    solveFast = false;
    solveSlow = false;
    canEdit = true;
    currentState = genState(blankGrid());
});
premadePuzzleButton.addEventListener("click", ()=>{
    canEdit = true;
    initialGrid = preMadePuzzles[puzzleChoice];
    currentState = genState(blankGrid());
    solveFast = false;
    solveSlow = false;
    puzzleChoice = (puzzleChoice + 1) % preMadePuzzles.length;
});

initialGrid = blankGrid();

setInterval(programLoop, 20);