const express = require('express');
const morgan = require('morgan');
const serveStatic = require('serve-static');
const errorhandler = require('errorhandler');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');
const {EditorSocketIOServer} = require('./lib');

var app = express();
var appServer = http.Server(app);

app.use(morgan('combined'));
// app.use('/', serveStatic(path.join(__dirname, '../../public')));
// app.use('/static', serveStatic(path.join(__dirname, '../../public')));
if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}

var io = socketIO(appServer);

var str = "# This is a Markdown heading\n\n"
        + "1. un\n"
        + "2. deux\n"
        + "3. trois\n\n"
        + "Lorem *ipsum* dolor **sit** amet.\n\n"
        + "    $ touch test.txt";
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
      socketIOServer.setName(socket, obj.name);
      socket.emit('logged_in', {});
    });
  });
  
  var port = process.env.PORT || 4000;
  appServer.listen(port, function () {
    console.log("Listening on port " + port);
  });
  
  process.on('uncaughtException', function (exc) {
    console.error(exc);
  });