const http = require('http');
const url = require('url');
const querystring = require('querystring');
const Router = require('./utils/router');
const { importAll } = require('./utils/file');
const BaseResponse = require('./common/BaseResponse');
// const { WHITEURL } = require('../common/CONSTANT/index');

const files = require.context('./controller/', true, /\.js$/);
const fileMap = importAll(files);

const router = new Router();
Object.keys(fileMap).forEach(name => {
  const register = fileMap[name];
  if (typeof register === 'function') {
    register(router);
  }
});

// 接口白名单，无需token的接口列表
// const whiteList = WHITEURL;
module.exports = function(socketList, port) {
  const server = http.createServer((req, res) => {
    const { method } = req;
    if (method === 'OPTIONS') {
      // 回复OPTIONS
      BaseResponse.success(res);
      return;
    }
    // 请求的地址 path_
    const path_ = url.parse(req.url).pathname;
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
      if (fn) {
        try {
          fn({ res, paramsData: params, bodyData: data, socketList });
        } catch (error) {
          BaseResponse.error(res, error);
        }
      } else {
        BaseResponse.notFound(res, path_, req.method);
      }
    });
  });

  server.listen(port, () => {
    console.log('server启动成功');
  });
};
