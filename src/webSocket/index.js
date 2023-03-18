const ws = require('nodejs-websocket');

class WebSocket {
  constructor(port) {
    this.socketList = [];
    this.ws = ws.createServer(this.wsServer);
    this.ws.listen(port, function() {
      console.log('webSocket启动成功, 端口:' + port);
    });
  }
  wsServer(socket) {
    this.socket = socket;
    const eventList = ['connect', 'text', 'error', 'close'];
    eventList.forEach(type => {
      this.event(socket, type);
    });
  }
  /**
   * 获取符合条件的userSocketItem组成的数组
   * @param {Function(userSocketItem):boolean} rule 查找规则
   * @returns {userSocketItem[]}
   */
  getSockets(rule) {
    return this.socketList.filter(item => {
      return rule(item);
    });
  }
  event(socket, type) {
    socket.on(type, this[type]);
  }
  close(code, reason) {
    console.log(code, reason);
    console.log('Connection closed');
  }
  error() {
    const index = this.socketList.findIndex(item => {
      return Object.is(item.socket, this.socket);
    });
    if (index !== -1) {
      this.socketList.splice(index, 1);
    }
    console.log('连接异常。。。。');
  }
  // 事件名称为text(读取字符串时，就叫做text)，读取客户端传来的字符串
  // message需包含 socketType token
  text(str) {
    const message = JSON.parse(str);
    if (!message.token) {
      return;
    }
  }
  connect(code) {
    console.log('开启连接', code);
  }
  binary(inStream) {
    // 创建空的buffer对象，收集二进制数据
    var data = new Buffer(0);
    // 读取二进制数据的内容并且添加到buffer中
    inStream.on('readable', function() {
      var newData = inStream.read();
      if (newData) {
        data = Buffer.concat([data, newData], data.length + newData.length);
      }
    });
    inStream.on('end', function() {
      // 读取完成二进制数据后，处理二进制数据
      console.log(data);
    });
  }
  /**
   * 回复前端JSON数据
   * @param {Array<T>} keys 发送人的主键数组
   * @param {object} data 要返回的数据
   */
  sendJson(keys, data) {
    const sendSocketList = this.getSockets((userSocketItem) => {
      // 此处进行条件查询，返回true或false
      return keys.findIndex(key => key === userSocketItem.key) !== -1;
    });
    sendSocketList.forEach(socket => {
      socket.sendText(JSON.stringify(data));
    });
  }
}

module.exports = WebSocket;
