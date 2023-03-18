const BaseResponse = require('../common/BaseResponse');
const user = require('../service/user');

const fileRoot = '/user';

module.exports = (router) => {
  router.setRoute('POST', `${fileRoot}/userInfo`, getUserInfo);
  async function getUserInfo({ res, bodyData }) {
    const data = await user.getUserInfo(bodyData);
    return BaseResponse.success(res, data);
  }
};
