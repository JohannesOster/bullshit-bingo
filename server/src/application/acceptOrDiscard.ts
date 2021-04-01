import db from 'infrastructure/db';
import {SocketServer} from 'infrastructure/sockets';

export const accept = (server: SocketServer, word: string) => {
  db.words.updateCheckStatus(word, 1);
};

export const discard = (server: SocketServer, word: string) => {
  console.log('Discard');
  db.words.updateCheckStatus(word, -1);
};
