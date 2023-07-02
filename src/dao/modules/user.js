const db = require('../db');
const DBPlus = require('../DBPlus');
const table = require('../table/user');

const userTable = new DBPlus(db, table);

async function selectUerInfo({ id }) {
  const [userInfo] = await userTable.select({ id });
  return userInfo;
}

module.exports = {
  selectUerInfo
};
