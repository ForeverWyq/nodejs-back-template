class Router {
  constructor(contextRoot) {
    this.contextRoot = contextRoot || '';
    this.pathMap = new Map([]);
  }
  /**
   * 添加路由
   * @param {string} method 请求类型
   * @param {string} path 请求路径
   * @param {Function} callback 访问该路由时调用的函数
   */
  setRoute(method, path, callback) {
    const fullPath = `${this.contextRoot}${path}`;
    if (!this.pathMap.has(method)) {
      this.pathMap.set(method, {
        [fullPath]: callback
      });
    } else {
      this.pathMap.get(method)[fullPath] = callback;
    }
  }
  /**
   * 获取路径对应函数
   * @param {string} method 请求类型
   * @param {string} path 请求路径
   * @returns {Function | undefined} 之前添加的函数
   */
  use(method, path) {
    const fn = this.pathMap.has(method) ? this.pathMap.get(method)[decodeURI(path)] : void 0;
    return fn;
  }
}

module.exports = Router;
