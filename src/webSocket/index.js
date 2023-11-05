const ws = require('ws');
const WsResponse = require('./WsResponse');
const distribute = require('./distribute');

class WebSocket {
  constructor(server) {
    this.ws = new ws.WebSocketServer({ server });
    const eventList = ['message', 'error', 'close'];
    this.ws.on('connection', (socket) => {
      eventList.forEach(type => this.event(socket, type));
    });
  }
  // 事件分发
  event(socket, type) {
    socket.on(type, (...arg) => this[type](socket, ...arg));
  }
  close(socket, code) {
    console.log('连接关闭', code);
  }
  error(socket) {
    console.log('连接异常');
  }
  // message需包含 socketType token
  message(socket, str, isBinary) {
    if (isBinary) {
      return;
    }
    try {
      const data = JSON.parse(str);
      if (!data.token) {
        return;
      }
      const [fn] = distribute(data.path);
      fn({ socket, wsData: data, res: WsResponse, ws: this });
    } catch (error) {
      WsResponse.error(socket, error.message);
    }
  }
  /**
   * 回复前端JSON数据 TODO: 未完成
   * @param {Array<T>} keys 发送人的主键数组
   * @param {string} type 消息类型，方便前端去分发处理
   * @param {object} data 要返回的数据
   */
  sendJson(keys, type, data) {
    // const sendSocketList = this.getSockets();
    sendSocketList.forEach(socket => {
      WsResponse.success(socket, type, data);
    });
  }
}

module.exports = WebSocket;
