const jwt = require('jsonwebtoken');

class TokenGenerator {
  constructor(secretOrPrivateKey, secretOrPublicKey, options = {}) {
    this.secretOrPrivateKey = secretOrPrivateKey;
    this.secretOrPublicKey = secretOrPublicKey;
    this.options = options; // algorithm + keyid + noTimestamp + expiresIn + notBefore
  }
  sign(payload, signOptions = {}) {
    const jwtSignOptions = {...signOptions, ...this.options};
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }
  // refreshOptions.verify = 与验证功能一起使用的选项
  // refreshOptions.jwtid = 包含新令牌的id
  refresh(token, refreshOptions) {
    const payload = jwt.verify(token, this.secretOrPublicKey, refreshOptions.verify);
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti; // 生成一个新的令牌，如果您在签名期间使用jwtid，请在refreshOptions中传递它
    // 第一次签名将所有需要的选项转换为声明，它们已经在有效载荷中
    return jwt.sign(payload, this.secretOrPrivateKey, {
      ...this.options,
      jwtid: refreshOptions.jwtid
    });
  }
  verify(token) {
    const payload = jwt.verify(token, this.secretOrPublicKey);
    return payload;
  }
}

module.exports = TokenGenerator;
