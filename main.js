const container = document.createElement("div");
container.classList.add("container");

const info = document.createElement("div");
info.classList.add("info-row");

const output = document.createElement("span");
output.classList.add("time");
output.textContent = `Time: 00:00`;

const moveCount = document.createElement("span");
moveCount.classList.add("moves");
moveCount.textContent = `Moves: 0`;

const pause = document.createElement("button");
pause.classList.add("pause");
pause.textContent = "Start";

const menuContainer = document.createElement("div");
menuContainer.classList.add("menu");
let cellSize
if(document.body.clientWidth > 400){
    cellSize = 100
}else{
    cellSize = document.body.clientWidth / 4
}
let gamesContainer
let bestScores
let time = 0;
let running = 0;
let moves = 0;
let size = 4;
let board;


let empty = {
  value: 16,
  top: 3,
  left: 3
};
let cells = [];
function createListItems() {
  running = 0;
  const menu = document.createElement("ul");
  const items = [
    "Save Game",
    "New Game",
    "Saved Games",
    "Best Scores",
    "Rules",
    "Settings",
  ];

  items.forEach((key) => {
    const listBtn = document.createElement("button");
    const item = document.createElement("li");
    listBtn.classList.add("list__button");
    listBtn.textContent = key;

    switch (key) {
      case "New Game":
        listBtn.addEventListener("click", () => {
          running = 1;
          time = 0;
          moves = 0;
          moveCount.textContent = `Moves: 0`;
          menuContainer.classList.add("hide");
          menuContainer.classList.remove("menu");
          pause.textContent = "Pause";
          cells = [];
          empty = {
              value: 16,
              left: 3,
              top: 3
          }
          document.querySelector(".squares").remove();
          createSquare();
          increment();
        });
        break;
      case "Save Game":
        listBtn.addEventListener("click", () => {
          let today = new Date()
          let date = today.toDateString()
          let hours = today.getHours()
          let minutes = today.getMinutes()
          let seconds = today.getSeconds()

          if(hours < 10){
              hours = `0${hours}`
          }if(minutes < 10){
              minutes = `0${minutes}`
          }if(seconds < 10){
              seconds = `0${seconds}`
          }
            
            let mins = Math.floor(time / 10 / 60);
            let secs = Math.floor((time / 10) % 60);

            if (mins < 10) {
                mins = "0" + mins;
            }
            if (secs < 10) {
                secs = "0" + secs;
            }
          game = {
            board: cells,
            moves: moves,
            time: time,
            timeOutput: `${mins}:${secs}`,
            size: size,
            cellSize: cellSize,
            date: `${date} ${hours}:${minutes}:${seconds}`
          };
          gamesContainer = JSON.parse(localStorage.getItem('gamesContainer')) || []
          if(gamesContainer.length === 0){
            gamesContainer.push(game)
            }
          else{
              if(time !== gamesContainer[gamesContainer.length - 1].time){
                gamesContainer.push(game)
              }
          }
          localStorage.setItem('gamesContainer', JSON.stringify(gamesContainer))
          
          
        });
        break;
      case "Saved Games":
        listBtn.addEventListener("click", () => {
          let games = JSON.parse(localStorage.getItem('gamesContainer'))
            document.querySelector('ul').remove()
            const savedGames = document.createElement('div')
            savedGames.classList.add('saved-games')
            const heading = document.createElement('h1')
            if(games !== null){
              heading.textContent = `Saved Games: ${games.length}`
            }else {
              heading.textContent = `Saved Games: 0`
            }
            
            heading.classList.add('heading')
            
            const slider = document.createElement('slider')
            slider.classList.add('slider')
            
            
            savedGames.append(heading)

            
            if(games === null){
                const noSavedGames = document.createElement('p')
                noSavedGames.textContent = "There is no any saved games yet!"
                savedGames.appendChild(noSavedGames)
            }else{
                const leftArrow = document.createElement('button')
                leftArrow.classList.add('left-arrow')
                leftArrow.textContent = '<'
                leftArrow.addEventListener('click', () => {
                    let current = document.querySelector('.active').id;
                    let previous
                    if(current > 0){
                        previous = Number(current) - 1
                        document.querySelector('.active').classList.remove('active')
                        document.getElementById(`${previous}`).classList.add('active')
                    }    
                })

                const rightArrow = document.createElement('button')
                rightArrow.classList.add('right-arrow')
                
                rightArrow.addEventListener('click', () => {
                    let current = document.querySelector('.active').id;
                    let next
                    if(current < document.querySelector('slider').children.length - 3){
                        next = Number(current) + 1
                        document.querySelector('.active').classList.remove('active')
                        document.getElementById(`${next}`).classList.add('active')
                    }   
                })

                slider.append(leftArrow)
                for(let i = 0; i < games.length; i++){
                  size = games[i].size
                    findBoardSize()
                    
                    const item = document.createElement('div')
                    item.classList.add('slider__item')
                    item.id = i
                    if(i === 0){
                        item.classList.add('active')
                    }
                    const boardSize = document.createElement('span')
                    
                    boardSize.textContent = `Board Size: ${board}`

                    const timeDownloaded = document.createElement('span')
                    timeDownloaded.textContent = `Time: ${games[i].timeOutput}`

                    const movesNumber = document.createElement('span')
                    movesNumber.textContent = `Moves: ${games[i].moves}`

                    const date = document.createElement('span')
                    date.textContent = games[i].date

                    const load = document.createElement('button')
            load.classList.add('back')
            load.textContent = 'Load Game'
            load.style.marginTop = '20px'

            load.addEventListener('click', () => {
                let download = JSON.parse(localStorage.getItem('gamesContainer'))
                let active = document.querySelector('.active').id

                document.querySelector('.squares').remove()
                cells = []
                size = download[active].size
                cellSize = download[active].cellSize
                moves = download[active].moves
                moveCount.textContent = `Moves: ${moves}`
                time = download[active].time

                output.textContent = `Time: ${download[active].timeOutput}`
                const squares = document.createElement("div");
                squares.classList.add("squares");
                container.append(squares);

                for(let k = 0; k < download[active].board.length - 1; k++){
                  const square = document.createElement("div");
                  const value = download[active].board[k].value
                  square.innerHTML = value;
                  square.classList.add("square", `square-${size}`);

                  const left = download[active].board[k].left
                  const top = download[active].board[k].top

                  cells.push({
                    value: value,
                    left: left,
                    top: top,
                    element: square,
                  });

                  square.style.left = `${left * cellSize}px`;
                  square.style.top = `${top * cellSize}px`;
                  squares.append(square);

                  square.addEventListener("click", () => {
                    const audio = document.querySelector(".touch");
                    audio.currentTime = 0;
                    audio.play();
                    moveSquare(k);
                    countMoves();
                  });
                  empty = {
                    value: download[active].board[download[active].board.length - 1].value,
                    left: download[active].board[download[active].board.length - 1].left,
                    top: download[active].board[download[active].board.length - 1].top
                  }
                  
                }
                cells.push(empty)
                
            })

                    

                    item.append(boardSize, timeDownloaded, movesNumber, date, load)
                    slider.appendChild(item)
                }
                slider.append(rightArrow)
            }

            
            const back = document.createElement("button");
            back.classList.add("back");
            back.style.marginTop = '50px'
            back.textContent = "Go Back";
            back.addEventListener("click", () => {
                savedGames.remove();
                createListItems();
          });
          savedGames.append(slider, back)

            menuContainer.append(savedGames)
          })
          
        break;
      case "Settings":
        listBtn.addEventListener("click", () => {
          const settingContainer = document.createElement("div");
          settingContainer.classList.add("settings");
          document.querySelector("ul").remove();

          const heading = document.createElement("h1");
          heading.textContent = "Settings";
          heading.classList.add("heading");

          const subHeading = document.createElement("h2");
          subHeading.textContent = "Field size:";

          let select = document.createElement("select");
          for (let i = 3; i <= 8; i++) {
            let option = document.createElement("option");
            option.textContent = `${i}x${i}`;
            option.setAttribute("value", `${i}`);
            if (i == 4) {
              option.defaultSelected = true;
            }
            select.append(option);
          } 
          select.addEventListener("change", () => {
            if (select.selectedIndex == 1) {
              size = 4;
              if(document.body.clientWidth > 400){
                cellSize = 100
            }else{
                cellSize = document.body.clientWidth / 4
            }
              cells = [];
              document.querySelector(".squares").remove();
              createSquare();
            } else if (select.selectedIndex == 0) {
              size = 3;
              if(document.body.clientWidth > 400){
                cellSize = 133
            }else{
                cellSize = document.body.clientWidth / 3
            }
              cells = [];
              document.querySelector(".squares").remove();
              createSquare();
            } else if (select.selectedIndex == 2) {
              size = 5;
              if(document.body.clientWidth > 400){
                cellSize = 80
            }else{
                cellSize = document.body.clientWidth / 5
            }
              cells = [];
              document.querySelector(".squares").remove();
              createSquare();
            } else if (select.selectedIndex == 3) {
              size = 6;
              if(document.body.clientWidth > 400){
                cellSize = 66.5
            }else{
                cellSize = document.body.clientWidth / 6
            }
              cells = [];
              document.querySelector(".squares").remove();
              createSquare();
            } else if (select.selectedIndex == 4) {
              size = 7;
              if(document.body.clientWidth > 400){
                cellSize = 57
            }else{
                cellSize = document.body.clientWidth / 7
            }
              cells = [];
              document.querySelector(".squares").remove();
              createSquare();
            } else if (select.selectedIndex == 5) {
              size = 8;
              if(document.body.clientWidth > 400){
                cellSize = 50
            }else{
                cellSize = document.body.clientWidth / 8
            }
              cells = [];
              document.querySelector(".squares").remove();
              createSquare();
            }
          });

          let back = document.createElement("button");
          back.classList.add("back");
          back.textContent = "Go Back";
          back.addEventListener("click", () => {
            settingContainer.remove();
            createListItems();
          });

          const menu = document.querySelector(".menu");
          settingContainer.append(heading, subHeading, select, back);
          menu.append(settingContainer);
        });
        break;
      case "Best Scores":
          listBtn.addEventListener('click', () => {
            document.querySelector('ul').remove()
            const scoresContainer = document.createElement('div')
            const scores = JSON.parse(localStorage.getItem('bestScores'))
            
  
            const scoreList = document.createElement('ul')
            scoreList.classList.add('score-list')
            const dateColumn = document.createElement('ul')
            dateColumn.textContent = 'Date'
            const movesColumn = document.createElement('ul')
            movesColumn.textContent = 'Moves'
            const boardColumn = document.createElement('ul')
            boardColumn.textContent = 'Board'
            const timeColumn = document.createElement('ul')
            timeColumn.textContent = 'Time'
            if(scores !== null){
              for(let i = 0; i < scores.length; i++){
                  
                const scoreDate = document.createElement('li')
                scoreDate.textContent = scores[i].date
                const scoreMoves = document.createElement('li')
                scoreMoves.textContent = scores[i].moves
                const scoreBoard = document.createElement('li')
                scoreBoard.textContent = scores[i].board

                let mins = Math.floor(scores[i].timeOutput / 10 / 60);
                let secs = Math.floor((scores[i].timeOutput / 10) % 60);

                if (mins < 10) {
                  mins = "0" + mins;
                }
                if (secs < 10) {
                  secs = "0" + secs;
                }
                const scoreTime = document.createElement('li')
                scoreTime.textContent = `${mins}:${secs}`

              dateColumn.appendChild(scoreDate)
              movesColumn.appendChild(scoreMoves)
              boardColumn.appendChild(scoreBoard)
              timeColumn.appendChild(scoreTime)
            }
            }
              
              const back = document.createElement("button");
              back.classList.add("back");
              back.style.marginTop = '50px'
              back.textContent = "Go Back";
              back.addEventListener("click", () => {
                  scoresContainer.remove();
                  createListItems();
              });
              scoreList.append(dateColumn, movesColumn, boardColumn, timeColumn)
              scoresContainer.append(scoreList, back)
              menuContainer.append(scoresContainer)
          })
          break;
      case "Rules":
        listBtn.addEventListener('click', () => {
          document.querySelector('ul').remove();
          const rules = document.createElement('div')
          rules.classList.add('rules')

          const heading = document.createElement('h1')
          heading.textContent = "Rules of Gem Puzzle"
          heading.classList.add('heading')

          const firstParagraph = document.createElement('p')
          firstParagraph.classList.add('rule')
          firstParagraph.textContent = "The object of the puzzle is to place the tiles in order by making sliding moves that use the empty space."

          const secondParagraph = document.createElement('p')
          secondParagraph.classList.add('rule')
          secondParagraph.textContent = "You can save your game and load it later. Or you can just use pause button. Also you can choose game field size of color in Settings"

          const back = document.createElement("button");
              back.classList.add("back");
              back.style.marginTop = '20px'
              back.textContent = "Go Back";
              back.addEventListener("click", () => {
                  rules.remove();
                  createListItems();
              });
          rules.append(heading, firstParagraph, secondParagraph, back)
          menuContainer.append(rules)
        })   

    }
    item.append(listBtn);
    menu.append(item);
    menuContainer.append(menu);
  });
}
function moveSquare(index) {
  const cell = cells[index];

  const leftDiff = Math.abs(empty.left - cell.left);
  const topDiff = Math.abs(empty.top - cell.top);

  if (leftDiff + topDiff > 1) {
    return;
  }
  const emptyLeft = empty.left;
  const emptyTop = empty.top;
  empty.left = cell.left;
  empty.top = cell.top;
  cell.left = emptyLeft;
  cell.top = emptyTop;

  cell.element.style.left = `${cell.left * cellSize}px`;
  cell.element.style.top = `${cell.top * cellSize}px`;

  const isFinished = cells.every((cell) => {
    if (size === 4) {
      return cell.value === cell.top * 4 + cell.left + 1;
    } else if (size === 3) {
      return cell.value === cell.top * 3 + cell.left + 1;
    } else if (size === 5) {
      return cell.value === cell.top * 5 + cell.left + 1;
    } else if (size === 6) {
      return cell.value === cell.top * 6 + cell.left + 1;
    } else if (size === 7) {
      return cell.value === cell.top * 7 + cell.left + 1;
    } else if (size === 8) {
      return cell.value === cell.top * 8 + cell.left + 1;
    }
  });
  if (isFinished) {
    findBoardSize()
    let today = new Date()
          let date = today.toDateString()
          let hours = today.getHours()
          let minutes = today.getMinutes()
          let seconds = today.getSeconds()

          if(hours < 10){
              hours = `0${hours}`
          }if(minutes < 10){
              minutes = `0${minutes}`
          }if(seconds < 10){
              seconds = `0${seconds}`
          }

    score = {
        moves: moves,
        timeOutput: time,
        board: board,
        date: `${date} ${hours}:${minutes}:${seconds}`
    }

    bestScores = JSON.parse(localStorage.getItem('bestScores')) || []
    bestScores.push(score)
    
    localStorage.setItem('bestScores', JSON.stringify(bestScores))

    running = 0;
    document.querySelector("ul").remove();
    const congrats = document.createElement("div");
    congrats.classList.add("menu", "congrats");

    const congratsHeading = document.createElement("h1");
    congratsHeading.textContent = "Congratulations!";
    congratsHeading.classList.add("congrats-heading");

    const congratsText = document.createElement("p");
    congratsText.classList.add("congrats-text");

    let back = document.createElement("button");
    back.classList.add("back");
    back.textContent = "Go Back";
    back.addEventListener("click", () => {
      congrats.remove();
      document.querySelector(".hide").classList.add("menu");

      createListItems();
      time = 0;
      moves = 0;
      moveCount.textContent = "Moves: 0";
    });

    congratsText.textContent = `Outstanding! You won the game in ${
      moves + 1
    } moves! You've spent ${Math.floor(time / 10 / 60)} min ${Math.floor(
      (time / 10) % 60
    )} sec and you solved ${board} puzzle!`;

    container.append(congrats);
    congrats.append(congratsHeading, congratsText, back);
  }
}

