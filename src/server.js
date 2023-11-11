const http = require('http');
const url = require('url');
const querystring = require('querystring');
const multiparty = require('multiparty');

const BaseResponse = require('@/common/BaseResponse');
const WebSocket = require('@/webSocket/index');

const handleTryCatch = require('@/utils/handleTryCatch');
const Router = require('@/utils/router');
const { importAll, mkdirPath } = require('@/utils/file');
const { tokenAuth, refreshTokenAuth } = require('./utils/auth');

class HttpServer {
  constructor(options) {
    const {
      serverBaseUrl,
      serverPort,
      WHITE_URL,
      fileSavePath
    } = options;
    this.whiteList = WHITE_URL;
    this.fileSavePath = fileSavePath;
    this.router = this.registeredRoute(serverBaseUrl);
    this.server = http.createServer((req, res) => this.httpRequest(req, res));
    this.ws = this.createWebSocketServer();
    this.listen(serverPort);
  }
  listen(port) {
    this.server.listen(port, () => {
      console.log('HttpServer启动成功, 端口:' + port);
    });
  }
  registeredRoute(baseUrl) {
    // 路由注册
    const controllerFiles = require.context('./controller/', true, /\.js$/);
    const fileMap = importAll(controllerFiles);
    const router = new Router(baseUrl);
    Object.keys(fileMap).forEach(name => {
      const register = fileMap[name];
      if (typeof register === 'function') {
        register(router);
      }
    });
    return router;
  }
  createWebSocketServer() {
    return new WebSocket(this.server);
  }
  httpRequest(req, res) {
    const { method } = req;
    if (method === 'OPTIONS') {
      // 回复OPTIONS
      BaseResponse.success(res);
      return;
    }
    // 请求的地址 path_
    const path_ = url.parse(req.url).pathname;
    const [fn, bodyType] = this.router.use(method, path_);
    if (!fn) {
      BaseResponse.notFound(res, path_, method);
      return;
    }
    const tokenInfo = this.authVerify(req, path_);
    if (!tokenInfo || tokenInfo.refresh) {
      return BaseResponse.permissionDenied(res, this.getTokenHeader(tokenInfo));
    }
    const requestParams = { req, res, tokenInfo, ws: this.ws };
    if (bodyType === 'form') {
      return this.formRequest(fn, requestParams);
    }
    this.otherTypeRequest(fn, requestParams);
  }
  authVerify(req, path_) {
    if (this.whiteList.includes(path_)) {
      return { whitePath: true };
    }
    // token合法性拦截
    const tokenInfo = tokenAuth.verifyToken(req);
    if (tokenInfo) {
      return tokenInfo;
    }
    const refreshTokenInfo = refreshTokenAuth.verifyToken(req);
    if (refreshTokenInfo) {
      return { ...refreshTokenInfo, refresh: true };
    }
    return null;
  }
  getTokenHeader(tokenInfo) {
    if (!tokenInfo) {
      return {};
    }
    const info = { ...tokenInfo };
    delete info.refresh;
    const newToken = tokenAuth.refreshToken(info);
    const newRefreshToken = refreshTokenAuth.refreshToken(info);
    return {
      [tokenAuth.headerKey]: newToken,
      [refreshTokenAuth.headerKey]: newRefreshToken,
    }
  }
  callFn(fn, res, ...arg) {
    handleTryCatch(fn, ...arg).then(([error]) => {
      error && BaseResponse.error(res, error.message);
    });
  }
  formRequest(fn, requestParams) {
    const { req, res } = requestParams;
    const formData = new multiparty.Form({ uploadDir: mkdirPath(this.fileSavePath) });
    formData.parse(req, (error, fields, files) => {
      if (error) {
        return BaseResponse.error(res, error);
      }
      this.callFn(fn, res, { ...requestParams, fields, files });
    });
  }
  otherTypeRequest(fn, requestParams) {
    const { req, res } = requestParams;
    // 路径参数
    const params = querystring.parse(url.parse(req.url).query);
    let buffer = Buffer.from([]);
    req.on('data', (data) => {
      buffer += data;
    });
    req.on('end', () => {
      let data;
      try {
        data = JSON.parse(buffer.toString());
      } catch (e) {
        data = {};
      }
      this.callFn(fn, res, { ...requestParams, paramsData: params, bodyData: data });
    });
  }
}

module.exports = HttpServer;
