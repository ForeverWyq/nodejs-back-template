const { RESPONSE } = global.$CONSTANT;
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
  exceedMaximum(socket) {
    const params = {
      code: RESPONSE.EXCEED_MAXIMUM,
      message: '连接超出上限'
    };
    socket.send(JSON.stringify(params));
  }
}

module.exports = new WsResponse();
