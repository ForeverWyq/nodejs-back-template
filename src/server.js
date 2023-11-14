const http = require('http');
const url = require('url');
const querystring = require('querystring');
const multiparty = require('multiparty');

const BaseResponse = require('@/common/BaseResponse');
const WebSocket = require('@/webSocket/index');

const handleTryCatch = require('@/utils/handleTryCatch');
const Router = require('@/utils/router');
const { importAll, mkdirPath } = require('@/utils/file');
const { authVerify, getTokenHeader } = require('./utils/auth');

class HttpServer {
  constructor(options) {
    const {
      serverBaseUrl,
      serverPort,
      WHITE_URL,
      fileSavePath,
      deviceTypeMaxMap
    } = options;
    this.whiteList = WHITE_URL;
    this.fileSavePath = fileSavePath;
    this.router = this.registeredRoute(serverBaseUrl);
    this.server = http.createServer((req, res) => this.httpRequest(req, res));
    this.ws = this.createWebSocketServer(deviceTypeMaxMap);
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
  createWebSocketServer(deviceTypeMaxMap) {
    return new WebSocket(this.server, deviceTypeMaxMap);
  }
  httpRequest(req, res) {
    const { method } = req;
    const baseResponse = new BaseResponse(res, req);
    if (method === 'OPTIONS') {
      // 回复OPTIONS
      return baseResponse.success();
    }
    // 请求的地址 path_
    const path_ = baseResponse.path;
    const [fn, bodyType] = this.router.use(method, path_);
    if (!fn) {
      return baseResponse.notFound();
    }
    const tokenInfo = authVerify(req, path_, this.whiteList);
    if (!tokenInfo) {
      return baseResponse.permissionDenied();
    }
    if (tokenInfo.expired) {
      return baseResponse.tokenExpired();
    }
    if (tokenInfo.refresh) {
      const headers = getTokenHeader(tokenInfo);
      Object.keys(headers).forEach(key => res.setHeader(key, headers[key]));
    }
    const requestParams = { baseResponse, tokenInfo, ws: this.ws };
    if (bodyType === 'form') {
      return this.formRequest(fn, requestParams);
    }
    this.otherTypeRequest(fn, requestParams);
  }
  callFn(fn, baseResponse, ...arg) {
    handleTryCatch(fn, ...arg).then(([error]) => {
      error && baseResponse.error(error.message);
    });
  }
  formRequest(fn, requestParams) {
    const { baseResponse } = requestParams;
    const formData = new multiparty.Form({ uploadDir: mkdirPath(this.fileSavePath) });
    formData.parse(baseResponse.req, (error, fields, files) => {
      if (error) {
        return baseResponse.error(error);
      }
      this.callFn(fn, baseResponse, { ...requestParams, fields, files });
    });
  }
  otherTypeRequest(fn, requestParams) {
    const { baseResponse } = requestParams;
    const req = baseResponse.req;
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
      this.callFn(fn, baseResponse, { ...requestParams, paramsData: params, bodyData: data });
    });
  }
}

module.exports = HttpServer;
