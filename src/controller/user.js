const user = require('../service/user');
const { tokenAuth, refreshTokenAuth } = require('@/utils/auth');

const fileRoot = '/user';

module.exports = (router) => {
  router.post(`${fileRoot}/login`, async ({ baseResponse, bodyData }) => {
    const data = await user.login(bodyData);
    const { id, userAccount, updateTime } = data;
    const tokenData = { id, userAccount, updateTime };
    const token = tokenAuth.createToken(tokenData);
    const refreshToken = refreshTokenAuth.createToken(tokenData);
    return baseResponse.success(data, '登录成功', {
      [tokenAuth.headerKey]: token,
      [refreshTokenAuth.headerKey]: refreshToken,
    });
  });

  router.get(`${fileRoot}/current`, async ({ baseResponse, tokenInfo }) => {
    return baseResponse.success(await user.getUserInfo(tokenInfo));
  });
};
