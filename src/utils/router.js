class Router {
  constructor() {
    this.pathMap = {};
  }
  /**
   * 添加路由
   * @param {string} method 请求类型
   * @param {string} path 请求路径
   * @param {Function} callback 访问该路由时调用的函数
   */
  setRoute(method, path, callback) {
    if (!this.pathMap[method]) {
      this.pathMap[method] = {
        [path]: callback
      };
    } else {
      this.pathMap[method][path] = callback;
    }
  }
  /**
   * 获取路径对应函数
   * @param {string} method 请求类型
   * @param {string} path 请求路径
   * @returns {Function | null} 之前添加的函数
   */
  use(method, path) {
    const fn = this.pathMap[method] ? this.pathMap[method][decodeURI(path)] : null;
    return fn;
  }
}

module.exports = Router;
