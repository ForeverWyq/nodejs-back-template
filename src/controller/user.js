const BaseResponse = require('../common/BaseResponse');
const user = require('../service/user');

const fileRoot = '/user';

module.exports = (router) => {
  router.setRoute(`${fileRoot}/userInfo`, getUerInfo);
  async function getUerInfo({ res }) {
    const data = await user.getUerInfo();
    return BaseResponse.success(res, data);
  }
};
