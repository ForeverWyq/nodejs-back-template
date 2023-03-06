const server = require('./server');
const WebSocket = require('./webSocket/index');

const socketList = [];

console.log(process.env.NODE_ENV);
server(socketList, 8080);
new WebSocket(socketList, 8081);
