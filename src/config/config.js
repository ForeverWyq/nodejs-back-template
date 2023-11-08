// 接收token的请求头key值
const tokenKey = 'access_token';

module.exports = {
  // 服务前缀路径
  serverBaseUrl: '/serve',
  // 文件保存路径
  fileSavePath: './files',
  // 服务端口
  serverPort: 8080,
  // token私钥
  privateKey: 'nodejs-back-template-private-key',
  // token生效时长，{string | number} 数字单位秒
  expiresIn: '1d',
  // mysql配置: 详见npm mysql介绍
  mysql: {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'dbName'
  },
  // 允许的请求头字段
  AllowHeaders: [
    'Content-Type',
    'Content-Length',
    'Authorization',
    'Accept',
    'X-Requested-With',
    tokenKey
  ],
  // 允许的请求方法
  AllowMethods: [
    'PUT',
    'POST',
    'GET',
    'DELETE',
    'OPTIONS'
  ],
  // 允许的ip * 为允许所有
  AllowOrigin: ['*'],
  tokenKey,
  dbPlusConfig: {
    logicDeleteField: 'is_delete', // 全局逻辑删除的实体字段名(since 3.3.0,配置后可以忽略不配置步骤2)
    logicDeleteValue: 1, // 逻辑已删除值(默认为 1)
    logicNotDeleteValue: 0 // 逻辑未删除值(默认为 0)
  }
};
