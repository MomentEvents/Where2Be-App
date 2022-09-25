import React, {useState, useEffect, useCallback} from 'react';
// import { Text, View, StyleSheet } from 'react-native';
import { Text, View, StyleSheet, ScrollView, Image, ImageBackground, Platform, TouchableHighlight, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { McIcon, McText } from '../components';
import { dummyData, FONTS, SIZES, COLORS, icons } from '../constants';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient'

import moment from 'moment';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Dimensions } from "react-native";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


const InterestDetail = ({ navigation, route }) => {

    const [selectedInterest, setSelectedInterest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [like, setLike] = useState(false);
    const [data, setData] = useState([]);
    // const [data2, setData2] = useState([]);
    useEffect(()=>{
        let {selectedInterest} = route.params;
        setSelectedInterest(selectedInterest);
        console.log(selectedInterest);
    },[])

    const handleLike = async () => {
      if (like) {
        // console.log(like);
        setLike(false);
        console.log("HEREEE2: ", like);
        console.log("HEREEE");
        // const resp = await fetch("http://10.0.2.2:8080/delete_like", {
        //   // deleting for true, need to change
        //   method: "POST",
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     uniqueID: selectedEvent?.uniqueID,
        //   }),
        // });
      } else {
        setLike(true);
        console.log("HEREEE2: ", like);
        // const resp = await fetch("http://10.0.2.2:8080/create_like", {
        //   method: "POST",
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     uniqueID: selectedEvent?.uniqueID,
        //   }),
        // });
      }
    };
    
    

    let iD;
    if (selectedInterest !== null){
        console.log('step1');
        iD = selectedInterest;
    } else {
        iD = 'bad';
    }
    
    
    const fetchData = async () => {
        let data;
        if(iD !== 'bad') {
            const resp = await fetch('http://10.0.2.2:8080/interest_events', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: selectedInterest
                    })
            });
                
            data = await resp.json();
        }else{
            data = ['help'];
        }
        console.log(data);
        setData(data);
        setLoading(false);
    }; 
    // console.log(iD)
    //console.log('____________________________________________________________________________');
    
    useEffect(() => {
        fetchData();
    },[iD]);
    //console.log(data);
    //console.log('----------------------------------------------------------------------------');
    // 
    // console.log(get_events(selectedEvent?.userID));
    // 
    //get_events(selectedEvent?.userID);
    
    const _renderItem = ({item, index}) => {
        return (
          <TouchableHighlight
            onPress={() => {
              console.log('Item', item);
              navigation.push('EventDetail', {selectedEvent: item});
            }}
            style={{
              borderRadius: 20,
              marginLeft: 20,
              marginVertical: 8,
            }}
          >
              <ImageBackground source={{uri: item.image}}
                resizeMode='cover'
                borderRadius= {SIZES.radius}
                borderColor={COLORS.gray}
                borderWidth= {0.2}// string not number typeError
                style={{
                  width: SIZES.width/2.5 + 10,
                  height: SIZES.width/1.9 + 10,
                  justifyContent: 'space-between',
                }}
                >
                {/* <GrayBox> */}
                  <View style={{
                    flexDirection: 'column',
                    marginVertical: 8,
                    marginHorizontal: 8,
                    alignItems: 'flex-end'
                  }}>
                    <View style={{ flexDirection:'column'}}>
                  {/* <TouchableHighlight style={{
                    width: 32,
                    height: 32,
                    borderRadius: 80,
                    marginLeft: 10,
                    backgroundColor: COLORS.input,
                    opacity: 0.7,
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
                </TouchableHighlight> */}
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
                    console.log("join " + item.title)
                  }}>
                    <McIcon source={icons.check} size={20} style={{
                  tintColor:COLORS.white,
                }}/>
                </TouchableHighlight> */}
                {/*
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
              </View>
                {/* </GrayBox> */}
                <LinearGradient
                    colors = {['transparent', COLORS.trueBlack]}
                    start = {{x: 1, y: 0}}
                    end = {{ x: 1, y: 1}}
                    style = {{padding:0, marginBottom: 0, borderRadius: 20, height: SIZES.height/8}}>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        width: SIZES.width/2.7,
                        position: 'absolute',
                        bottom: 8,
                        left: 12
                        }}>
                        <McText h3 numberOfLines={2}>{item.title}</McText>
                        <McText body3 style={{
                            marginTop: -2,
                        }}>{moment(item.startingTime).format('MMM DD h:mm A')}</McText>
                    </View>
          </LinearGradient>
            </ImageBackground>
          </TouchableHighlight>
        )
    }
  return (
        <SafeAreaView style={styles.container}>
            <View style={styles.tempNav}>
                <SectionHeader>
        <TouchableOpacity 
                onPress={() =>{
                  navigation.goBack();
                }}
                style={{
                  width: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <McIcon source={icons.back_arrow} style={{
                    tintColor: COLORS.white,
                    marginBottom: 4,
                }} size={20}/>
                </TouchableOpacity>
                    <McText h1 style={{
                        marginLeft: 4,
                    }}>{selectedInterest}</McText>
                    <View style={{
                      position: 'absolute',
                      right: -width*0.4,
                    }}>
              {/* <TouchableOpacity style={{
                      borderRadius: 80,
                      justifyContent: 'center',
                      alignItems: 'center'
                      }}
                      onPress={()=>{
                        console.log("Like")
                        handleLike()
                      }}>
                <McIcon source={like ? icons.likeFill: icons.like} size={24} style={{
              tintColor:like ? COLORS.purple: COLORS.white
            }}/>
            </TouchableOpacity> */}
            </View>
                    </SectionHeader>
                </View>
                        <ScrollView>
                        <FlatList
                            numColumns={2}
                            keyExtractor={(item) => 'event_' + item.id}
                            //data={dummyData[dataset]}
                            data={data}
                            renderItem={_renderItem}
                            onEndReachedThreshold={0.2}
                        ></FlatList>
                        <SectionFooter><McText h1 style={{
                          //temp fix for padding
                          color:'transparent'
                        }}>hello</McText></SectionFooter>
                        </ScrollView>

                    </SafeAreaView>
  );
};

const SectionHeader = styled.View`
  background-color: transparent;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
const SectionImageFooter = styled.View`
  flex: 1;
  justify-content: flex-end;
  position: relative;
  
`;
const FooterContentView = styled.View`
flex-direction: row;
justify-content: space-between;
align-items: center;
margin: 0px 30px;
`;

const SectionFooter = styled.View`
  background-color: transparent;
  padding: 60px;
  justify-content: space-between;
`;

const DateBox = styled.View`
  width: 50;
  height: 50;
  border-radius: 15px;
  border-color: #000000;
  border-width: 1px;
  background-color: ${COLORS.white};
  align-items: center;
`;
const GrayBox = styled.View`
  background-color: rgba(100,100,100,0.8);
  border-radius: ${SIZES.radius};
`;

// const BigBox = styled.View`
//     width: width;
    
// `;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  userProfilePic: {
    height: 100,
    width: 100,
    borderRadius: 300,
    padding: 30,
    borderWidth: 1,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempNav: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#282828",
    flexDirection: 'row',
    marginBottom: 12,
    // borderRadius: 20
  },
  button: {
    marginHorizontal: 8,
    padding: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.input,
    alignItems: 'center',
  },
  EventsHeader: {
    width: width,
    flexDirection: 'row',
    marginTop: 10,
    marginRight: 30,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#282828",
  }
});

export default InterestDetail;