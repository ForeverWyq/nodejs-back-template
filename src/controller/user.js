const BaseResponse = require('../common/BaseResponse');
const user = require('../service/user');

const fileRoot = '/user';

module.exports = (router) => {
  router.setRoute('POST', `${fileRoot}/login`, async ({ res, bodyData }) => {
    const data = await user.login(bodyData);
    return BaseResponse.success(res, data, '登录成功');
  });

  router.setRoute('POST', `${fileRoot}/userInfo`, getUserInfo);
  async function getUserInfo({ res, bodyData }) {
    const data = await user.getUserInfo(bodyData);
    return BaseResponse.success(res, data);
  }
};
