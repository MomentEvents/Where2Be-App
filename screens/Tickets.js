//import React from 'react';
import React, { useState, useEffect } from 'react';
import { Image, Platform, Text, View, StyleSheet, ScrollView, Button, SafeAreaView, TextInput, FlatList, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur';

import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';
import { McText, McIcon, McAvatar} from '../components'
import { TouchableOpacity } from 'react-native-gesture-handler';


const Tickets = ({ params }) => {
  const imageUri = "https://img.buzzfeed.com/buzzfeed-static/static/2022-04/12/19/asset/b96d474ef097/sub-buzz-418-1649792177-24.png" //+ "=s"+ (SIZES.width).toString()+ "-c"
  return (
    <View style={styles.container}>
      <LinearGradient
      colors = {['#252525', COLORS.black, COLORS.black,'#205070']}
      start = {{x: 0, y: 0}}
      end = {{ x: 1, y: 1}}
      style = {{padding:2, borderRadius: 20 }}>
    <SafeAreaView>
      
      <SectionHeader>
        {/* <Text style={{ color: '#fff', fontSize: 30 }}>Here</Text> */}
        <McText h1>Explore Feed</McText>
        <TouchableWithoutFeedback
        onPress={()=>{
          navigation.navigate('Interests')
        }}>
          <McIcon source ={icons.tab_4} size={28}/>
        </TouchableWithoutFeedback>
      </SectionHeader>
      <ScrollView>
      <View style = {styles.userBar}>
        <View style = {{flexDirection: "row", alignItems: "center"}}>
          <Image 
            style={styles.userPic}
            source={{
              uri:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
              }}/>
          {/* <Text style={{ color: '#000', fontSize: 20, marginLeft:30}}>UserAbc with UserXYZ</Text> */}
          <McText style={{ color: '#fff', marginLeft:30}} h3>UserAbc with UserXYZ</McText>
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
      <McText style={{ color: '#fff', marginLeft:30}} h3>Some Basketball Game</McText>
      <McText style={{ color: '#fff', marginLeft:30}} body3>Some nba stadium</McText>
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
      <View style = {styles.userBar}>
        <View style = {{flexDirection: "row", alignItems: "center"}}>
          <Image 
            style={styles.userPic}
            source={{
              uri:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
              }}/>
          {/* <Text style={{ color: '#000', fontSize: 20, marginLeft:30}}>UserAbc with UserXYZ</Text> */}
          <McText style={{ color: '#fff', marginLeft:30}} h3>UserAbc with UserXYZ</McText>
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
      <McText style={{ color: '#fff', marginLeft:30}} h3>Some Basketball Game</McText>
      <McText style={{ color: '#fff', marginLeft:30}} body3>Some nba stadium</McText>
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
      <View style = {styles.userBar}>
        <View style = {{flexDirection: "row", alignItems: "center"}}>
          <Image 
            style={styles.userPic}
            source={{
              uri:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
              }}/>
          {/* <Text style={{ color: '#000', fontSize: 20, marginLeft:30}}>UserAbc with UserXYZ</Text> */}
          <McText style={{ color: '#fff', marginLeft:30}} h3>UserAbc with UserXYZ</McText>
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
      <McText style={{ color: '#fff', marginLeft:30}} h3>Some Basketball Game</McText>
      <McText style={{ color: '#fff', marginLeft:30}} body3>Some nba stadium</McText>
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
    </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: 100+"%",
    // height: 100+"%",
    backgroundColor: 'transparent',
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
    marginTop: 16,
    // borderTopLeftRadius:20,
    // borderTopRightRadius:20,
    width: 100+"%",
    height:68,
    opacity: 0.7,
    backgroundColor:COLORS.input,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20
  },
  functionalBar : {
    // borderBottomLeftRadius:20,
    // borderBottomRightRadius:20,
    width: 100+"%",
    // height:60,
    padding:10,
    opacity: 0.7,
    backgroundColor: COLORS.input,
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
    borderColor: "#fff"
  },
  userPic2: {
    height:40,
    width:40,
    borderRadius: 20,
    // marginHorizontal: 10,
    marginLeft: 45,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#fff"
  }
});

const SectionHeader = styled.View`
  background-color: transparent;
  padding: 16px ${SIZES.padding};
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

export default Tickets;