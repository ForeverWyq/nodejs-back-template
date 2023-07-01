const { serverBaseUrl } = global.$config;
const WHITE_URL = ['/user/login'];
module.exports = WHITE_URL.map(url => `${serverBaseUrl}${url}`);
