const mysql = require('mysql');
const config = require('../config/index');
const Lock = require('../utils/lock');

class DB {
  constructor(conf) {
    this.pool = mysql.createPool(conf);
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
        this.connection.query(sql, arr, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });
  }
}

module.exports = new DB(config.mysql);
