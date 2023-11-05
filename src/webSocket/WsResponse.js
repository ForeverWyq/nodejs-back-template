const { RESPONSE } = require('@/common/CONSTANT');
class WsResponse {
  success(socket, type, data, message) {
    const params = {
      code: RESPONSE.SUCCESS_CODE,
      type,
      data,
      message: message || '成功'
    };
    socket.send(JSON.stringify(params));
  }
  error(socket, err, message) {
    const params = {
      code: RESPONSE.ERROR_CODE,
      err,
      message: message || '系统错误'
    };
    socket.send(JSON.stringify(params));
  }
}

module.exports = new WsResponse();
