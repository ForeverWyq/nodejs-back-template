const Router = require('../../utils/router');
const { importAll } = require('../../utils/file');
const files = require.context('./modules/', true, /\.js$/);
const fileMap = importAll(files);

// 路由注册
const router = new Router();
// websocket setRouter方法
function setRouter(path, callback) {
  router.setRoute('WS', path, callback);
}

Object.keys(fileMap).forEach(name => {
  const register = fileMap[name];
  if (typeof register === 'function') {
    register(setRouter);
  }
});

// 对接收到的信息根据自定义的路径进行分发
function distribute(path) {
  return router.use('WS', path);
}

module.exports = distribute;
