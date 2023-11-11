const TokenGenerator = require('./TokenGenerator');
const { tokenConf, refreshTokenConf } = global.$config;

class Auth {
  constructor(options) {
    const { key, headerKey, ...tokenOptions } = options;
    this.tokenKey = key;
    this.headerKey = headerKey;
    this.tokenGenerator = new TokenGenerator(tokenOptions);
  }
  /**
   * 获取token
   * @param {req | string} req 请求头或者token
   * @returns {string}
   */
  getToken(req) {
    if (typeof req === 'object') {
      return req.headers[this.tokenKey];
    }
    return req;
  }
  createToken(tokenInfo = {}) {
    if (_.isEmpty(tokenInfo)) {
      throw new Error('用户信息错误');
    }
    return this.tokenGenerator.sign(tokenInfo);
  }
  /**
   * token校验
   * @param {string | payload} token token或token解析结果
   * @returns {string | null}
   */
  refreshToken(token) {
    try {
      return this.tokenGenerator.refresh(token);
    } catch (error) {
      return null;
    }
  }
  /**
   * token校验
   * @param {req | string} token 请求头或者token
   * @returns {null | object}
   */
  verifyToken(token) {
    const tokenstr = this.getToken(token);
    if (!tokenstr) {
      return null;
    }
    try {
      return this.tokenGenerator.verify(tokenstr);
    } catch(err) {
      return null;
    }
  }
}

const tokenAuth = new Auth(tokenConf);
const refreshTokenAuth = new Auth(refreshTokenConf);

module.exports = {
  tokenAuth,
  refreshTokenAuth
};
