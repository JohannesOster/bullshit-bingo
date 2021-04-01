import React, {useEffect, useState} from 'react';
import {Text, SafeAreaView} from 'react-native';
import socketIOClient from 'socket.io-client';
import {Button, Container, List, ListItem, View} from 'native-base';

export const Room = ({route, navigation}) => {
  const [users, setUsers] = useState([] as any[]);
  const [words, setWords] = useState([] as any[]);
  const [socket, setSocket] = useState(null as any);
  const {username} = route.params;
  const [claimedWord, setClaimedWord] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

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
      setShowToast(word);
      setTimeout(() => {
        setShowToast(null);
        // emit not checkd
      }, 3000);
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
          {users
            .sort((a, b) => (a.score > b.score ? -1 : 1))
            .map((user, idx) => {
              return (
                <ListItem key={idx}>
                  <Text>
                    {user.username} {user.username === username && '(Ich)'} -{' '}
                    {user.score}
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
                      : 'transparent',
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
      {showToast && (
        <View style={{padding: 12}}>
          <Text>HeyHow - ich hab '{showToast}' gesagt!</Text>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: 12,
            }}>
            <Button
              success
              style={{padding: 12}}
              onPress={() => {
                socket.emit('accept', showToast);
                setShowToast(null);
              }}>
              <Text>Jawoll</Text>
            </Button>
            <Button
              danger
              style={{padding: 12}}
              onPress={() => {
                socket.emit('discard', showToast);
                setShowToast(null);
              }}>
              <Text>Ne haste nich</Text>
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
