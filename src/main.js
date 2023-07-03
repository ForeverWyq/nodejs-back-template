global.$config = require('@/config');
global.$CONSTANT = require('@/common/CONSTANT');
const server = require('./server');
const WebSocket = require('./webSocket/index');

console.log(process.env.NODE_ENV);
const ws = new WebSocket(global.$config.wsPort);
server(global.$config.serverPort, ws);
