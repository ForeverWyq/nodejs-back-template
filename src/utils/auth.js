const TokenGenerator = require('./TokenGenerator');
const { tokenKey, privateKey, expiresIn } = global.$config;

const tokenGenerator = new TokenGenerator(privateKey, privateKey, { expiresIn })

// 创建token
function createToken(userInfo) {
  return tokenGenerator.sign(userInfo, { audience: 'myaud', issuer: 'ziqi', subject: 'user' });
};

function refreshToken(token) {
  return tokenGenerator.refresh(token, { verify: { audience: 'myaud', issuer: 'ziqi' } })
}

/**
 * 获取token
 * @param {request} req 请求的request
 * @returns token
 */
function getToken(req) {
  return req.headers[tokenKey];
}

// token合法性校验
function verifyToken(token) {
  if (!token) {
    return null;
  }
  try {
    return tokenGenerator.verify(token);
  } catch(err) {
    return null;
  }
}

module.exports = {
  createToken,
  refreshToken,
  getToken,
  verifyToken
};
