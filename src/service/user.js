const user = require('../dao/modules/user');

async function getUserInfo() {
  const infoData = await user.selectUerInfo();
  return infoData;
}

module.exports = {
  getUserInfo
};
