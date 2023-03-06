const { importAll } = require('../../utils/file');

const files = require.context('./modules/', true, /\.js$/);
const configInterface = importAll(files);

module.exports = configInterface;
