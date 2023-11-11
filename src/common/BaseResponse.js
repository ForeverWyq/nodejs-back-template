const { RESPONSE } = global.$CONSTANT;
const { AllowOrigin, AllowHeaders, AllowMethods } = global.$config;
class BaseResponse {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': AllowOrigin.join(','),
      'Access-Control-Allow-Headers': AllowHeaders.join(','),
      'Access-Control-Allow-Methods': AllowMethods.join(',')
    };
  }
  _writeHead(res, { code = 200, headers = {} }) {
    res.writeHead(code, { ...this.headers, ...headers });
  }
  success(res, data, message, headers) {
    const params = {
      code: RESPONSE.SUCCESS_CODE,
      data,
      message: message || '成功'
    };
    this._writeHead(res, { headers });
    res.end(JSON.stringify(params));
  }
  error(res, message, err, headers) {
    const params = {
      code: RESPONSE.ERROR_CODE,
      err,
      message: message || '系统错误'
    };
    this._writeHead(res, { headers });
    res.end(JSON.stringify(params));
  }
  permissionDenied(res, headers) {
    const params = {
      code: RESPONSE.PERMISSION_DENIED,
      message: '无权限访问'
    };
    this._writeHead(res, { headers });
    res.end(JSON.stringify(params));
  }
  notFound(res, path, method) {
    const params = {
      code: RESPONSE.NOT_FOUND,
      path,
      method,
      message: '找不到路径'
    };
    this._writeHead(res, { code: 404 });
    res.end(JSON.stringify(params));
  }
}

module.exports = new BaseResponse();
