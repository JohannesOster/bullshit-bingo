import {claim} from 'application/claimWord';
import {check} from 'application/checkWord';
import {SocketServer} from '.';

type Route = (server: SocketServer, ...args: any[]) => void;
const routes = {claim, check} as {[event: string]: Route};

const connectRoutes = (server: SocketServer) => {
  Object.entries(routes).forEach(([event, listener]) => {
    server.socket.on(event, (args) => listener(server, args));
  });
};

export default connectRoutes;
