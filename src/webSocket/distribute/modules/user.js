const user = require('@/service/user');

const fileRoot = '/user';

module.exports = (setRoute) => {
  setRoute(`${fileRoot}/getUserInfo`, getUserInfo);
  async function getUserInfo({ socket, wsData, res }) {
    const data = await user.getUserInfo(wsData.data);
    return res.success(socket, 'userInfo', data);
  }
};
