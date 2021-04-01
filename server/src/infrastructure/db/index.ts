type User = {username: string; score: number};
type Word = {
  word: string;
  status: string;
  claimedBy?: string;
  checkStatus: number;
};

const users: User[] = [];
const words: Word[] = [
  {word: 'Apfel', status: 'open', checkStatus: 1}, // if no one checks player gets point
  {word: 'Fischlaich', status: 'open', checkStatus: 1},
];

const db = {
  users: {
    create: (username: string) => {
      const user = {username, score: 0};
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
    updateScore: (username: string, operand: number) => {
      users.forEach((user) => {
        if (user.username !== username) return;
        user.score += operand;
        console.log(operand, user.score);
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
    check: (word: string, by: string) => {
      words.forEach((_word) => {
        if (_word.claimedBy !== by || _word.word !== word) return;
        delete _word.claimedBy;
        _word.status = 'check';
      });
    },
    updateCheckStatus: (word: string, operand: number) => {
      words.forEach((_word) => {
        if (_word.word !== word) return;
        _word.checkStatus += operand;
        const value = 1 + -1;
        console.log(operand, _word.checkStatus, value);
      });
    },
    getCheckStatus: (word: string) => {
      const _word = words.find((elem) => elem.word === word);
      return _word?.checkStatus || 0;
    },
  },
};

export default db;
