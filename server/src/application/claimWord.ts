import db from 'infrastructure/db';
import {SocketServer} from 'infrastructure/sockets';
import {SocketEvent} from 'infrastructure/sockets/events';

export const claim = (server: SocketServer, word: string) => {
  db.words.updateStatus(word, 'claim');
  server.socket.broadcast.emit(SocketEvent.words, {words: db.words.list()});
};
