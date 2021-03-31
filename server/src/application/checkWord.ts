import db from 'infrastructure/db';
import {SocketServer} from 'infrastructure/sockets';
import {SocketEvent} from 'infrastructure/sockets/events';

export const check = (server: SocketServer, word: string) => {
  db.words.check(word, server.socket.handshake.query.username as string);
  server.socketIOServer.emit(SocketEvent.check, {word});
};
