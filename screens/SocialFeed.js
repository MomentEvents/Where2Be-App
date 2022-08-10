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


const SocialFeed = ({ params }) => {
  
  const imageUri = "https://img.buzzfeed.com/buzzfeed-static/static/2022-04/12/19/asset/b96d474ef097/sub-buzz-418-1649792177-24.png" //+ "=s"+ (SIZES.width).toString()+ "-c"
  return (
    <View style={styles.container}>
      <LinearGradient
      colors = {['#252525', COLORS.black,'#350840', COLORS.black,'#006790']}
      start = {{x: 0, y: 0}}
      end = {{ x: 1, y: 1}}
      style = {{padding:2}}>
    <SafeAreaView>
    <View style={styles.tempNav}>
      <SectionHeader>
        {/* <Text style={{ color: '#fff', fontSize: 30 }}>Here</Text> */}
        <McText h1>Explore Feed</McText>
        <TouchableWithoutFeedback
        onPress={()=>{
          navigation.navigate('Interests')
        }}>
          <McIcon source ={icons.tab_4} size={28} style={{
            tintColor: COLORS.gray
          }}/>
        </TouchableWithoutFeedback>
      </SectionHeader>
      </View>
      <ScrollView>
      <View>
      <View style = {styles.userBar}>
        <View style = {{flexDirection: "row", alignItems: "center"}}>
          <Image 
            style={styles.userPic}
            source={{
              uri:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
              }}/>
          {/* <Text style={{ color: '#000', fontSize: 20, marginLeft:30}}>UserAbc with UserXYZ</Text> */}
          <McText style={{ color: '#fff', marginLeft:30}} h3>Bob with Alice</McText>
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
        <View style={styles.funcBarText}>
          <McText style={{ color: '#fff'}} h3>Event</McText>
          <McText style={{ color: '#fff'}} body3>Location</McText>
        </View>
        <View style={{
          flexDirection: 'column',
          paddingTop: 20,
        }}>
        <McIcon 
          source={icons.like} 
          size={24}  
          style={{
            tintColor: COLORS.white,
            marginLeft: 16, 
            // tinycolor: "#000",
          }}
        />
        </View>
      </View>
      </View>
      <View style={{
        paddingBottom:200
      }}>
      <View style = {styles.userBar}>
        <View style = {{flexDirection: "row", alignItems: "center"}}>
          <Image 
            style={styles.userPic}
            source={{
              uri:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
              }}/>
          {/* <Text style={{ color: '#000', fontSize: 20, marginLeft:30}}>UserAbc with UserXYZ</Text> */}
          <McText style={{ color: '#fff', marginLeft:30}} h3>Bob with Alice</McText>
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
        <View style={styles.funcBarText}>
          <McText style={{ color: '#fff'}} h3>Event</McText>
          <McText style={{ color: '#fff'}} body3>Location</McText>
        </View>
        <View style={{
          flexDirection: 'column',
          paddingTop: 20,
        }}>
        <McIcon 
          source={icons.like} 
          size={24}  
          style={{
            tintColor: COLORS.white,
            marginLeft: 16, 
            // tinycolor: "#000",
          }}
        />
        </View>
      </View>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#282828",
    // borderRadius: 20
  },
  userBar : {
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
  funcBarText: {
    flexDirection: 'column',
    marginVertical: 8,
  },
  functionalBar : {
    marginBottom: 16,
    // borderBottomLeftRadius:20,
    // borderBottomRightRadius:20,
    width: 100+"%",
    // height:60,
    padding:10,
    opacity: 0.7,
    backgroundColor: COLORS.input,
    flexDirection: "row",
    justifyContent: "space-between",
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
    marginTop: 15,
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

export default SocialFeed;