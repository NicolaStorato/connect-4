// Initial references
const container = document.querySelector(".container");
const playerTurn = document.getElementById("playerTurn");
const startScreen = document.querySelector(".startScreen");
const startButton = document.getElementById("start");
const message = document.getElementById("message");
let initialMatrix = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];
let currentPlayer;
let player1, player2;

const updateLeaderboard = () => {
  try {
      let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {};

      const winner = currentPlayer == 1 ? player1 : player2;

      if (leaderboard[winner]) {
          leaderboard[winner] += 1;
      } else {
          leaderboard[winner] = 1;
      }

      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  } catch (error) {
      console.error("Error updating leaderboard:", error);
  }
};

// Random Number Between Range
const generateRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

// Loop through array and check for same values
const verifyArray = (arrayElement) => {
  let bool = false;
  let elementCount = 0;
  arrayElement.forEach((element, index) => {
    if (element == currentPlayer) {
      elementCount += 1;
      if (elementCount == 4) {
        bool = true;
      }
    } else {
      elementCount = 0;
    }
  });
  return bool;
};

// Check for game over (Last step)
const gameOverCheck = () => {
  let truthCounnt = 0;
  for (let innerArray of initialMatrix) {
    if (innerArray.every((val) => val != 0)) {
      truthCounnt += 1;
    } else {
      return false;
    }
  }
  if (truthCounnt == 6) {
    message.innerText = "Game Over";
    startScreen.classList.remove("hide");
  }
};

// Check rows
const checkAdjacentRowValues = (row) => {
  return verifyArray(initialMatrix[row]);
};

// Check columns
const checkAdjacentColumnValues = (column) => {
  let colWinCount = 0,
    colWinBool = false;
  initialMatrix.forEach((element, index) => {
    if (element[column] == currentPlayer) {
      colWinCount += 1;
      if (colWinCount == 4) {
        colWinBool = true;
      }
    } else {
      colWinCount = 0;
    }
  });
  // no match
  return colWinBool;
};

// Get Right diagonal values
const getRightDiagonal = (row, column, rowLength, columnLength) => {
  let rowCount = row;
  let columnCount = column;
  let rightDiagonal = [];
  while (rowCount > 0) {
    if (columnCount >= columnLength - 1) {
      break;
    }
    rowCount -= 1;
    columnCount += 1;
    rightDiagonal.unshift(initialMatrix[rowCount][columnCount]);
  }
  rowCount = row;
  columnCount = column;
  while (rowCount < rowLength) {
    if (columnCount < 0) {
      break;
    }
    rightDiagonal.push(initialMatrix[rowCount][columnCount]);
    rowCount += 1;
    columnCount -= 1;
  }
  return rightDiagonal;
};

// Get Left diagonal values
const getLeftDiagonal = (row, column, rowLength, columnLength) => {
  let rowCount = row;
  let columnCount = column;
  let leftDiagonal = [];
  while (rowCount > 0) {
    if (columnCount <= 0) {
      break;
    }
    rowCount -= 1;
    columnCount -= 1;
    leftDiagonal.unshift(initialMatrix[rowCount][columnCount]);
  }
  rowCount = row;
  columnCount = column;
  while (rowCount < rowLength) {
    if (columnCount >= columnLength) {
      break;
    }
    leftDiagonal.push(initialMatrix[rowCount][columnCount]);
    rowCount += 1;
    columnCount += 1;
  }
  return leftDiagonal;
};

// Check diagonal
const checkAdjacentDiagonalValues = (row, column) => {
  let diagWinBool = false;
  let tempChecks = {
    leftTop: [],
    rightTop: [],
  };
  let columnLength = initialMatrix[row].length;
  let rowLength = initialMatrix.length;

  // Store left and right diagonal array
  tempChecks.leftTop = [
    ...getLeftDiagonal(row, column, rowLength, columnLength),
  ];

  tempChecks.rightTop = [
    ...getRightDiagonal(row, column, rowLength, columnLength),
  ];
  // check both arrays for similarities
  diagWinBool = verifyArray(tempChecks.rightTop);
  if (!diagWinBool) {
    diagWinBool = verifyArray(tempChecks.leftTop);
  }
  return diagWinBool;
};

// Win check logic
const winCheck = (row, column) => {
  // if any of the functions return true we return true
  return checkAdjacentRowValues(row)
    ? true
    : checkAdjacentColumnValues(column)
    ? true
    : checkAdjacentDiagonalValues(row, column)
    ? true
    : false;
};

// Sets the circle to exact points
const setPiece = (startCount, colValue) => {
  let rows = document.querySelectorAll(".grid-row");
  // Initially it will place the circles in the last row else if no place available we will decrement the count until we find empty slot
  if (initialMatrix[startCount][colValue] != 0) {
    startCount -= 1;
    setPiece(startCount, colValue);
  } else {
    // place circle
    let currentRow = rows[startCount].querySelectorAll(".grid-box");
    currentRow[colValue].classList.add("filled", `player${currentPlayer}`);
    // Update Matrix
    initialMatrix[startCount][colValue] = currentPlayer;
    // Check for wins
    if (winCheck(startCount, colValue)) {
      message.innerHTML = `<span>${
        currentPlayer == 1 ? player1 : player2
      }</span> wins`;
      updateLeaderboard();
      startScreen.classList.remove("hide");
      return false;
    }
  }
  // Check if all are full
  gameOverCheck();
};

// When user clicks on a box
const fillBox = (e) => {
  // get column value
  let colValue = parseInt(e.target.getAttribute("data-value"));
  // 5 because we have 6 rows (0-5)
  setPiece(5, colValue);
  currentPlayer = currentPlayer == 1 ? 2 : 1;

  playerTurn.innerHTML = `<span>${
    currentPlayer == 1 ? player1 : player2
  }</span>'s turn`;
};

// Create Matrix
const matrixCreator = () => {
  for (let innerArray in initialMatrix) {
    let outerDiv = document.createElement("div");
    outerDiv.classList.add("grid-row");
    outerDiv.setAttribute("data-value", innerArray);
    for (let j in initialMatrix[innerArray]) {
      // Set all matrix values to 0
      initialMatrix[innerArray][j] = [0];
      let innerDiv = document.createElement("div");
      innerDiv.classList.add("grid-box");
      innerDiv.setAttribute("data-value", j);
      innerDiv.addEventListener("click", (e) => {
        fillBox(e);
      });
      outerDiv.appendChild(innerDiv);
    }
    container.appendChild(outerDiv);
  }
};

// Initialise game
window.onload = startGame = async () => {
  // Retrieve player names from localStorage
  player1 = localStorage.getItem('player1');
  player2 = localStorage.getItem('player2');
  
  // Between 1 and 2
  currentPlayer = generateRandomNumber(1, 3);
  container.innerHTML = "";
  await matrixCreator();
  playerTurn.innerHTML = `<span>${
    currentPlayer == 1 ? player1 : player2
  }</span>'s turn`;
};

// Start game
startButton.addEventListener("click", () => {
  startScreen.classList.add("hide");
  startGame();
});

const menuButton = document.getElementById("menu");

menuButton.addEventListener("click", () => {
    window.location.href = "mainMenu.html"; // Reindirizza alla pagina del menu principale
});