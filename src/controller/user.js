const BaseResponse = require('../common/BaseResponse');
const user = require('../service/user');

const fileRoot = '/user';

module.exports = (router) => {
  router.setRoute('POST', `${fileRoot}/login`, async ({ res, bodyData }) => {
    return BaseResponse.success(res, await user.login(bodyData), '登录成功');
  });

  router.setRoute('POST', `${fileRoot}/userInfo`, async ({ res, tokenInfo }) => {
    return BaseResponse.success(res, await user.getUserInfo(tokenInfo));
  });
};
