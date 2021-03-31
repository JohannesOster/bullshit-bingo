import React, {useState} from 'react';
import {
  Input,
  Button,
  Text,
  Label,
  Item,
  Form,
  Container,
  Content,
} from 'native-base';

export const Auth = ({navigation}) => {
  const [username, setUsername] = useState<string>('');

  return (
    <Container>
      <Content padder>
        <Form>
          <Item floatingLabel style={{marginBottom: 20}}>
            <Label>Benutzername</Label>
            <Input onChangeText={setUsername} />
          </Item>

          <Button
            onPress={() => {
              navigation.navigate('Room', {username});
            }}>
            <Text>Beitreten</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
};