let number;
function shuffle() {
  if (size === 4) {
    number = [...Array(15).keys()].sort(() => Math.random() - 0.5);
  } else if (size === 3) {
    number = [...Array(8).keys()].sort(() => Math.random() - 0.5);
  } else if (size === 5) {
    number = [...Array(24).keys()].sort(() => Math.random() - 0.5);
  } else if (size === 6) {
    number = [...Array(35).keys()].sort(() => Math.random() - 0.5);
  } else if (size === 7) {
    number = [...Array(48).keys()].sort(() => Math.random() - 0.5);
  } else if (size === 8) {
    number = [...Array(63).keys()].sort(() => Math.random() - 0.5);
  }
}

function createSquare() {
  if (size === 4) {
    const squares = document.createElement("div");
    squares.classList.add("squares");
    container.append(squares);
    shuffle();
    for (let i = 0; i < 15; i++) {
      const square = document.createElement("div");
      const value = number[i] + 1;
      square.innerHTML = value;
      square.classList.add("square", "square-4");

      const left = i % 4;
      const top = (i - left) / 4;

      cells.push({
        value: value,
        left: left,
        top: top,
        element: square,
      });

      square.style.left = `${left * cellSize}px`;
      square.style.top = `${top * cellSize}px`;
      squares.append(square);

      square.addEventListener("click", () => {
        const audio = document.querySelector(".touch");
        audio.currentTime = 0;
        audio.play();
        moveSquare(i);
        countMoves();
      });
    }
    cells.push(empty);
    let isEven = 0;
    for (let i = 0; i < squares.children.length; i++) {
      for (let k = i; k < squares.children.length; k++) {
        if (
          Number(squares.children[i].textContent) >
          Number(squares.children[k].textContent)
        ) {
          isEven++;
        }
      }
    }
    if (isEven % 2 !== 0) {
      cells = [];
      document.querySelector(".squares").remove();
      createSquare();
    }
  } else if (size === 3) {
    empty = {
      value: 9,
      top: 2,
      left: 2,
    };
    const squares = document.createElement("div");
    squares.classList.add("squares");
    container.append(squares);
    shuffle();
    for (let i = 0; i < 8; i++) {
      const square = document.createElement("div");

      const value = number[i] + 1;
      square.innerHTML = value;
      square.classList.add("square", "square-3");

      const left = i % 3;
      const top = (i - left) / 3;

      cells.push({
        value: value,
        left: left,
        top: top,
        element: square,
      });

      square.style.left = `${left * cellSize}px`;
      square.style.top = `${top * cellSize}px`;
      squares.append(square);

      square.addEventListener("click", () => {
        const audio = document.querySelector(".touch");
        audio.currentTime = 0;
        audio.play();
        moveSquare(i);
        countMoves();
      });
    }
    cells.push(empty);

    let isEven = 0;
    for (let i = 0; i < squares.children.length; i++) {
      for (let k = i; k < squares.children.length; k++) {
        if (
          Number(squares.children[i].textContent) >
          Number(squares.children[k].textContent)
        ) {
          isEven++;
        }
      }
    }
    if (isEven % 2 !== 0) {
      cells = [];
      document.querySelector(".squares").remove();
      createSquare();
    }
  } else if (size === 5) {
    empty = {
      value: 25,
      top: 4,
      left: 4,
    };
    const squares = document.createElement("div");
    squares.classList.add("squares");
    container.append(squares);
    shuffle();
    for (let i = 0; i < 24; i++) {
      const square = document.createElement("div");

      const value = number[i] + 1;
      square.innerHTML = value;
      square.classList.add("square", "square-5");

      const left = i % 5;
      const top = (i - left) / 5;

      cells.push({
        value: value,
        left: left,
        top: top,
        element: square,
      });

      square.style.left = `${left * cellSize}px`;
      square.style.top = `${top * cellSize}px`;
      squares.append(square);

      square.addEventListener("click", () => {
        const audio = document.querySelector(".touch");
        audio.currentTime = 0;
        audio.play();
        moveSquare(i);
        countMoves();
      });
    }
    cells.push(empty);
    let isEven = 0;
    for (let i = 0; i < squares.children.length; i++) {
      for (let k = i; k < squares.children.length; k++) {
        if (
          Number(squares.children[i].textContent) >
          Number(squares.children[k].textContent)
        ) {
          isEven++;
        }
      }
    }
    if (isEven % 2) {
      cells = [];
      document.querySelector(".squares").remove();
      createSquare();
    }
  } else if (size === 6) {
    empty = {
      value: 36,
      top: 5,
      left: 5,
    };
    const squares = document.createElement("div");
    squares.classList.add("squares");
    container.append(squares);
    shuffle();
    for (let i = 0; i < 35; i++) {
      const square = document.createElement("div");

      const value = number[i] + 1;
      square.innerHTML = value;
      square.classList.add("square", "square-6");

      const left = i % 6;
      const top = (i - left) / 6;

      cells.push({
        value: value,
        left: left,
        top: top,
        element: square,
      });

      square.style.left = `${left * cellSize}px`;
      square.style.top = `${top * cellSize}px`;
      squares.append(square);

      square.addEventListener("click", () => {
        const audio = document.querySelector(".touch");
        audio.currentTime = 0;
        audio.play();
        moveSquare(i);
        countMoves();
      });
    }
    cells.push(empty);
    let isEven = 0;
    for (let i = 0; i < squares.children.length; i++) {
      for (let k = i; k < squares.children.length; k++) {
        if (
          Number(squares.children[i].textContent) >
          Number(squares.children[k].textContent)
        ) {
          isEven++;
        }
      }
    }
    if (isEven % 2) {
      cells = [];
      document.querySelector(".squares").remove();
      createSquare();
    }
  } else if (size === 7) {
    empty = {
      value: 49,
      top: 6,
      left: 6,
    };
    const squares = document.createElement("div");
    squares.classList.add("squares");
    container.append(squares);
    shuffle();
    for (let i = 0; i < 48; i++) {
      const square = document.createElement("div");

      const value = number[i] + 1;
      square.innerHTML = value;
      square.classList.add("square", "square-7");

      const left = i % 7;
      const top = (i - left) / 7;

      cells.push({
        value: value,
        left: left,
        top: top,
        element: square,
      });

      square.style.left = `${left * cellSize}px`;
      square.style.top = `${top * cellSize}px`;
      squares.append(square);

      square.addEventListener("click", () => {
        const audio = document.querySelector(".touch");
        audio.currentTime = 0;
        audio.play();
        moveSquare(i);
        countMoves();
      });
    }
    cells.push(empty);
    let isEven = 0;
    for (let i = 0; i < squares.children.length; i++) {
      for (let k = i; k < squares.children.length; k++) {
        if (
          Number(squares.children[i].textContent) >
          Number(squares.children[k].textContent)
        ) {
          isEven++;
        }
      }
    }
    if (isEven % 2) {
      cells = [];
      document.querySelector(".squares").remove();
      createSquare();
    }
  } else if (size === 8) {
    empty = {
      value: 64,
      top: 7,
      left: 7,
    };
    const squares = document.createElement("div");
    squares.classList.add("squares");
    container.append(squares);
    shuffle();
    for (let i = 0; i < 63; i++) {
      const square = document.createElement("div");

      const value = number[i] + 1;
      square.innerHTML = value;
      square.classList.add("square", "square-8");

      const left = i % 8;
      const top = (i - left) / 8;

      cells.push({
        value: value,
        left: left,
        top: top,
        element: square,
      });

      square.style.left = `${left * cellSize}px`;
      square.style.top = `${top * cellSize}px`;
      squares.append(square);

      square.addEventListener("click", () => {
        const audio = document.querySelector(".touch");
        audio.currentTime = 0;
        audio.play();
        moveSquare(i);
        countMoves();
      });
    }
    cells.push(empty);
    let isEven = 0;
    for (let i = 0; i < squares.children.length; i++) {
      for (let k = i; k < squares.children.length; k++) {
        if (
          Number(squares.children[i].textContent) >
          Number(squares.children[k].textContent)
        ) {
          isEven++;
        }
      }
    }
    if (isEven % 2) {
      cells = [];
      document.querySelector(".squares").remove();
      createSquare();
    }
  }
}

