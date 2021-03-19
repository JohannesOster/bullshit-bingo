import {createServer as createHTTPServer} from 'http';
import createSocketServer from './sockets';

const server = createHTTPServer();
createSocketServer(server);

export default server;
