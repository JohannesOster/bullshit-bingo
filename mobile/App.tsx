import React, {useEffect, useState} from 'react';
import {Platform, StatusBar, Text, SafeAreaView} from 'react-native';
import socketIOClient from 'socket.io-client';
import {Button, Container, Content, Grid, Row} from 'native-base';

const App = () => {
  const [users, setUsers] = useState([] as any[]);
  const [words, setWords] = useState([] as any[]);
  const [socket, setSocket] = useState(null as any);

  const username = Platform.select({ios: 'Appleboy', android: 'Googleboy'});

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

    s.on('userJoined', ({user}: any) => {
      console.log('new user joined', user);
      setUsers(users => [...users, user]);
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
        <Text>
          Hey my username is:{' '}
          {Platform.select({ios: 'Appleboy', android: 'Googleboy'})}
        </Text>
        {users.map((user, idx) => {
          return <Text key={idx}>{user.username} joined.</Text>;
        })}
        {words.map(({word, status, claimedBy}, idx) => {
          return (
            <Button
              key={idx}
              onPress={() => {
                socket.emit('claim', word);
              }}
              primary={status !== 'claimed'}
              info={claimedBy === username}
              light={status === 'claimed' && claimedBy !== username}
              disabled={status === 'claimed' && claimedBy !== username}>
              <Text>
                {word} - status: {status}
              </Text>
            </Button>
          );
        })}

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

export default App;
