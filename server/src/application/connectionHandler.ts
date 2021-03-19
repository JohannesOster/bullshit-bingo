import db from 'infrastructure/db';
import {SocketServer} from 'infrastructure/sockets';
import {SocketEvent} from 'infrastructure/sockets/events';

export const onConnection = ({socket}: SocketServer) => {
  const user = db.users.create(socket.handshake.query.username as string);
  socket.broadcast.emit(SocketEvent.userJoined, {user});
  socket.emit(SocketEvent.words, {words: db.words.list()});
};
