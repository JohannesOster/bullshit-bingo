import {onConnection} from 'application/connectionHandler';
import {createServer} from 'http';
import {Server, Socket} from 'socket.io';
import connectRoutes from './socket.routes';

const httpServer = createServer();

const socketIOServer = new Server(httpServer);

socketIOServer.on('connection', (socket: Socket) => {
  onConnection(socket);
  connectRoutes(socket);
});

export default httpServer;
