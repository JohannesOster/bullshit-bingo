import {onConnection} from 'application/connectionHandler';
import {Server as HttpServer} from 'http';
import {Server, Socket} from 'socket.io';
import connectRoutes from './socket.routes';

export interface SocketServer {
  socketIOServer: Server;
  socket: Socket;
}

const createSocketServer = (httpServer: HttpServer) => {
  const socketIOServer = new Server(httpServer);
  socketIOServer.on('connection', (socket: Socket) => {
    const server = {socketIOServer, socket};
    onConnection(server);
    connectRoutes(server);
  });
};

export default createSocketServer;
