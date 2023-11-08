const user = require('@/dao/modules/user');
const { createToken } = require('@/utils/auth');

function getSafeUserData(userInfo) {
  const params = { ...userInfo };
  delete params.userPassword;
  return params;
}

async function login({ userAccount, password }) {
  if (!password || !userAccount) {
    throw new Error('用户名或者密码错误');
  }
  const [infoData] = await user.select({
    userAccount, userPassword: password
  });
  if (!infoData) {
    throw new Error('用户名或者密码错误');
  }
  const safeData = getSafeUserData(infoData);
  return {
    info: safeData,
    token: createToken(safeData)
  }
}

async function getUserInfo({ id }) {
  const infoData = await user.select({ id });
  return getSafeUserData(infoData);
}

module.exports = {
  login,
  getUserInfo
};
