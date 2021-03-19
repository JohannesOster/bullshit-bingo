import {Socket} from 'socket.io';
import db from './db';

const routes = {
  claim: (socket, word: string) => {
    db.words.updateStatus(word, 'claim');
    socket.broadcast.emit('words', {words: db.words.list()});
  },
} as {[event: string]: (socket: Socket, ...args: any[]) => void};

const connectRoutes = (socket: Socket) => {
  Object.entries(routes).forEach(([event, listener]) => {
    socket.on(event, (args) => listener(socket, args));
  });
};

export default connectRoutes;
