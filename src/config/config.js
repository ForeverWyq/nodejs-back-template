const tokenKey = 'access_token';

module.exports = {
  // mysql配置
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
  tokenKey
};
