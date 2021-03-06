import db from 'infrastructure/db';
import {SocketServer} from 'infrastructure/sockets';
import {SocketEvent} from 'infrastructure/sockets/events';

export const check = (server: SocketServer, word: string) => {
  const username = server.socket.handshake.query.username as string;
  db.words.check(word, username);
  server.socket.broadcast.emit(SocketEvent.check, {word});
  setTimeout(() => {
    const status = db.words.getCheckStatus(word);
    db.users.updateScore(username, status > 0 ? 1 : -1);
    db.words.setOpen(word);
    server.socketIOServer.emit(SocketEvent.users, {users: db.users.list()});
    server.socketIOServer.emit(SocketEvent.words, {
      words: db.words.list(),
    });
  }, 3500);
};
