import db from 'infrastructure/db';
import {Socket} from 'socket.io';

export const onConnection = (socket: Socket) => {
  const user = db.users.create(socket.handshake.query.username as string);
  socket.broadcast.emit('userJoined', {user});
  console.log(user);
};
