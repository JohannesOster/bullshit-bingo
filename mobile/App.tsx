import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import socketIOClient from 'socket.io-client';

const App = () => {
  const socket = socketIOClient('http://localhost:3000');
  socket.on('event', console.log);

  return (
    <SafeAreaView>
      <StatusBar />
    </SafeAreaView>
  );
};

export default App;
