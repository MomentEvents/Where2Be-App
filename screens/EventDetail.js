/**
 * React Native Event Booking App UI - Event Detail Screnn
 * -> The screen can be seperated 4 sections and 1 fixed bottom bar
 * 

 */
import React, {useState, useEffect, useCallback} from 'react';
import { Modal, Image, Linking, Text, View, StyleSheet, ScrollView, ImageBackground, Platform, TouchableOpacity } from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';
import { VERTICAL } from 'react-native/Libraries/Components/ScrollView/ScrollViewContext';
import styled from 'styled-components/native';
import { McIcon, McText } from '../components';
import { LinearGradient } from 'expo-linear-gradient'
import { dummyData, FONTS, SIZES, COLORS, icons } from '../constants';
import moment from 'moment';
import MapView, { PROVIDER_GOOGLE} from 'react-native-maps'
import { createNavigatorFactory } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer';


import {memo} from "react"

import { Dimensions } from "react-native";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


const EventDetail = ({ navigation, route }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore,setLengthMore] = useState(false); //to show the "Read more & Less Line"
  
  const toggleNumberOfLines = () => { //To toggle the show text or hide it
      setTextShown(!textShown);
  }
  
  const [like, setLike] = useState(false);
  const [join, setJoin] = useState(false);
  const [shoutout, setShoutout] = useState(false);

  const handleLike = async () => {
    if (like) {
      // console.log(like);
      setLike(false);
      console.log("HEREEE2: ", like);
      console.log("HEREEE");
      const resp = await fetch("http://3.136.67.161:8080/delete_like", {
        // deleting for true, need to change
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqueID: selectedEvent?.uniqueID,
        }),
      });
    } else {
      setLike(true);
      console.log("HEREEE2: ", like);
      const resp = await fetch("http://3.136.67.161:8080/create_like", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqueID: selectedEvent?.uniqueID,
        }),
      });
    }
  };
  

  const handleJoin = async () => {
    if (join) {
      // console.log(shoutout);
      setJoin(false);
      console.log("HEREEE2: ", join);
      console.log("HEREEE");
      const resp = await fetch("http://3.136.67.161:8080/delete_join", {
        // deleting for true, need to change
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqueID: selectedEvent?.uniqueID,
        }),
      });
    } else {
      setJoin(true);
      console.log("HEREEE2: ", join);
      const resp = await fetch("http://3.136.67.161:8080/create_join", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqueID: selectedEvent?.uniqueID,
        }),
      });
    }
  };
  

  const handleShoutout = async () => {
    if (shoutout) {
      // console.log(shoutout);
      setShoutout(false);
      console.log("HEREEE2: ", shoutout);
      console.log("HEREEE");
      const resp = await fetch("http://3.136.67.161:8080/delete_shoutOut", {
        // deleting for true, need to change
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqueID: selectedEvent?.uniqueID,
        }),
      });
    } else {
      setShoutout(true);
      console.log("HEREEE2: ", shoutout);
      const resp = await fetch("http://3.136.67.161:8080/create_shoutOut", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqueID: selectedEvent?.uniqueID,
        }),
      });
    }
  };
  // console.log(selectedEvent)

  const  [joindedEvent, setJoindedEvent] = useState(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true);
  // console.log(joindedEvent)
  
  const onTextLayout = useCallback(e =>{
      setLengthMore(e.nativeEvent.lines.length > 2); //to check the text is more than 4 lines or not
      // console.log(e.nativeEvent);
  },[]);
      
  useEffect(()=>{
    let {selectedEvent} = route.params;
    setSelectedEvent(selectedEvent);
  },[])

  let iD;
    if (selectedEvent?.userID !== undefined){
        iD = selectedEvent?.userID;
    } else {
        iD = 'bad';
    }

  const fetchData = async () => {
        let data;
        console.log('id:' + iD)
        if(iD !== 'bad') {
            const resp = await fetch('http://3.136.67.161:8080/organization_details', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: iD
                    })
            });
            data = await resp.json();
        }
        else{
            data = ['help'];
        }
        setData(data);
        console.log(data);
        setLoading(false);
    };
    // console.log(iD)
    //console.log('____________________________________________________________________________');
    useEffect(() => {
        fetchData();
    },[iD]);
  return (
    <View style={styles.container}>
       <LinearGradient
          colors = {[ COLORS.black,COLORS.trueBlack,'#003060']}
          start = {{x: 0, y: 0}}
          end = {{ x: 1, y: 1}}
          style = {{padding:2, borderRadius: 20 }}>
      <ScrollView 
      contentContainerStyle={{
        backgroundColor: 'transparent'
      }}
      style={{
        backgroundColor: 'transparent',
        //temp fix for padding
        paddingBottom: 300,
      }}
      >
        {/*ImageBackground*/}
        
        <ImageBackground
          resizeMode='cover'
          source={{uri:selectedEvent?.image}}
          style = {{
            width: '100%',
            height: 
              SIZES.height < 700? SIZES.height * 0.4 : SIZES.height * 0.5,
          }}
        >
          
          <View style={{flex: 1}}>
            {/* Image Header*/}
            <SectionImageHeader>
              <TouchableOpacity 
                onPress={() =>{
                  navigation.goBack();
                }}
                style={{
                  width: 56,
                  height: 40,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 13,
                  marginLeft: -20,
                }}>
                <McIcon source={icons.back_arrow} style={{
                  tintColor: COLORS.white,
                  marginLeft: 8,
                }} size={24}/>
              </TouchableOpacity>

              <TouchableOpacity
              onPress={() =>{
                navigation.push('ImageScreen', {img: selectedEvent?.image})
              }}
              style={{
                  height: 40,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 13,
                  marginRight: -16,
                }} >
                <McText body3 style={{
                  marginHorizontal: 8,
                }}>View Image</McText>
              </TouchableOpacity>
             
            </SectionImageHeader>
            {/* Image Footer*/}
            <SectionImageFooter>
              <LinearGradient
                colors = {['transparent','#000']}
                start = {{x: 0, y: 0}}
                end = {{ x: 0, y: 1}}
                style = {{
                  width: '100%',
                  height: 120,
                  justifyContent: 'flex-end',

                }}
              >
                
                <FooterContentView>
                  <View>
                    <McText body4 style={{opacity: 0.5, letterSpacing: 2 }}>
                      {selectedEvent?.type}
                      </McText>
                    <McText h1 numberOfLines={2} style={{width: width * 0.7}}>{selectedEvent?.title}</McText>
                    <McText body4 style={{opacity: 0.5, letterSpacing: 1.5 }}>
                      STARTING {moment(selectedEvent?.startingTime).format('hh:mm A')}
                    </McText>

                  </View>
                  <View style={{
                    paddingTop:12
                  }}>
                  <LinearGradient
                    colors = {['#902070', '#DD77EB', '#a2d2ff']}
                    start = {{x: -0.1, y: 1}}
                    end = {{ x: 1, y: 1}}
                    style = {{
                      width: 60, 
                      height: 60,
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    
                    <McText body4 style={{letterSpacing: 1}}>
                      {moment(selectedEvent?.startingTime)
                        .format('MMM')
                        .toUpperCase()
                      }
                    </McText>
                    <McText h2 style={{}}>
                      {moment(selectedEvent?.startingTime)
                        .format('DD')
                      }
                    </McText>
                  </LinearGradient>
                  </View>
                </FooterContentView>
                
              </LinearGradient>
            </SectionImageFooter>
          </View>
        </ImageBackground>
        {/* buttons group section */}
        
        <ButtonSection>
          <ScrollView horizontal = {true} showsHorizontalScrollIndicator={false}>
            {
              selectedEvent?.taglist.map((taglist)=> 
                <TouchableOpacity
                  style={{
                  width: taglist.length *8 + 15,
                  height: 32,
                  borderRadius: 10,
                  marginRight: 10,
                  backgroundColor: COLORS.input,
                  justifyContent: 'center',
                  alignItems: 'center'
                  }} 
                  onPress={()=>{
                    navigation.push('InterestDetail', {selectedInterest: taglist})
                  }}
                >
                  <McText h6 style={{opacity: 0.5, letterSpacing: 1}}>{taglist}</McText>
                </TouchableOpacity>
              )
            }
          </ScrollView>
        </ButtonSection>
        <OwnerSection>
          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }} onPress={()=>{
                navigation.push('OrganizationDetail', {OrgID: selectedEvent?.userID})
                console.log(selectedEvent)
                console.log('lololololol')
              }}>
          <Image
                style={styles.orgProfilePic}
                source={{
                    uri:data.image
                }}/>
            <McText h4 numberOfLines={1} style={{
              letterSpacing: 1,
              textTransform: 'uppercase',
              width: width/1.25
              }}>
                {data.name}
            </McText>
            </TouchableOpacity>
        </OwnerSection>
        <DescriptionSection>
          <View style={{
                  marginLeft: 12,
                  marginBottom: 4,
                  marginTop: 4,
                  marginRight: 12,
                  // backgroundColor: COLORS.black
                }}>
            <McText 
              onTextLayout={onTextLayout}
              numberOfLines={textShown ? undefined : 3} body3>
                {selectedEvent?.description}
            </McText>
              {
                  lengthMore ? <McText
                  onPress={toggleNumberOfLines}
                  style={{ lineHeight: 22, marginTop: 10, opacity: 0.6}}>
                    {textShown ? 'Read less...' : 'Read more...'}</McText>
                  :null
              }
          </View>
        </DescriptionSection>
        <LocationSection>
        <McIcon source ={icons.location} size={20} style={{
              margin:4,
              tintColor:COLORS.gray,
            }}/>
            <TouchableOpacity onPress={()=>{
                var uri = selectedEvent?.location
                Linking
                .openURL(uri)
                .catch(err => console.log('Error', err));
                }}>
              <McText h4 style={{
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginTop: -1, 
                width: width * 0.83,
                }}
                numberOfLines={1}>
                  {selectedEvent?.location}
              </McText>
              </TouchableOpacity>
          </LocationSection>
          {/* <LinkSection>
        <McIcon source ={icons.links} size={20} style={{
              margin:4,
              tintColor:COLORS.gray,
            }}/>
            <TouchableOpacity onPress={()=>{
                var uri = selectedEvent?.link
                Linking
                .openURL(uri)
                .catch(err => console.log('Error', err));
                }}>
              <McText h4 style={{
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginTop: -1, 
                width: width * 0.83,
                }}
                numberOfLines={1}>
                  {selectedEvent?.link}
              </McText>
              </TouchableOpacity>
          </LinkSection> */}
        <VisibilitySec>
        <McIcon source ={icons.visibility} size={16} style={{
              margin:8,
              tintColor: COLORS.gray1
            }}/>
        <View>
          <McText body5 numberOfLines={1} style={{
              opacity: 0.8,
              letterSpacing: 1,
              textTransform: 'uppercase' 
              }}>
                {selectedEvent?.visibility} EVENT
            </McText>
          </View>
        </VisibilitySec>
        <SectionFooter><McText h1 style={{
        //temp fix for padding
        color:'transparent'
      }}>hello</McText></SectionFooter>
        
      </ScrollView>
        {/* <View style={styles.otherContainer}>
          <UserOptionsSection>
          <View style={{
              alignItems: 'center'
            }}>
              <TouchableOpacity style={{
                      width: 60,
                      height: 60,
                      borderRadius: 80,
                      backgroundColor:like ? '#a00000':  'transparent',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: COLORS.gray,
                      alignItems: 'center'
                      }}
                      onPress={()=>{
                        console.log("Like")
                        handleLike()
                      }}>
                <McIcon source={like ? icons.likeFill: icons.like} size={32} style={{
              tintColor:like ? COLORS.white: COLORS.gray,
            }}/>
            
            </TouchableOpacity>
              <McText body3>Like</McText>
            </View>
            <View style={{
              alignItems: 'center'
            }}>
            <TouchableOpacity style={{
                      width: 60,
                      height: 60,
                      borderRadius: 80,
                      marginHorizontal: 30,
                      backgroundColor:join ? '#006099': 'transparent' ,
                      borderWidth: 1,
                      borderColor: COLORS.gray,
                      justifyContent: 'center',
                      alignItems: 'center'
                      }} onPress={()=>{
                          join ? setJoin(false) : setJoin(true)
                          console.log("Join button clicked")
                          handleJoin()
                          // console.log(selectedEvent)
                        
              }}>
                <McIcon source={icons.check} size={32} style={{
              tintColor:join ? COLORS.white: COLORS.gray,
              marginHorizontal: 44
            }}/>
            </TouchableOpacity>
              <McText body3>Join</McText>
            </View>
            <View style={{
              alignItems: 'center'
            }}>
            <TouchableOpacity style={{
                      width: 60,
                      height: 60,
                      borderRadius: 80,
                      borderWidth: 1,
                      borderColor: COLORS.gray,
                      backgroundColor: shoutout ? '#651070' : 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center'
                      }} onPress={()=>{
                        console.log("ShoutOut");
                        console.log("HEREEE: ", shoutout);
                        handleShoutout();
                      }}>
                <McIcon source={icons.shoutout}
                  size={32}
                  style={{
                    tintColor: shoutout ? COLORS.white : COLORS.gray,
                  }}/>
            </TouchableOpacity>
            <McText body3>ShoutOut</McText>
            </View>
          </UserOptionsSection>
        </View> */}
      </LinearGradient>
    </View>
  );
};

const SectionImageHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${Platform.OS === 'ios'?'40px':'20px'};
  margin-left: 30px;
  margin-right: 30px;
  
`;
const SectionImageFooter = styled.View`
  flex: 1;
  justify-content: flex-end;
  position: relative;
  width: ${width};
  
`;
// position: relative;
//   z-index: -1;

const FooterContentView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0px 30px;
`;

const ButtonSection = styled.View`
  margin: 15px 15px 10px;
  flex-direction: row;
`;

const DescriptionSection = styled.View`
  margin-left: 10px;
  margin-right: 10px;
  background-color: ${COLORS.input};
  borderRadius: 10;
  opacity: 0.8;
`;

const UserOptionsSection = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  `;

//temp fix for padding
const SectionFooter = styled.View`
  background-color: transparent;
  padding: 40px;
  justify-content: space-between;
`;

const LocationSection = styled.View`
  flex-direction: row;
  marginHorizontal: 16px;
  marginTop: 8px;
  borderRadius: 10;
  align-items: center;
`;

const LinkSection = styled.View`
  flex-direction: row;
  marginHorizontal: 16px;
  marginTop: 4px;
  borderRadius: 10;
  align-items: center;
`;


const OwnerSection = styled.View`
  flex-direction: row;
  marginHorizontal: 16px;
  marginBottom: 12px;
  borderRadius: 10;
  align-items: center;
`;
const VisibilitySec = styled.View`
  flex-direction: row;
  marginBottom: 8px;
  marginHorizontal: 16px;
  borderRadius: 10;
  align-items: center;
`;
/*
const BottomBarSection = styled.View`
  height: 80px;
  width: ${SIZES.width+'px'};
  border-radius: ${SIZES.radius};
  background-color: ${COLORS.tabBar};
  position: absolute;
  bottom: 0px;
  justify-content: center;
`;
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  otherContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 1,
    width: width,
    marginBottom: -1,
    marginTop: 1,
    height: height/7.9,
    paddingTop: 2,
    justifyContent: 'center',
    backgroundColor: COLORS.input,
    opacity: 0.97,
    alignSelf: 'stretch'
  },
  orgProfilePic: {
    height: 35,
    width: 35,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(EventDetail);
