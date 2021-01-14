'use strict';
/**
 * 服务端操作 - 负责通过Socket和Client通信
 * 继承了Server.js
 * 运行在node.js之上
 */
var EventEmitter = require('events').EventEmitter;
var TextOperation = require('./text-operation');
var WrappedOperation = require('./wrapped-operation');
var Server = require('./server');
var Selection = require('./selection');
var util = require('util');
const {DEFAULT_DOC} = require('../constants');

function EditorSocketIOServer (document, operations, docId, mayWrite) {
  EventEmitter.call(this);
  Server.call(this, document, operations);
  this.users = {};
  this.docId = docId;
  this.mayWrite = mayWrite || function (_, cb) { cb(true); };
}

util.inherits(EditorSocketIOServer, Server);
extend(EditorSocketIOServer.prototype, EventEmitter.prototype);

function extend (target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
}

/**
 * 增加一个Client
 * 1. 分配docId，表明操作的是同一个文档
 * 2. 发送当前的document
 * 3. 鉴权：没写username不允许进行操作
 * 4. 注册事件
 * @param {*} socket 
 */
EditorSocketIOServer.prototype.addClient = function (socket) {
  var self = this;
  socket.join(this.docId);
  socket.emit('doc', {
    str: this.document,
    revision: this.operations.length,
    clients: this.users
  });
  socket
    .on('operation', function (revision, operation, selection) {
      self.mayWrite(socket, function (mayWrite) {
        if (!mayWrite) {
          console.log("User doesn't have the right to edit.");
          return;
        }
        self.onOperation(socket, revision, operation, selection);
      });
    })
    .on('selection', function (obj) {
      self.mayWrite(socket, function (mayWrite) {
        if (!mayWrite) {
          console.log("User doesn't have the right to edit.");
          return;
        }
        self.updateSelection(socket, obj && Selection.fromJSON(obj));
      });
    })
    .on('disconnect', function () {
      console.log("Disconnect");
      socket.leave(self.docId);
      self.onDisconnect(socket);
      if (
        (socket.manager && socket.manager.sockets.clients(self.docId).length === 0) || // socket.io <= 0.9
        (socket.ns && Object.keys(socket.ns.connected).length === 0) || // socket.io >= 1.0
        (socket.nsp && socket.nsp.sockets.size === 0)
      ) {
        // for sake of security, when room's empty, reset document and revision
        self.document = DEFAULT_DOC;
        self.revision = 0;
        self.emit('empty-room');
      }
    });
};
/**
 * 进行操作的回调函数
 * @param {*} socket 
 * @param {*} revision 
 * @param {*} operation 
 * @param {*} selection 
 */
EditorSocketIOServer.prototype.onOperation = function (socket, revision, operation, selection) {
  var wrapped;
  try {
    wrapped = new WrappedOperation(
      TextOperation.fromJSON(operation),
      selection && Selection.fromJSON(selection)
    );
  } catch (exc) {
    console.error("Invalid operation received: " + exc);
    return;
  }

  try {
    var clientId = socket.id;
    // nodejs采用协同式线程调度，进程中只存在一个内核线程，不存在真正的并发，所以不用加锁
    // 如果用Java实现，这里需要加锁
    var wrappedPrime = this.receiveOperation(revision, wrapped);
    console.log("new operation: " + wrapped);
    this.getClient(clientId).selection = wrappedPrime.meta;
    // 为正在操作同一个docId的client广播操作事件
    socket.emit('ack');
    socket.broadcast['in'](this.docId).emit(
      'operation', clientId,
      wrappedPrime.wrapped.toJSON(), wrappedPrime.meta
    );
  } catch (exc) {
    console.error(exc);
  }
};

EditorSocketIOServer.prototype.updateSelection = function (socket, selection) {
  var clientId = socket.id;
  if (selection) {
    this.getClient(clientId).selection = selection;
  } else {
    delete this.getClient(clientId).selection;
  }
  socket.broadcast['in'](this.docId).emit('selection', clientId, selection);
};

EditorSocketIOServer.prototype.setName = function (socket, name) {
  var clientId = socket.id;
  this.getClient(clientId).name = name;
  socket.broadcast['in'](this.docId).emit('set_name', clientId, name);
  return clientId
};

EditorSocketIOServer.prototype.getClient = function (clientId) {
  return this.users[clientId] || (this.users[clientId] = {});
};

EditorSocketIOServer.prototype.onDisconnect = function (socket) {
  var clientId = socket.id;
  delete this.users[clientId];
  socket.broadcast['in'](this.docId).emit('client_left', clientId);
};

module.exports = EditorSocketIOServer;
