const server = require('./server');
const WebSocket = require('./webSocket/index');

console.log(process.env.NODE_ENV);
const ws = new WebSocket(8081);
server(ws, 8080);
