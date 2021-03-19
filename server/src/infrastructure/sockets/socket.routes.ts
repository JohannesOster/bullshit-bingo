import {SocketServer} from '.';
import db from '../db';

const routes = {
  claim: (server, word: string) => {
    db.words.updateStatus(word, 'claim');
    server.socket.broadcast.emit('words', {words: db.words.list()});
  },
} as {[event: string]: (server: SocketServer, ...args: any[]) => void};

const connectRoutes = (server: SocketServer) => {
  Object.entries(routes).forEach(([event, listener]) => {
    server.socket.on(event, (args) => listener(server, args));
  });
};

export default connectRoutes;
