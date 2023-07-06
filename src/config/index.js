const globalConfig = require(`./config.js`);
const config = require(`./config.${process.env.NODE_ENV}.js`);

module.exports = { ...globalConfig, ...config };
