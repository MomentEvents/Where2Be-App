//import React from 'react';
import React, { useState, useEffect } from 'react';
import { Platform, Text, View,Image, StyleSheet, ScrollView, Button, SafeAreaView, TextInput, FlatList, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient'
//import { BlurView } from '@react-native-community/blur';

import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';
import { McText, McIcon, McAvatar} from '../components'
import { TouchableOpacity } from 'react-native-gesture-handler';

const Tickets = ({ params }) => {
  const imageUri = "https://img.buzzfeed.com/buzzfeed-static/static/2022-04/12/19/asset/b96d474ef097/sub-buzz-418-1649792177-24.png" //+ "=s"+ (SIZES.width).toString()+ "-c"
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style = {styles.tempNav}>
        {/* <Text style={{ color: '#fff', fontSize: 30 }}>Here</Text> */}
        <McText h1>Explore page</McText>
      </View>
      
      <View style = {styles.userBar}>
        <View style = {{flexDirection: "row", alignItems: "center"}}>
          <Image 
            style={styles.userPic}
            source={{
              uri:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
              }}/>
          {/* <Text style={{ color: '#000', fontSize: 20, marginLeft:30}}>UserAbc with UserXYZ</Text> */}
          <McText style={{ color: '#000', marginLeft:30}} h3>UserAbc with UserXYZ</McText>
        </View>
        <View style = {{position: "absolute"}}>
          <Image 
            style={styles.userPic2}
            source={{
              uri:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
              }}/>
        </View>
        <View>
          <Text style={{fontSize:30}}>...</Text>
        </View>
      </View>

      <View>
        <Image 
        style={{ width:SIZES.width, height: SIZES.width*1.1}}
        source={{
          uri: imageUri
          }}/>
      </View>
      <View style = {styles.functionalBar}>
      {/* <Text style={{ color: '#000', fontSize: 20, marginLeft:30}}>Some Basketball Game</Text> */}
      <McText style={{ color: '#000', marginLeft:30}} h3>Some Basketball Game</McText>
      <McText style={{ color: '#000', marginLeft:30}} body3>Some nba stadium</McText>
      {/* <Text style={{ color: '#000', fontSize: 20, marginLeft:30}}>Some Basketball Game</Text> */}
        <McIcon 
          source={icons.like} 
          size={24}  
          style={{
            color:COLORS.blue,
            marginLeft: 16, 
            // tinycolor: "#000",
          }}
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 100+"%",
    height: 100+"%",
    backgroundColor: '#000',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  tempNav: {
    width: 100+"%", 
    height:60,
    backgroundColor: "rgb(10,10,10)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgb(233,233,233)",
    justifyContent: "center",
    alignItems: "center"
    // borderRadius: 20
  },
  userBar : {
    marginTop: 20,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    width: 100+"%",
    height:60,
    backgroundColor:"#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20
  },
  functionalBar : {
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    width: 100+"%",
    // height:60,
    padding:15,
    backgroundColor:"#fff",
    flexDirection: "column",
    // justifyContent: "space-between",
    paddingHorizontal: 20,
    // alignItems:"center"
  },
  userPic: {
    height:40,
    width:40,
    borderRadius: 20,
    // marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#000"
  },
  userPic2: {
    height:40,
    width:40,
    borderRadius: 20,
    // marginHorizontal: 10,
    marginLeft: 45,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#000"
  }
});

export default Tickets;