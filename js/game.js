/**
 * Created by mac on 2021/02/01.
 */
const Game = function () {
  // DOM元素
  let gameDiv;
  let nextDiv;
  let timeDiv;
  let scoreDiv;
  let resultDiv;
  // 分数
  let score = 0;
  // 游戏矩阵
  let gameData = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  // 当前方块
  let cur;
  // 下一个方块
  let next;
  // divs
  let nextDivs = [];
  let gameDivs = [];
  // 初始化div
  const initDiv = function (container, data, divs) {
    for (let i = 0; i < data.length; i++) {
      const div = [];
      for (let j = 0; j < data[0].length; j++) {
        const newNode = document.createElement('div');
        newNode.className = 'none';
        newNode.style.top = (i * 20) + 'px';
        newNode.style.left = (j * 20) + 'px';
        container.appendChild(newNode);
        div.push(newNode);
      }
      divs.push(div);
    }
  };

  // 刷新div
  const refreshDiv = function (data, divs) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[0].length; j++) {
        if (data[i][j] === 0) {
          divs[i][j].className = 'none';
        } else if (data[i][j] === 1) {
          divs[i][j].className = 'done';
        } else if (data[i][j] === 2) {
          divs[i][j].className = 'current';
        }
      }
    }
  };
  // 检查点是否合法
  const check = function (pos, x, y) {
    if (pos.x + x < 0) {
      return false;
    } else if (pos.x + x >= gameData.length) {
      return false;
    } else if (pos.y + y < 0) {
      return false;
    } else if (pos.y + y >= gameData[0].length) {
      return false;
    } else if (gameData[pos.x + x][pos.y + y] === 1) {
      return false;
    } else {
      return true;
    }
  };
  // 检测数据是否合法
  const isValid = function (pos, data) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[0].length; j++) {
        if (data[i][j] !== 0) {
          if (!check(pos, i, j)) {
            return false;
          }
        }
      }
    }
    return true;
  };
  // 清除数据
  const clearData = function () {
    for (let i = 0; i < cur.data.length; i++) {
      for (let j = 0; j < cur.data[0].length; j++) {
        if (check(cur.origin, i, j)) {
          gameData[cur.origin.x + i][cur.origin.y + j] = 0;
        }
      }
    }
  };
  // 设置数据
  const setData = function () {
    for (let i = 0; i < cur.data.length; i++) {
      for (let j = 0; j < cur.data[0].length; j++) {
        if (check(cur.origin, i, j)) {
          gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
        }
      }
    }
  };
  // 下移
  const down = function () {
    if (cur.canDown(isValid)) {
      clearData();
      cur.down();
      setData();
      refreshDiv(gameData, gameDivs);
      return true;
    } else {
      return false;
    }
  };
  // 左异
  const left = function () {
    if (cur.canLeft(isValid)) {
      clearData();
      cur.left();
      setData();
      refreshDiv(gameData, gameDivs);
    }
  };
  // 右移
  const right = function () {
    if (cur.canRight(isValid)) {
      clearData();
      cur.right();
      setData();
      refreshDiv(gameData, gameDivs);
    }
  };
  // 右移
  const rotate = function () {
    if (cur.canRotate(isValid)) {
      clearData();
      cur.rotate();
      setData();
      refreshDiv(gameData, gameDivs);
    }
  };
  // 方块移动到底部，固定方块
  const fixed = function () {
    for (let i = 0; i < cur.data.length; i++) {
      for (let j = 0; j < cur.data[0].length; j++) {
        if (check(cur.origin, i, j)) {
          if (gameData[cur.origin.x + i][cur.origin.y + j] === 2) {
            gameData[cur.origin.x + i][cur.origin.y + j] = 1;
          }
        }
      }
    }
    refreshDiv(gameData, gameDivs);
  };
  // 初始化
  const init = function (doms, type, dir) {
    gameDiv = doms.gameDiv;
    nextDiv = doms.nextDiv;
    timeDiv = doms.timeDiv;
    scoreDiv = doms.scoreDiv;
    resultDiv = doms.resultDiv;
    next = SquareFactory.prototype.make(type, dir);
    initDiv(gameDiv, gameData, gameDivs);
    initDiv(nextDiv, next.data, nextDivs);
    refreshDiv(next.data, nextDivs);
  };
  // 消行
  const checkClear = function () {
    let line = 0;
    for (let i = gameData.length - 1; i >= 0; i--) {
      let clear = true;
      for (let j = 0; j < gameData[0].length; j++) {
        if (gameData[i][j] !== 1) {
          clear = false;
          break;
        }
      }
      if (clear) {
        line += 1;
        for (let m = i; m > 0; m--) {
          for (let n = 0; n < gameData[0].length; n++) {
            gameData[m][n] = gameData[m - 1][n];
          }
        }
        for (let n = 0; n < gameData[0].length; n++) {
          gameData[0][n] = 0;
        }
        i++;
      }
      return line;
    }
  };
  // 检查游戏结束
  const checkGameOver = function () {
    let gameOver = false;
    for (let i = 0; i < gameData[0].length; i++) {
      if (gameData[1][i] === 1) {
        gameOver = true;
      }
    }
    return gameOver;
  };
  // 使用下一个方块
  const performNext = function (type, dir) {
    cur = next;
    setData();
    next = SquareFactory.prototype.make(type, dir);
    refreshDiv(gameData, gameDivs);
    refreshDiv(next.data, nextDivs);
  };
  // 设置时间
  const setTime = function (time) {
    timeDiv.innerHTML = time;
  };
  // 加分
  const addScore = function (line) {
    let s = 0;
    switch (line) {
      case 1:
        s = 10;
        break;
      case 2:
        s = 30;
        break;
      case 3:
        s = 60;
        break;
      case 4:
        s = 100;
        break;
      default:
        break;
    }
    score = score + s;
    scoreDiv.innerHTML = score;
  };
  // 游戏结束
  const gameOver = function (win) {
    if (win) {
      resultDiv.innerHTML = '你赢了';
    } else {
      resultDiv.innerHTML = '你输了';
    }
  };
  // 底部增加行
  const addTailLines = function (lines) {
    for (let i = 0; i < gameData.length - lines.length; i++) {
      gameData[i] = gameData[i + lines.length];
    }
    for (let i = 0; i < lines.length; i++) {
      gameData[gameData.length - lines.length + i] = lines[i];
    }
    cur.origin.x = cur.origin.x - lines.length;
    if (cur.origin.x < 0) cur.origin.x = 0;
    refreshDiv(gameData, gameDivs);
  };
  // 导出API
  this.init = init;
  this.down = down;
  this.left = left;
  this.right = right;
  this.rotate = rotate;
  this.fixed = fixed;
  this.checkClear = checkClear;
  this.checkGameOver = checkGameOver;
  this.performNext = performNext;
  this.setTime = setTime;
  this.addScore = addScore;
  this.gameOver = gameOver;
  this.addTailLines = addTailLines;
  this.fall = function () {
    while (down()) {}
  };
};
