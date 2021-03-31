import db from 'infrastructure/db';
import {SocketServer} from 'infrastructure/sockets';
import {SocketEvent} from 'infrastructure/sockets/events';

export const onConnection = ({socket}: SocketServer) => {
  db.users.create(socket.handshake.query.username as string);
  const users = db.users.list();
  socket.broadcast.emit(SocketEvent.users, {users});
  socket.emit(SocketEvent.words, {words: db.words.list()});
  socket.emit(SocketEvent.users, {users});
};
