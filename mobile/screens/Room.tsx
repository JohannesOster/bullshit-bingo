import React, {useEffect, useState} from 'react';
import {Text, SafeAreaView, Alert} from 'react-native';
import socketIOClient from 'socket.io-client';
import {Button, Container, List, ListItem} from 'native-base';

export const Room = ({route, navigation}) => {
  const [users, setUsers] = useState([] as any[]);
  const [words, setWords] = useState([] as any[]);
  const [socket, setSocket] = useState(null as any);
  const {username} = route.params;
  const [claimedWord, setClaimedWord] = useState<string | null>(null);

  useEffect(() => {
    if (!claimedWord) {
      navigation.setOptions({
        headerRight: () => {},
      });
    } else {
      navigation.setOptions({
        headerRight: () => (
          <Button
            onPress={() => socket.emit('check', claimedWord)}
            transparent
            hasText
            style={{marginHorizontal: 15}}>
            <Text>Gesagt!</Text>
          </Button>
        ),
      });
    }
  }, [claimedWord, navigation, socket]);

  useEffect(() => {
    const s = socketIOClient('http://192.168.8.133:3000', {
      secure: true,
      transports: ['websocket'],
      jsonp: false,
      query: {username},
    });

    setSocket(s);

    s.on('error', (err: any) => {
      console.debug('SOCKET: errors ', err);
    });

    s.on('connect_error', (err: any) => {
      console.debug('SOCKET: connect_error ---> ', err);
    });

    s.on('users', ({users}: {users: string[]}) => {
      setUsers(users);
    });

    s.on('words', ({words}: any) => {
      setWords(words);
    });

    s.on('check', ({word}: any) => {
      Alert.alert('Alert Title', 'My Alert Msg', [
        {
          text: 'Nein',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Ja', onPress: () => console.log('OK Pressed')},
      ]);
    });

    return () => {
      s.close();
    };
  }, [username]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Container>
        <List>
          <ListItem itemDivider>
            <Text>Benutzer</Text>
          </ListItem>
          {users.map((user, idx) => {
            return (
              <ListItem>
                <Text key={idx}>
                  {user.username} {user.username === username && '(Ich)'}
                </Text>
              </ListItem>
            );
          })}
          <ListItem itemDivider>
            <Text>Worte</Text>
          </ListItem>
          {words.map(({word, status, claimedBy}, idx) => {
            return (
              <ListItem
                key={idx}
                onPress={() => {
                  if (status === 'claimed') {
                    if (claimedBy !== username) return;
                    socket.emit('claim', word);
                    setClaimedWord(null);
                    return;
                  }
                  socket.emit('claim', word);
                  setClaimedWord(word);
                }}
                style={{
                  backgroundColor:
                    status === 'claimed'
                      ? claimedBy === username
                        ? 'green'
                        : 'yellow'
                      : 'blue',
                }}
                noIndent>
                <Text>
                  {word} - status: {status}
                </Text>
              </ListItem>
            );
          })}
        </List>
      </Container>
    </SafeAreaView>
  );
};
