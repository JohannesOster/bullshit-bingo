import db from 'infrastructure/db';
import {SocketServer} from 'infrastructure/sockets';

export const onConnection = ({socket}: SocketServer) => {
  const user = db.users.create(socket.handshake.query.username as string);
  socket.broadcast.emit('userJoined', {user});
  socket.emit('words', {words: db.words.list()});
};
