type User = {username: string};

const users: User[] = [];

const db = {
  users: {
    create: (username: string) => {
      const user = {username};
      users.push(user);
      return user;
    },
  },
};

export default db;
