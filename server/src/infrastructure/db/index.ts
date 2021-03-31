type User = {username: string};
type Word = {word: string; status: string; claimedBy?: string};

const users: User[] = [];
const words: Word[] = [
  {word: 'Apfel', status: 'open'},
  {word: 'Fischlaich', status: 'open'},
];

const db = {
  users: {
    create: (username: string) => {
      const user = {username};
      users.push(user);
      return user;
    },
    list: () => users,
    del: (username: string) => {
      const idx = users.findIndex((elem) => username === elem.username);
      if (idx === -1) return;
      users.splice(idx, 1);

      words.forEach((word) => {
        if (word.claimedBy !== username) return;
        delete word.claimedBy;
        word.status = 'open';
      });
    },
  },
  words: {
    list: () => words,
    claim: (word: string, by: string) => {
      words.forEach((_word) => {
        if (_word.claimedBy === by) {
          delete _word.claimedBy;
          _word.status = 'open';
          return;
        }

        if (_word.word !== word) return;
        _word.status = 'claimed';
        _word.claimedBy = by;
      });
    },
  },
};

export default db;
