const user = require('@/service/user');

const fileRoot = '/user';

module.exports = (setRoute) => {
  setRoute(`${fileRoot}/init`, ({ socket, wsData, tokenInfo, ws }) => {
    ws.setSocket(socket, tokenInfo.id, wsData.deviceType);
  });

  setRoute(`${fileRoot}/getUserInfo`, async ({ socket, wsData, res }) => {
    const data = await user.getUserInfo(wsData.data);
    return res.success(socket, 'userInfo', data);
  });
};
