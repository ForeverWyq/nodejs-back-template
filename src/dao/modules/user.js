const db = require('../db');
const DBPlus = require('../DBPlus');
const table = require('../table/user');

class User extends DBPlus {
  constructor() {
    super(db, table);
  }
}

module.exports = new User();
