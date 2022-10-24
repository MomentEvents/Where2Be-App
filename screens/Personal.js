//import React from 'react';
import React, { useState, useEffect, useContext } from 'react';
import { TouchableHighlight , Platform, Text, View, StyleSheet, ScrollView, Button, SafeAreaView, TextInput, FlatList, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient'

import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';
import { McText, McIcon, McAvatar} from '../components'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { Dimensions } from "react-native";
import { AuthContext } from '../AuthContext';
import UsedServer from '../constants/servercontants';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

import * as SplashScreen from 'expo-splash-screen';

// import React from 'react';
// import { Text, View, StyleSheet, Button } from 'react-native';
const Personal = ({ navigation, route }) => {

  const {logoutTok, UserId, Data, setupData, FinImport, MData} = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState(true);
  
  const fetchData = async () => {
    console.log('userId: ', UserId)
    const resp2 = await fetch(UsedServer + `/personal_cal_future`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        UserId: UserId,
      })
    }); 
    const pcal1 = await resp2.json();
    const resp3 = await fetch(UsedServer + `/personal_cal_past`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        UserId: UserId,
      })
    }); 
    const pcal2 = await resp3.json();
    setupData([pcal1, pcal2], 3);
    setLoading(false);
    setRefreshing(false);
  };
  // var ab = 0;
  const handleRefresh = () =>{
    fetchData();
  }

  // useEffect(() => {
  //   fetchData();
  // }, []);
  
  
  const _renderCalendar = ({item, index}) => {
    return (
      <View style={{
        margin: 16
      }}>
        <TouchableHighlight
          onPress={()=>{
            navigation.navigate('EventDetail', {selectedEvent: item});
          }}
          style={{
            borderRadius: 20,
            margin: -8
          }}
        >
      <ImageBackground source={{uri: item.image} }
            resizeMode='cover'
            borderRadius= {SIZES.radius}
            borderColor={COLORS.gray1}
            borderWidth= {0.3}// string not number typeError
            style={{
              width: SIZES.width/1.085,
              height: SIZES.width/1.9 + 10,
              justifyContent: 'space-between',
            }}
            >
            <View style={{
                alignItems: 'flex-end',
                marginHorizontal: 8,
                marginVertical: 8
              }}>
            </View>
            <View>
            <LinearGradient
                  colors = {['transparent', COLORS.black]}
                  start = {{x: 1, y: 0}}
                  end = {{ x: 1, y: 1}}
                  style = {{padding:0, marginBottom: 0.3,marginHorizontal:0.3, borderRadius: 20, height: SIZES.height/6}}>
              <View style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        width: SIZES.width/1.2,
                        position: 'absolute',
                        bottom: 8,
                        left: 12
                      }}>
                        <McText h1 numberOfLines={2}>{item.title}</McText>
                        <View style={{
                          flexDirection: 'row'
                        }}>
                  <McText h3
                    style={{color: COLORS.white, opacity: 0.8,marginTop: 4,letterSpacing: 1.2, marginRight: 4}}>
                    {moment(item.startingTime).format('MMM DD').toUpperCase()}
                </McText>
                <McText h3
                    style={{color: COLORS.purple, opacity: 0.9, marginTop: 4,letterSpacing: 1.2}}>
                    {moment(item.startingTime).format('hh:mm A').toUpperCase()}
                </McText>
                <View style={{
                      flexDirection: 'row',
                      position: 'absolute',
                      right: 0,
                    }}>
                      <McIcon source ={icons.check} size={20} style={{
                          tintColor: item.joined? COLORS.purple: COLORS.lightGray,
                          marginRight: 10,
                        }}/>
                        <McText body7 style={{
                          marginTop: 2,
                          marginLeft: -7,
                          marginRight: 10,
                          color: item.joined? COLORS.purple : COLORS.lightGray
                        }}>{item.num_joins}</McText>
                        <McIcon source ={icons.shoutout} size={20} style={{
                          tintColor: item.shouted? COLORS.purple: COLORS.lightGray,
                          marginRight: 10,
                        }}/>
                        <McText body7 style={{
                          marginTop: 2,
                          marginLeft: -7,
                          marginRight: 10,
                          color: item.shouted? COLORS.purple : COLORS.lightGray
                        }}>{item.num_shouts}</McText>
                    </View></View>
                {/* <TouchableHighlight style={{
                        width: 32,
                        height: 32,
                        borderRadius: 80,
                        marginLeft: 10,
                        backgroundColor: COLORS.input,
                        borderWidth: 1,
                        borderColor: COLORS.white,
                        justifyContent: 'center',
                        alignItems: 'center'
                        }} onPress={()=>{
                  console.log("like " + item.title)
                }}>
                  <McIcon source={icons.like} size={18} style={{
                tintColor:COLORS.white,
              }}/>
              </TouchableHighlight>
              <TouchableHighlight style={{
                        width: 32,
                        height: 32,
                        borderRadius: 80,
                        marginLeft: 10,
                        backgroundColor: COLORS.input,
                        borderWidth: 1,
                        borderColor: COLORS.white,
                        justifyContent: 'center',
                        alignItems: 'center'
                        }} onPress={()=>{
                  console.log("join " + item.title)
                }}>
                  <McIcon source={icons.check} size={20} style={{
                tintColor:COLORS.white,
              }}/>
              </TouchableHighlight>
              <TouchableHighlight style={{
                        width: 32,
                        height: 32,
                        borderRadius: 80,
                        marginLeft: 10,
                        backgroundColor: COLORS.input,
                        borderWidth: 1,
                        borderColor: COLORS.white,
                        justifyContent: 'center',
                        alignItems: 'center'
                        }} onPress={()=>{
                  console.log("shoutout " + item.title)
                }}>
                  <McIcon source={icons.shoutout} size={18} style={{
                tintColor:COLORS.white,
              }}/>
              </TouchableHighlight> */}
                </View>
              </LinearGradient>
              </View>
            </ImageBackground>
            </TouchableHighlight>
      </View>
    )}

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.tempNav}>
      <SectionHeader>
        <View>
          <McText h1>
            <Text>Your Events</Text></McText>
        </View>
      </SectionHeader>
      </View>
      <ButtonBox>
        <TouchableOpacity
          style = {{
            width: width /2.3,
            height: 40,
            backgroundColor: tab ? COLORS.purple : COLORS.gray,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 15,
            marginLeft: 15
          }}
          onPress={() => {
            setTab(true);
          }}
        ><McText body3>Upcoming</McText>
          </TouchableOpacity>
        <TouchableOpacity
        style = {{
          width: width /2.3,
          height: 40,
          backgroundColor: tab ? COLORS.gray: COLORS.purple,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 15,
          marginRight: 15
        }}
          onPress={() => {
            setTab(false);
          }}
          >
            <McText body3>Past</McText>
          </TouchableOpacity>
      </ButtonBox>
      {/* <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}> */}
      { tab?(
          MData[8]? <FlatList
                vertical
                keyExtractor={(item) => 'event_' + item.id}
                //data={dummyData[dataset]}
                data={Object.values(MData[8])}
                renderItem={_renderCalendar}
                refreshing = {refreshing}
                onRefresh = {fetchData}
                initialNumToRender = {4}
                style={{
                  marginTop: 8,
                  marginBottom: -12,
                  marginLeft: 6,
                }}
              />
              :<Text>loadd....</Text>)
              :(MData[9]?<FlatList
              vertical
              keyExtractor={(item) => 'event_' + item.id}
              //data={dummyData[dataset]}
              data={Object.values(MData[9])}
              renderItem={_renderCalendar}
              refreshing = {refreshing}
              onRefresh = {fetchData}
              initialNumToRender = {4}
              style={{
                marginTop: 8,
                marginBottom: -12,
                marginLeft: 6,
              }}
            />
            :<Text>loadd....</Text>)
          }
      <SectionFooter><McText h1 style={{
        //temp fix for padding
        color:'transparent'
      }}>hello</McText></SectionFooter>
      {/* </ScrollView> */}
      </SafeAreaView>
  );
};

