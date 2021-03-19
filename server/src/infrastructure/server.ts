import {createServer as createHTTPServer} from 'http';
import connectRoutes from './sockets/socket.routes';
import {onConnection} from 'application/connectionHandler';
import createSocketServer from './sockets';

const app = createHTTPServer();

createSocketServer(app).then((server) => {
  onConnection(server);
  connectRoutes(server);
});

export default app;
