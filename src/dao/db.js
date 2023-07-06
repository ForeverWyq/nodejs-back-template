const mysql = require('mysql');
const Lock = require('../utils/lock');

class DB {
  constructor(conf) {
    this.pool = mysql.createPool(conf);
    this.errNum = 0;
    this.lock = new Lock();
    this.connect();
  }
  connect(callback) {
    if (this.connection) {
      return Promise.resolve(this.connection);
    }
    const lockStatus = this.lock.lock();
    return new Promise((resolve, reject) => {
      if (!lockStatus) {
        this.lock.status.then(() => {
          resolve(this.connection);
        });
      } else {
        this.pool.getConnection((err, connection) => {
          this.lock.unlock();
          if (err) {
            typeof callback === 'function' && callback(err);
            reject(err);
          } else {
            this.connection = connection;
            resolve(connection);
          }
        });
      }
    });
  }
  executeSql(sql, arr) {
    return new Promise((resolve, reject) => {
      this.lock.status.then(() => {
        this.connection.query(sql, arr, async (err, result) => {
          if (err) {
            this.connection.release();
            this.connection.destroy();
            this.connection = null;
            this.connect();
            if (this.errNum > 0) {
              reject(err);
              return;
            }
            this.errNum++;
            resolve(await this.executeSql(sql, arr));
          } else {
            resolve(result);
          }
        });
      });
    });
  }
}

module.exports = new DB(global.$config.mysql);
