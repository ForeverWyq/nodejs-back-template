global.$config = require('@/config');
global.$CONSTANT = require('@/common/CONSTANT');
global.$redis = require('@/utils/redis');
const HttpServer = require('./server');
const { WHITE_URL } = global.$CONSTANT;

console.log(process.env.NODE_ENV);

new HttpServer({ WHITE_URL, ...global.$config });
