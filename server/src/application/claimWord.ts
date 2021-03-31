import db from 'infrastructure/db';
import {SocketServer} from 'infrastructure/sockets';
import {SocketEvent} from 'infrastructure/sockets/events';

export const claim = (server: SocketServer, word: string) => {
  db.words.claim(word, server.socket.handshake.query.username as string);
  server.socketIOServer.emit(SocketEvent.words, {words: db.words.list()});
};
