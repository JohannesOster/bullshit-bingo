import {Server as HttpServer} from 'http';
import {Server, Socket} from 'socket.io';

export interface SocketServer {
  socketIOServer: Server;
  socket: Socket;
}

const createSocketServer = (httpServer: HttpServer): Promise<SocketServer> => {
  const socketIOServer = new Server(httpServer);

  return new Promise((resolve) => {
    socketIOServer.on('connection', (socket: Socket) => {
      resolve({socketIOServer, socket});
    });
  });
};

export default createSocketServer;
