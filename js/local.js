/**
 * Created by mac on 2021/02/01.
 */
const Local = function (socket) {
  // 游戏对象
  let game;
  // 时间间隔
  let INTERVAL = 200;
  // 定时器
  let timer = null;
  // 时间计数器
  let timeCount = 0;
  // 时间
  let time = 0;
  // 绑定键盘事件
  let bindKeyEvent = function () {
    document.onkeydown = function (e) {
      if (e.keyCode === 38) {
        // up
        console.log('up');
        game.rotate();
        socket.emit('rotate');
      } else if (e.keyCode === 39) {
        // right
        console.log('right');
        game.right();
        socket.emit('right');
      } else if (e.keyCode === 40) {
        // down
        console.log('down');
        game.down();
        socket.emit('down');
      } else if (e.keyCode === 37) {
        //left
        console.log('left');
        game.left();
        socket.emit('left');
      } else if (e.keyCode === 32) {
        // space
        console.log('fall');
        game.fall();
        socket.emit('fall');
      }
    };
  };
  // 移动
  let move = function () {
    timeFunc();
    if (!game.down()) {
      game.fixed();
      socket.emit('fixed');
      let line = game.checkClear();
      if (line) {
        game.addScore(line);
        socket.emit('line', line);
      }
      let gameOver = game.checkGameOver();
      if (gameOver) {
        game.gameOver();
        stop();
      } else {
        let t = generateType();
        let d = generateDir();
        game.performNext(t, d);
        socket.emit('next', { type: t, dir: d });
      }
    } else {
      socket.emit('down');
    }
  };
  // 随机生成干扰行
  const generateBottomLine = function (lineNum) {
    let lines = [];
    for (let i = 0; i < lineNum; i++) {
      let line = [];
      for (let j = 0; j < 10; j++) {
        line.push(Math.ceil(Math.random() * 2) - 1);
      }
      lines.push(line);
    }
    return lines;
  };
  // 计时函数
  const timeFunc = function () {
    timeCount += 1;
    if (timeCount === 5) {
      timeCount = 0;
      time += 1;
      game.setTime(time);
      if (time % 10 === 0) {
        game.addTailLines(generateBottomLine(1));
      }
    }
  };
  // 随机生成一个方块种类
  const generateType = function () {
    return Math.ceil(Math.random() * 7) - 1;
  };
  // 随机生成一个旋转次数
  const generateDir = function () {
    return Math.ceil(Math.random() * 4) - 1;
  };
  // 开始
  const start = function () {
    let doms = {
      gameDiv: document.getElementById('local_game'),
      nextDiv: document.getElementById('local_next'),
      timeDiv: document.getElementById('local_time'),
      scoreDiv: document.getElementById('local_score'),
      resultDiv: document.getElementById('local_gameover'),
    };
    game = new Game();
    let type = generateType();
    let dir = generateDir();
    game.init(doms, type, dir);
    socket.emit('init', { type, dir });
    bindKeyEvent();
    let t = generateType();
    let d = generateDir();
    game.performNext(t, d);
    socket.emit('next', { type: t, dir: d });
    timer = setInterval(move, INTERVAL);
  };
  // 结束
  const stop = function () {
    if (timer) {
      clearInterval(timer);
      timer = null;
      document.onkeydown = null;
    }
  };

  socket.on('start', function () {
    document.getElementById('waiting').innerHTML = '';
    start();
  });
};
