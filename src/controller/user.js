const BaseResponse = require('../common/BaseResponse');
const user = require('../service/user');
const { tokenAuth, refreshTokenAuth } = require('@/utils/auth');

const fileRoot = '/user';

module.exports = (router) => {
  router.post(`${fileRoot}/login`, async ({ res, bodyData }) => {
    const data = await user.login(bodyData);
    const { id, userAccount, updateTime } = data;
    const tokenData = { id, userAccount, updateTime };
    const token = tokenAuth.createToken(tokenData);
    const refreshToken = refreshTokenAuth.createToken(tokenData);
    return BaseResponse.success(res, data, '登录成功', {
      [tokenAuth.headerKey]: token,
      [refreshTokenAuth.headerKey]: refreshToken,
    });
  });

  router.post(`${fileRoot}/userInfo`, async ({ res, tokenInfo }) => {
    return BaseResponse.success(res, await user.getUserInfo(tokenInfo));
  });
};
