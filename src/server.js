const http = require('http');
const url = require('url');
const querystring = require('querystring');
const handleTryCatch = require('@/utils/handleTryCatch');

const Router = require('@/utils/router');
const { importAll } = require('@/utils/file');
const { getToken, checkoutToken } = require('./utils/auth');

const BaseResponse = require('@/common/BaseResponse');
const { WHITE_URL } = global.$CONSTANT;
const files = require.context('./controller/', true, /\.js$/);
const fileMap = importAll(files);

// 路由注册
const router = new Router(global.$config.serverBaseUrl);
Object.keys(fileMap).forEach(name => {
  const register = fileMap[name];
  if (typeof register === 'function') {
    register(router);
  }
});

// 接口白名单，无需token的接口列表
const whiteList = WHITE_URL;
module.exports = (port, ws) => {
  const server = http.createServer((req, res) => {
    const { method } = req;
    if (method === 'OPTIONS') {
      // 回复OPTIONS
      BaseResponse.success(res);
      return;
    }
    // 请求的地址 path_
    const path_ = url.parse(req.url).pathname;
    const token = getToken(req);
    // token合法性拦截
    if (!whiteList.includes(path_) && !checkoutToken(token)) {
      return BaseResponse.permissionDenied(res);
    }

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
      const fn = router.use(req.method, path_);
      if (!fn) {
        BaseResponse.notFound(res, path_, req.method);
        return;
      }
      handleTryCatch(fn, { res, paramsData: params, bodyData: data, ws }).then(([error]) => {
        if (error) {
          BaseResponse.error(res, error);
        }
      });
    });
  });

  server.listen(port, () => {
    console.log('server启动成功, 端口:' + port);
  });
};
