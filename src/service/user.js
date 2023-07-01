const user = require('@/dao/modules/user');

async function getUserInfo(data) {
  const infoData = await user.selectUerInfo(data);
  return infoData;
}

module.exports = {
  getUserInfo
};
