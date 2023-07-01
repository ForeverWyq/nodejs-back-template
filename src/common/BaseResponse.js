const { RESPONSE } = global.$CONSTANT;
const { AllowOrigin, AllowHeaders, AllowMethods } = global.$config;
class BaseResponse {
  constructor() {
    this.head = {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': AllowOrigin.join(','),
      'Access-Control-Allow-Headers': AllowHeaders.join(','),
      'Access-Control-Allow-Methods': AllowMethods.join(',')
    };
  }
  success(res, data, message) {
    const params = {
      code: RESPONSE.SUCCESS_CODE,
      data,
      message: message || '成功'
    };
    res.writeHead(200, this.head);
    res.end(JSON.stringify(params));
  }
  error(res, err, message) {
    const params = {
      code: RESPONSE.ERROR_CODE,
      err,
      message: message || '系统错误'
    };
    res.writeHead(500, this.head);
    res.end(JSON.stringify(params));
  }
  permissionDenied(res) {
    const params = {
      code: RESPONSE.PERMISSION_DENIED,
      message: '无权限访问'
    };
    res.writeHead(401, this.head);
    res.end(JSON.stringify(params));
  }
  notFound(res, path, method) {
    const params = {
      code: RESPONSE.NOT_FOUND,
      path,
      method,
      message: '找不到路径'
    };
    res.writeHead(404, this.head);
    res.end(JSON.stringify(params));
  }
}

module.exports = new BaseResponse();
