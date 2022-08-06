import React, { useState, useEffect } from 'react';
import { Text, DateBox, View, StyleSheet, SafeAreaView, TextInput, FlatList, ImageBackground, TouchableWithoutFeedback, Image } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';

import events from '../constants/events.json'
import { McText, McIcon, McAvatar} from '../components'
import Fuse from 'fuse.js'

async function userlogin(username, pass) {
  await fetch('http://localhost:3000/user_login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: pass
    })
  });
  return userdata = await resp.json();
  //return userdata
}

async function createuser(username, pass, name) {
  await fetch('http://localhost:3000/create_user', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: pass,
      name: name
    })
  });
  
  return userdata = await resp.json();
  //return userdata
}

 //datas = events
  const Login = ({ navigation, route }) => {
  const [name, setname] = useState('');
  const [username, setusernm] = useState('');
  const [password, setpass] = useState('');

   return (
     <SafeAreaView style={styles.container}>
      <SectionSearch>
          <TextInput
            placeholder='Name'
            placeholderTextColor={COLORS.gray1}
            onChangeText={newText => setname(newText)}
            defaultValue={name}
            style={{
              ...FONTS.h4,
              color: COLORS.white,
              marginLeft: 12
            }}
          ></TextInput>
      </SectionSearch>
      <SectionSearch>
          <TextInput
            placeholder='Username'
            placeholderTextColor={COLORS.gray1}
            onChangeText={newText => setusernm(newText)}
            defaultValue={username}
            style={{
              ...FONTS.h4,
              color: COLORS.white,
              marginLeft: 12
            }}
          ></TextInput>
      </SectionSearch>
      <SectionSearch>
          <TextInput
            placeholder='Password'
            placeholderTextColor={COLORS.gray1}
            onChangeText={newText => setpass(newText)}
            defaultValue={password}
            secureTextEntry = {true}
            style={{
              ...FONTS.h4,
              color: COLORS.white,
              marginLeft: 12
            }}
          ></TextInput>
      </SectionSearch>
      <SectionButton>
      <TouchableWithoutFeedback onPress={()=>{
        console.log("logging in")
        console.log(userlogin(username, password))
        //navigation.navigate('Interests')
      }}>
        <McText h4> Log In</McText>
      </TouchableWithoutFeedback>
      </SectionButton>
      <SectionButton>
      <TouchableWithoutFeedback onPress={()=>{
        console.log("creating account")
        console.log(createuser(username, password, name))
        //navigation.navigate('Interests')
      }}>
        <McText h4> Create Account</McText>
      </TouchableWithoutFeedback>
      </SectionButton>
     </SafeAreaView>
   );
 };
 const SectionHeader = styled.View`
 flex-direction: row;
 justify-content: flex-start;
 margin-top: ${Platform.OS === 'ios'?'40px':'20px'};
 width: 100%
`;
const SectionSearch = styled.View`
  margin: 4px;
  height: 50px;
  width: 65%;
  background-color: ${COLORS.input};
  border-radius: 15px;
  justify-content: center;
`;

const SectionButton = styled.View`
  ;
  margin-top: 10px;
  height: 50px;
  width: 65%;
  background-color: ${COLORS.input};
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`;
const SearchView = styled.View`
flex-direction: row;
justify-content: center;
align-items: center;
margin-left: 9px;
margin-right: 9px;
`;

const SrchRes = styled.View`
flex-direction: row;
align-items: center;
height: 40px;
`

const TxtBox = styled.View`

`

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
 
 export default Login;
 