import React, {useEffect, useState} from 'react';
import {StatusBar, Text, SafeAreaView} from 'react-native';
import socketIOClient from 'socket.io-client';
import {
  Button,
  Container,
  Content,
  Grid,
  List,
  ListItem,
  Row,
} from 'native-base';

export const Room = ({route}) => {
  const [users, setUsers] = useState([] as any[]);
  const [words, setWords] = useState([] as any[]);
  const [socket, setSocket] = useState(null as any);

  const {username} = route.params;

  useEffect(() => {
    console.log('rerender');

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
      console.log(words);
      setWords(words);
    });

    return () => {
      s.close();
    };
  }, [username]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Container>
        <StatusBar />
        <List>
          <ListItem itemDivider>
            <Text>Benutzer</Text>
          </ListItem>
          <ListItem>
            <Text>{username} (Ich)</Text>
          </ListItem>
          {users.map((user, idx) => {
            return (
              <ListItem>
                <Text key={idx}>{user.username} joined.</Text>
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
                  if (status === 'claimed' && claimedBy !== 'username') return;
                  socket.emit('claim', word);
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

        <Content style={{marginTop: 200}}>
          <Grid>
            <Row>
              <Button primary style={{marginBottom: 20}}>
                <Text>Open for claim</Text>
              </Button>
            </Row>
            <Row>
              <Button info style={{marginBottom: 20}}>
                <Text>Claimed by you</Text>
              </Button>
            </Row>
            <Row>
              <Button light disabled>
                <Text>Claim by someone else</Text>
              </Button>
            </Row>
          </Grid>
        </Content>
      </Container>
    </SafeAreaView>
  );
};