function countMoves() {
  moves++;
  moveCount.textContent = `Moves: ${moves}`;
}
function increment() {
  if (running) {
    setTimeout(function () {
      time++;
      let mins = Math.floor(time / 10 / 60);
      let secs = Math.floor((time / 10) % 60);

      if (mins < 10) {
        mins = "0" + mins;
      }
      if (secs < 10) {
        secs = "0" + secs;
      }
      document.querySelector(".time").textContent = `Time: ${mins}:${secs}`;
      increment();
    }, 100);
  }
}
function setDate(){
    
}


pause.addEventListener("click", () => {
  running = !running;
  if (running) {
    menuContainer.classList.add("hide");
    menuContainer.classList.remove("menu");
    pause.textContent = "Pause";
    increment();
  } else {
    pause.textContent = "Resume";
    menuContainer.classList.remove("hide");
    menuContainer.classList.add("menu");
  }
});
function findBoardSize(){
    if (size == 3) {
        board = "3x3";
      } else if (size == 4) {
        board = "4x4";
      } else if (size == 5) {
        board = "5x5";
      } else if (size == 6) {
        board = "6x6";
      } else if (size == 7) {
        board = "7x7";
      } else if (size == 8) {
        board = "8x8";
      }
}

document.body.appendChild(container);
container.append(info, menuContainer);

info.append(output, moveCount, pause);
/* _startTimer(); */
createSquare();
createListItems();
/* document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".square").classList.add("img");
}); */






