const http = require('http');
const url = require('url');
const querystring = require('querystring');
const multiparty = require('multiparty');

const BaseResponse = require('@/common/BaseResponse');
const WebSocket = require('@/webSocket/index');

const handleTryCatch = require('@/utils/handleTryCatch');
const Router = require('@/utils/router');
const { importAll, mkdirPath } = require('@/utils/file');
const { getToken, checkoutToken } = require('./utils/auth');

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
    const token = getToken(req);
    // token合法性拦截
    if (!this.whiteList.includes(path_) && !checkoutToken(token)) {
      return BaseResponse.permissionDenied(res);
    }
    if (bodyType === 'form') {
      return this.formRequest(fn, req, res);
    }
    this.otherTypeRequest(fn, req, res);
  }
  callFn(fn, ...arg) {
    handleTryCatch(fn, ...arg).then(([error]) => {
      error && BaseResponse.error(res, error);
    });
  }
  formRequest(fn, req, res) {
    const formData = new multiparty.Form({ uploadDir: mkdirPath(this.fileSavePath) });
    formData.parse(req, (error, fields, files) => {
      if (error) {
        return BaseResponse.error(res, error);
      }
      this.callFn(fn, { res, ws: this.ws, fields, files });
    });
  }
  otherTypeRequest(fn, req, res) {
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
      this.callFn(fn, { res, paramsData: params, bodyData: data, ws: this.ws });
    });
  }
}

module.exports = HttpServer;