const SectionTitle = styled.View`
  margin: 16px ${SIZES.padding};
  marginTop: 20px;
  
`;


const ButtonBox = styled.View`
background-color: transparent;
flex-direction: row;
align-items: center;
margin-top: 10;
justify-content: space-between;
`
const SectionHeader = styled.View`
  background-color: transparent;
  padding: 16px ${SIZES.padding};
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
//temp fix for padding
const SectionFooter = styled.View`
  background-color: transparent;
  padding: 28px;
  justify-content: space-between;
`;
//justify-content: space-between;
const SectionSearch = styled.View`
  margin: 8px ${SIZES.padding};
  height: 50px;
  marginBottom: 12px;
  background-color: ${COLORS.input};
  border-radius: 15px;
  justify-content: center;
`;

const SearchView = styled.View`
flex-direction: row;

align-items: center;
margin-left: 9px;
margin-right: 15px;

`
//background-color: ${COLORS.white};
const Srch = styled.View`
  
  margin-left: 0px;
  width: 100px;
`

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#1E2029',
    backgroundColor: COLORS.black,
  },
  grabox: {
    backgroundColor: 'rgba(100,100,100,0.8)',
    borderRadius: SIZES.radius,
  },
  tempNav: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#282828",
    // borderRadius: 20
  }, org: {
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.gray,
  }, userProfilePic: {
    height: height/11,
    width: height/11,
    borderRadius: 300,
    margin:12,
    marginBottom: 5,
    padding: 30,
    borderWidth: 1,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  }, category: {
    width: width/2.5,
    height: height/15,
    backgroundColor: COLORS.input,
    marginHorizontal: 6,
    marginBottom: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Personal;
