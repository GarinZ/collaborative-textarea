const express = require('express');
const morgan = require('morgan');
const serveStatic = require('serve-static');
const errorhandler = require('errorhandler');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');
const {EditorSocketIOServer} = require('./lib');
const isDev = process.env.NODE_ENV === 'development';
var app = express();
var appServer = http.Server(app);

app.use(morgan('combined'));
app.use(isDev ? '/' : '/collaborative-textarea', serveStatic(path.join(__dirname, '../public')));
app.use(isDev ? '/static' : '/collaborative-textarea/static', serveStatic(path.join(__dirname, '../public')));
if (isDev) {
  app.use(errorhandler());
}

var io = socketIO(appServer);

var str = "# Welcome to Collaborative TextArea Demo";
var socketIOServer = new EditorSocketIOServer(str, [], 'demo', function (socket, cb) {
  cb(!!socket.mayEdit);
});
io.sockets.on('connection', function (socket) {
    socketIOServer.addClient(socket);
    socket.on('login', function (obj) {
      if (typeof obj.name !== 'string') {
        console.error('obj.name is not a string');
        return;
      }
      socket.mayEdit = true;
      // setName函数内会进行广播
      const clientName = obj.name;
      const clientId = socketIOServer.setName(socket, obj.name);
      socket.emit('logged_in', {clientId, clientName});
    });
  });
  
  var port = process.env.PORT || 4000;
  appServer.listen(port, function () {
    console.log("Listening on port " + port);
  });
  
  process.on('uncaughtException', function (exc) {
    console.error(exc);
  });