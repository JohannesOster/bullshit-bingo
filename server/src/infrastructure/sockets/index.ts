import {onConnection} from 'application/connectionHandler';
import {Server as HttpServer} from 'http';
import db from 'infrastructure/db';
import {Server, Socket} from 'socket.io';
import {SocketEvent} from './events';
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

    socket.on('disconnect', () => {
      db.users.del(socket.handshake.query.username as string);
      socket.broadcast.emit(SocketEvent.users, {users: db.users.list()});
    });
  });
};

export default createSocketServer;
