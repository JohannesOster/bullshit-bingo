type User = {username: string};
type Word = {word: string; status: string};

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
  },
  words: {
    list: () => words,
    updateStatus: (word: string, status: string) =>
      words.forEach((_word) => {
        if (_word.word !== word) return;
        _word.status = status;
      }),
  },
};

export default db;
