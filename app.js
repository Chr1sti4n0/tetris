// const lTetromino = 'firstShape'
// const zTetromino = 'firstShape'
// const oTetromino = 'firstShape'
// const iTetromino = 'firstShape'
// const tTetromino = 'firstShape'


//document.addEventListener('DOMContentLoaded', () => {
const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
const ScoreDisplay = document.querySelector('#score');
const StartBtn = document.querySelector('#start-button');
const width = 10;
let nextRandom =0;
let timerId;
let score = 0;
const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
]

// Tetrominos: 10 x 20 grid
const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width*2+1, width*2],
    [width,width*2, width*2+1,width*2+2]
]

const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]


//})    

const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

let currentPosition = 4;
let currentRotation = 0;

// randomly selct a tetromino
let random = Math.floor(Math.random()*theTetrominos.length)

// [0][0] is getting the lTetromino and the first rotation
let current = theTetrominos[random][currentRotation]

// draw the frist rotation
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}


// Undraw the randomly chose tetromino
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = '';
    })
}

// make tetromino move down every second
//timerId = setInterval(moveDown, 1000)

//  event listener
function control(e) {
    if(e.keyCode === 37) {
        moveLeft();
    } else if (e.keyCode === 38) {
        rotate()
    } else if (e.keyCode === 39) {
        moveRight()
    } else if (e.keyCode === 40) {
        moveDown()
    }
}

document.addEventListener('keyup', control)

// move down function
function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

function freeze() {
    // if the next space down contians a square, that contains taken, 
    // we turn each tetromino into a class of taken
    if(current.some(index=> squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition+ index].classList.add('taken'))
    // start new tetromino
    random = nextRandom;
    nextRandom = Math.floor(Math.random()*theTetrominos.length);
    current = theTetrominos[random][currentRotation];
    currentPosition = 4;
    draw()
    displaySHape();
    addScore();
    gameOver();
    }
}

// Move tetromino left
function moveLeft() {
    undraw();
    // If a tetromino is in a square where when divided by 10, there is a remainder of 0 it is at the left edge
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    // Can move left -1 
    if(!isAtLeftEdge) currentPosition -= 1;

    // Not allow for tetromino to go into a taken space
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1;
    }
    draw();
}

// Move tetromino right
function moveRight() {
    undraw();
    // If a tetromino is in a square where when divided by 10, there is a remainder of 0 it is at the left edge
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

    // Can move right +1 
    if(!isAtRightEdge) currentPosition += 1;

    // Not allow for tetromino to go into a taken space
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1;
    }
    draw();
}

// rotating the tetromino
function rotate() {
    undraw();
    currentRotation ++;
    if(currentRotation === current.length) {
        currentRotation =0;
    }
    current = theTetrominos[random][currentRotation]
    draw();
}

// display next tetromino
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4;
const displayIndex = 0;

// tetrominos without rotations
const upNextTetrominos = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //l tetro
    [0, displayWidth, displayWidth+1, displayWidth*2+1],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [0,1, displayWidth, displayWidth+1],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],    
]

// Display the shape in the mini-grid
function displaySHape() {
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
    })
    upNextTetrominos[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

//add functionality to start button
StartBtn.addEventListener('click', () => {
    
    if(timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        draw();
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetrominos.length)
        displaySHape();
    }
})

//add score
function addScore() {
    for(let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            ScoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = '';
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

// Game over
function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        ScoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
    }
}