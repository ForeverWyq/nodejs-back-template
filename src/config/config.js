const tokenKey = 'access_token';

module.exports = {
  serverBaseUrl: '/serve',
  fileSavePath: './files',
  serverPort: 8080,
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
  tokenKey,
  dbPlusConfig: {
    logicDeleteField: 'is_delete', // 全局逻辑删除的实体字段名(since 3.3.0,配置后可以忽略不配置步骤2)
    logicDeleteValue: 1, // 逻辑已删除值(默认为 1)
    logicNotDeleteValue: 0 // 逻辑未删除值(默认为 0)
  }
};
