function getContainer() {
  return document.querySelector(".container");
}

function getPlayerTurn() {
  return document.getElementById("playerTurn");
}

function getStartScreen() {
  return document.querySelector(".startScreen");
}

function getStartButton() {
  return document.getElementById("start");
}

function getMessage() {
  return document.getElementById("message");
}

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

function updateLeaderboard() {
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
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function verifyArray(arrayElement) {
  let bool = false;
  let elementCount = 0;
  arrayElement.forEach((element) => {
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
}

function gameOverCheck() {
  let truthCount = 0;
  for (let innerArray of initialMatrix) {
    if (innerArray.every((val) => val != 0)) {
      truthCount += 1;
    } else {
      return false;
    }
  }
  if (truthCount == 6) {
    getMessage().innerText = "Game Over";
    getStartScreen().classList.remove("hide");
  }
}

function checkAdjacentRowValues(row) {
  return verifyArray(initialMatrix[row]);
}

function checkAdjacentColumnValues(column) {
  let colWinCount = 0,
    colWinBool = false;
  initialMatrix.forEach((element) => {
    if (element[column] == currentPlayer) {
      colWinCount += 1;
      if (colWinCount == 4) {
        colWinBool = true;
      }
    } else {
      colWinCount = 0;
    }
  });
  return colWinBool;
}

function getRightDiagonal(row, column, rowLength, columnLength) {
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
}

function getLeftDiagonal(row, column, rowLength, columnLength) {
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
}

function checkAdjacentDiagonalValues(row, column) {
  let diagWinBool = false;
  let tempChecks = {
    leftTop: [],
    rightTop: [],
  };
  let columnLength = initialMatrix[row].length;
  let rowLength = initialMatrix.length;

  tempChecks.leftTop = getLeftDiagonal(row, column, rowLength, columnLength);
  tempChecks.rightTop = getRightDiagonal(row, column, rowLength, columnLength);

  diagWinBool = verifyArray(tempChecks.rightTop);
  if (!diagWinBool) {
    diagWinBool = verifyArray(tempChecks.leftTop);
  }
  return diagWinBool;
}

function winCheck(row, column) {
  return checkAdjacentRowValues(row)
    ? true
    : checkAdjacentColumnValues(column)
    ? true
    : checkAdjacentDiagonalValues(row, column)
    ? true
    : false;
}

function setPiece(startCount, colValue) {
  let rows = document.querySelectorAll(".grid-row");
  if (initialMatrix[startCount][colValue] != 0) {
    startCount -= 1;
    setPiece(startCount, colValue);
  } else {
    let currentRow = rows[startCount].querySelectorAll(".grid-box");
    currentRow[colValue].classList.add("filled", `player${currentPlayer}`);
    initialMatrix[startCount][colValue] = currentPlayer;
    if (winCheck(startCount, colValue)) {
      getMessage().innerHTML = `<span>${
        currentPlayer == 1 ? player1 : player2
      }</span> wins`;
      updateLeaderboard();
      getStartScreen().classList.remove("hide");
      return false;
    }
  }
  gameOverCheck();
}

function fillBox(e) {
  let colValue = parseInt(e.target.getAttribute("data-value"));
  setPiece(5, colValue);
  currentPlayer = currentPlayer == 1 ? 2 : 1;
  getPlayerTurn().innerHTML = `<span>${
    currentPlayer == 1 ? player1 : player2
  }</span>'s turn`;
}

function matrixCreator() {
  for (let innerArray in initialMatrix) {
    let outerDiv = document.createElement("div");
    outerDiv.classList.add("grid-row");
    outerDiv.setAttribute("data-value", innerArray);
    for (let j in initialMatrix[innerArray]) {
      initialMatrix[innerArray][j] = [0];
      let innerDiv = document.createElement("div");
      innerDiv.classList.add("grid-box");
      innerDiv.setAttribute("data-value", j);
      innerDiv.addEventListener("click", (e) => {
        fillBox(e);
      });
      outerDiv.appendChild(innerDiv);
    }
    getContainer().appendChild(outerDiv);
  }
}

window.onload = startGame = async () => {
  player1 = localStorage.getItem('player1');
  player2 = localStorage.getItem('player2');
  document.getElementById("ciao").innerHTML = player1;
  document.getElementById("addio").innerHTML = player2;

  currentPlayer = generateRandomNumber(1, 3);
  getContainer().innerHTML = "";
  await matrixCreator();
  getPlayerTurn().innerHTML = `<span>${
    currentPlayer == 1 ? player1 : player2
  }</span>'s turn`;
};

getStartButton().addEventListener("click", () => {
  getStartScreen().classList.add("hide");
  startGame();
});

const menuButton = document.getElementById("menu");

menuButton.addEventListener("click", () => {
  window.location.href = "mainMenu.html";
});