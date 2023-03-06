const config = require(`./config.js`);

module.exports = {
  ...config,
  mysql: {
    host: 'localhost',
    port: '3306',
    user: 'production',
    password: '123456',
    database: 'dbName'
  }
};
