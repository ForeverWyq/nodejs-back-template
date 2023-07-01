const { tokenKey } = global.$config;

// 创建token
function createToken(userInfo) {
  const token = 'XXXXXXXX';
  // 自行实现生成逻辑
  return token;
};

/**
 * 获取token
 * @param {request} req 请求的request
 * @returns token
 */
function getToken(req) {
  return req.headers[tokenKey];
}

// token合法性校验
function checkoutToken(token) {
  if (!token) {
    return false;
  }
  // 自行实现校验逻辑
  return true;
}

module.exports = {
  createToken,
  getToken,
  checkoutToken
};
