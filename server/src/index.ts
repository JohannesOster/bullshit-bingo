import {createServer} from 'http';
import {Server, Socket} from 'socket.io';

const httpServer = createServer();
const socketIOServer = new Server(httpServer);

socketIOServer.on('connection', (socket: Socket) => {
  console.log('new connection');
  socket.emit('event', {msg: 'This is an event from the server.'});
});

httpServer.listen(3000, () => {
  console.log('Listening on localhost:3000');
});
