import React, {useEffect, useState} from 'react';
import {Platform, SafeAreaView, StatusBar, Text} from 'react-native';
import socketIOClient from 'socket.io-client';

const App = () => {
  const [users, setUsers] = useState([] as any[]);

  useEffect(() => {
    console.log('rerender');

    const username = Platform.select({ios: 'Appleboy', android: 'Googleboy'});

    const socket = socketIOClient('http://192.168.8.133:3000', {
      secure: true,
      transports: ['websocket'],
      jsonp: false,
      query: {username},
    });
    socket.on('error', (err: any) => {
      console.debug('SOCKET: errors ', err);
    });
    socket.on('connect_error', (err: any) => {
      console.debug('SOCKET: connect_error ---> ', err);
    });

    socket.on('userJoined', ({user}: any) => {
      console.log('new user joined', user);
      setUsers(users => [...users, user]);
    });
  }, []);

  return (
    <SafeAreaView>
      <StatusBar />
      <Text>asdf</Text>
      <Text>{Platform.select({ios: 'Appleboy', android: 'Googleboy'})}</Text>
      {users.map((user, idx) => {
        return (
          <Text key={idx}>
            {idx}
            {user.username}
          </Text>
        );
      })}
    </SafeAreaView>
  );
};

export default App;
