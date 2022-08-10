import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient'
import { 
    SectionList,
    TouchableOpacity, 
    Text, 
    View, 
    StyleSheet, 
    SafeAreaView, 
    TextInput, 
    FlatList, 
    ImageBackground, 
    TouchableWithoutFeedback,
    DevSettings,
    Image,
 } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {Platform} from "react-native";


import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';
import events from '../constants/events.json'
import { McText, McIcon, McAvatar} from '../components'
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from "react-native";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

 //datas = events
 const Mine = ({ navigation }) => {
  

  const imageUri = "https://img.buzzfeed.com/buzzfeed-static/static/2022-04/12/19/asset/b96d474ef097/sub-buzz-418-1649792177-24.png" //+ "=s"+ (SIZES.width).toString()+ "-c"
  const dataset = [
    {images: ["https://img.buzzfeed.com/buzzfeed-static/static/2022-04/12/19/asset/b96d474ef097/sub-buzz-418-1649792177-24.png"
    , "https://img.buzzfeed.com/buzzfeed-static/static/2022-04/12/19/asset/b96d474ef097/sub-buzz-418-1649792177-24.png"
    , "https://img.buzzfeed.com/buzzfeed-static/static/2022-04/12/19/asset/b96d474ef097/sub-buzz-418-1649792177-24.png"
    , "https://img.buzzfeed.com/buzzfeed-static/static/2022-04/12/19/asset/b96d474ef097/sub-buzz-418-1649792177-24.png"]}
  ]
  return (
    <View style={styles.container}>
      <LinearGradient
                colors = {['#252525', COLORS.black, COLORS.black,'#652070']}
                start = {{x: 0, y: 0}}
                end = {{ x: 1, y: 1}}
                style = {{padding:2, borderRadius: 20 }}>
     <SafeAreaView style={{
      height: height,
      width: width
     }}>
      

        <SectionHeader>
          <TouchableWithoutFeedback onPress={()=>{
               {console.log("Add Friends")}
              }}>
          <McIcon source={icons.friend_add} style={{
            margin: 24,
            tintColor: COLORS.white
          }}
          size={28}/>
          </TouchableWithoutFeedback>
          <View style={{
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <McText h3> Me</McText>
          <McText h4 style={{
            color: COLORS.gray,
            margin: 6,
          }}>username</McText>
          </View>
          <TouchableWithoutFeedback onPress={()=>{
               navigation.navigate('Login')
              }}>
          {/* <McIcon source={icons.settings} style={{
            margin: 24,
            tintColor: COLORS.white
          }}
          size={28}/> */}
          <McText body3 style={{
            marginRight: 16,
          }}>Log Out</McText>
          </TouchableWithoutFeedback>
        </SectionHeader>
        <SectionProfilePic>
          <Image
          style={styles.userProfilePic}
          source={{
            uri:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
          }}>
          </Image>
        </SectionProfilePic>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <SectionButton>
        <TouchableOpacity onPress={()=>{
               {console.log("Profiledit")}
              }}>
          <McText h4 style={{
            letterSpacing: 2,
            margin: 8,
            marginHorizontal: 16,
          }}>EDIT PROFILE</McText>
          </TouchableOpacity>
        </SectionButton>
        <SectionOtherButton><TouchableOpacity onPress={()=>{
               navigation.navigate('Interests')
              }}>
          <McText h4 style={{
            letterSpacing: 2,
            margin: 8,
            marginHorizontal: 16,
          }}>INTERESTS</McText>
          </TouchableOpacity></SectionOtherButton>
        </View>
        

        <SectionImages>
        <McText h2 style={{
          paddingLeft: 20,
        }}>My Moments</McText>
        <ScrollView>
          <View>
          <FlatList data={dataset['images']}
          numColumns={3}
          columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, marginTop: 1, marginHorizontal: -25 }}
          style={{
            paddingLeft:26,
            paddingRight:8,
            backgroundColor: COLORS.white,
        }}
          renderItem={({item, index})=> {
            <Image style={styles.userProfilePic}
            source={{uri: item}}/>
          }}
          keyExtractor={(item) => `basicListEntry-${item}`}
          >
            <Image
              style={styles.userProfilePic}
              source={{
                uri:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
              }}/>
          </FlatList>
          </View>
        </ScrollView>
        </SectionImages>
        
     </SafeAreaView>
     </LinearGradient>
     </View>
   );
 };
 const SectionHeader = styled.View`
 flex-direction: row;
 justify-content: space-between;
 align-items: center;
 margin-top: ${Platform.OS === 'ios'?'20px':'10px'};
 width: 100%
`;
const SectionName = styled.View`
  margin: 8px;
  height: 50px;
  width: ${width};
  justify-content: center;
  align-items: center;
`;

const SectionButton = styled.View`
  margin-horizontal: 10;
  flex-direction: row;
  justify-content: center;
  border-radius: 20;
  background-color: ${COLORS.input};
  align-items: center;

`
const SectionOtherButton = styled.View`
  margin-horizontal: 10;
  flex-direction: row;
  justify-content: center;
  border-radius: 20;
  background-color: ${COLORS.input};
  align-items: center;

`


const SectionImages = styled.View`
  margin: 12px;
  width: ${width};
  justify-content: center;
  align-items: flex-start;
`

const SectionProfilePic = styled.View`
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


const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: COLORS.black,
  }, 
  userProfilePic: {
    height: 120,
    width: 120,
    borderRadius: 300,
    padding: 30,
    margin: 24,
    borderWidth: 1,
    borderColor: COLORS.gray,
  }
});
 
 export default Mine;
 