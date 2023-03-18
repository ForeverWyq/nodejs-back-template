const db = require('../db');

async function selectUerInfo({ id }) {
  const sql = 'select * from user where id=?';
  const res = await db.executeSql(sql, [id]);
  return res;
}

module.exports = {
  selectUerInfo
};
