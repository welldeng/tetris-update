let app = require('http')
  .createServer();

let io = require('socket.io')(app);

const PORT = 3000;

// 客户端计数
let clientCount = 0;

// 保存客户端socket
let socketMap = {};

app.listen(PORT);

let bindListener = function (socket, event) {
  socket.on(event, function (data) {
    if (socket.clientNum % 2 === 0) {
      socketMap[(socket.clientNum - 1)].emit(event, data);
    } else {
      socketMap[(socket.clientNum + 1)].emit(event, data);
    }
  });
};

io.on('connection', function (socket) {

  clientCount = clientCount + 1;
  socket.clientNum = clientCount;
  socketMap[clientCount] = socket;

  if (clientCount % 2 === 1) {
    socket.emit('waiting', 'waiting for another person');
  } else {
    socket.emit('start');
    socketMap[(clientCount - 1)].emit('start');
  }

  bindListener(socket, 'init');
  bindListener(socket, 'next');
  bindListener(socket, 'rotate');
  bindListener(socket, 'right');
  bindListener(socket, 'down');
  bindListener(socket, 'left');
  bindListener(socket, 'fall');
  bindListener(socket, 'fixed');
  bindListener(socket, 'line');

  socket.on('disconnect', function () {
  });

});

console.log('websocket listening on port ' + PORT);
