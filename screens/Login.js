import React, { useState, useEffect } from 'react';
import {Platform, Text, DateBox, View, StyleSheet, SafeAreaView, TextInput, FlatList, ImageBackground, TouchableWithoutFeedback, Image } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';

import events from '../constants/events.json'
import { McText, McIcon, McAvatar} from '../components'
import Fuse from 'fuse.js'
import { Dimensions } from "react-native";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


 //datas = events
 const Login = ({ navigation, route }) => {
   return (
    <View style={styles.container}>
     <SafeAreaView style={{height:height, width:width}}>
      <SectionLogin>
        <View style={{
          flex: 1,
          height: height/10,
          backgroundColor: COLORS.input,
          borderRadius: 20,
          justifyContent: 'center',
        }}>
          <TextInput
            placeholder='Username'
            placeholderTextColor={COLORS.gray1}
            //onChange={handleOnSearch}
            style={{
              ...FONTS.h4,
              color: COLORS.white,
              marginLeft: 12
            }}
          />
        </View>
      <TouchableWithoutFeedback onPress={()=>{
        console.log("Chirag's an idiot")
        navigation.navigate('Interests')
      }}>
        <McText h4> Log In</McText>
      </TouchableWithoutFeedback>
      </SectionLogin>
      
     </SafeAreaView>
     </View>
   );
 };
 const SectionHeader = styled.View`
 flex-direction: row;
 justify-content: flex-start;
 margin-top: ${Platform.OS === 'ios'?'40px':'20px'};
 width: 100%
`;
const SectionLogin = styled.View`
  flex: 1
  margin: 8px;
  height: 50px;
  background-color: ${COLORS.input};
  border-radius: 15px;
  justify-content: center;
`;

const SectionButton = styled.View`
  margin-bottom: 80px;
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
    width: width,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
 
 export default Login;
 