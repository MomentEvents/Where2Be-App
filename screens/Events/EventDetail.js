/**
 * React Native Event Booking App UI - Event Detail Screnn
 * -> The screen can be seperated 4 sections and 1 fixed bottom bar
 * 

 */
import React, {useState, useEffect, useCallback, useContext} from 'react';
import { Modal, Image, Linking, Text, View, StyleSheet, ScrollView, ImageBackground, Platform, TouchableOpacity } from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';
import { VERTICAL } from 'react-native/Libraries/Components/ScrollView/ScrollViewContext';
import styled from 'styled-components/native';
import { McIcon, McText } from '../../components';
import { LinearGradient } from 'expo-linear-gradient'
import { dummyData, FONTS, SIZES, COLORS, icons } from '../../constants';
import moment from 'moment';
import MapView, { PROVIDER_GOOGLE} from 'react-native-maps'
import { createNavigatorFactory } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer';
import { AuthContext } from '../../Contexts/AuthContext';


import {memo} from "react"

import { Dimensions } from "react-native";
import UsedServer from '../../constants/servercontants';
import EditEvent from './EditEvent';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


const EventDetail = ({ navigation, route }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore,setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const {UserId, updateData} = useContext(AuthContext)
  
  const toggleNumberOfLines = () => { //To toggle the show text or hide it
      setTextShown(!textShown);
  }
  
  const [like, setLike] = useState(false);
  const [join, setJoin] = useState(false);
  const [shoutout, setShoutout] = useState(false);

  // const handleLike = async () => {
  //   if (like) {
  //     // console.log(like);
  //     setLike(false);
  //     console.log("HEREEE2: ", like);
  //     console.log("HEREEE");
  //     const resp = await fetch("http://10.0.2.2:8080/delete_like", {
  //       // deleting for true, need to change
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         uniqueID: selectedEvent?.uniqueID,
  //         UserId: UserId,
  //       }),
  //     });
  //   } else {
  //     setLike(true);
  //     console.log("HEREEE2: ", like);
  //     const resp = await fetch("http://10.0.2.2:8080/create_like", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         uniqueID: selectedEvent?.uniqueID,
  //         UserId: UserId,
  //       }),
  //     });
  //   }
  // };
  
  
  const handleJoin = async () => {
    let selEvent = selectedEvent;
    if (join) {
      // console.log(shoutout);
      setJoin(false);
      selEvent.joined = 0;
      selEvent.num_joins = selEvent.num_joins - 1;
      console.log('start 0');
      // updateData(selEvent);
      // setSelectedEvent(selEvent);
      console.log("HEREEE2: ", join);
      const resp = await fetch(UsedServer + "/delete_join", {
        // deleting for true, need to change
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqueID: selectedEvent?.uniqueID,
          UserId: UserId,
        }),
      });
      
    } else {
      setJoin(true);
      selEvent.joined = 1;
      selEvent.num_joins = selEvent.num_joins + 1;
      console.log('start 0');
      
      console.log("HEREEE2: ", join);
      const resp = await fetch(UsedServer + "/create_join", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqueID: selectedEvent?.uniqueID,
          UserId:UserId,
        }),
      });
      
    }
    updateData(selEvent);
    setSelectedEvent(selEvent);
    
  };
  

  const handleShoutout = async () => {
    let selEvent = selectedEvent;
    if (shoutout) {
      // console.log(shoutout);
      setShoutout(false);
      console.log("HEREEE2: ", shoutout);
      console.log("HEREEE");
      const resp = await fetch(UsedServer + "/delete_shoutOut", {
        // deleting for true, need to change
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqueID: selectedEvent?.uniqueID,
          UserId: UserId,
        }),
      });
      selEvent.shouted = 0;
      selEvent.num_shouts = selEvent.num_shouts - 1;
    } else {
      setShoutout(true);
      console.log("HEREEE2: ", shoutout);
      const resp = await fetch(UsedServer + "/create_shoutOut", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqueID: selectedEvent?.uniqueID,
          UserId: UserId,
        }),
      });
      selEvent.shouted = 1;
      selEvent.num_shouts = selEvent.num_shouts + 1;
    }
    setSelectedEvent(selEvent);
    updateData(selEvent);
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
    // console.log(selectedEvent);
    setSelectedEvent(selectedEvent);
    if(selectedEvent.joined == 1){
      setJoin(true);
    }
    if(selectedEvent.shouted == 1){
      setShoutout(true);
    }
    // if(selectedEvent.liked == 1){
    //   setLike(true);
    // }
    // console.log(selectedEvent.id);
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
            const resp = await fetch(UsedServer + '/organization_details', {
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
                  // updateData(selectedEvent)
                  navigation.goBack();
                  // updateData(selectedEvent);
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
                  width: 40,
                  height: 40,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 13,
                }} >
                <McIcon source={icons.fullscreen} style={{
                  tintColor: COLORS.white,
                }} size={24}/>
              </TouchableOpacity>
             
            </SectionImageHeader>
            {/* Image Footer*/}
            <SectionImageFooter>
              <LinearGradient
                colors = {['transparent',COLORS.black]}
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
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      marginHorizontal: -6
                    }}>
                      {/* <McIcon source ={icons.event} size={24} style={{
                          marginTop: 2,
                          tintColor:COLORS.purple,
                        }}/> */}
                      <McText h3 style={{letterSpacing: 1.5, margin: 6, marginRight: 0, color: COLORS.purple, opacity: 0.85 }}>
                        {moment(selectedEvent?.startingTime).format('MMM DD').toUpperCase()}
                    </McText>
                    <McText h3 style={{letterSpacing: 1.2, margin: 6, color: COLORS.white, opacity: 0.85 }}>
                        {moment(selectedEvent?.startingTime).format('h:mm A')}
                    </McText>
                    </View>
                  </View>
                </FooterContentView>
                
              </LinearGradient>
            </SectionImageFooter>
          </View>
        </ImageBackground>
        {/* buttons group section */}
        <McText h1 style={{width: width*0.8, marginHorizontal: 15, marginBottom: -5,}}>
          {selectedEvent?.title}
          </McText>
        <ButtonSection>
          <ScrollView horizontal = {true} showsHorizontalScrollIndicator={false}>
            {
              selectedEvent?.taglist.map((taglist)=> 
                <TouchableOpacity
                  style={{
                  width: taglist.length *9 + 15,
                  height: 32,
                  borderRadius: 14,
                  marginRight: 10,
                  backgroundColor: COLORS.input,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: COLORS.purple,
                  justifyContent: 'center',
                  alignItems: 'center'
                  }} 
                  onPress={()=>{
                    navigation.push('InterestDetail', {selectedInterest: taglist})
                  }}
                >
                  <McText h5 style={{ letterSpacing: 1}}>{taglist}</McText>
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
              numberOfLines={textShown ? undefined : 3} body3
              selectable={true}
              >

                {selectedEvent?.description}
            </McText>
              {
                  lengthMore ? <McText
                  onPress={toggleNumberOfLines}
                  style={{ lineHeight: 22, marginTop: 10, color: COLORS.gray}}>
                    {textShown ? 'Read less...' : 'Read more...'}</McText>
                  :null
              }
          </View>
        </DescriptionSection>
        <LocationSection>
        <McIcon source ={icons.location} size={24} style={{
              margin:4,
              tintColor:COLORS.purple,
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
                >
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
              tintColor: COLORS.purple
            }}/>
        <View>
          <McText body5 numberOfLines={1} style={{
              opacity: 0.8,
              letterSpacing: 1,
              textTransform: 'uppercase' 
              }}>
                {selectedEvent?.visibility}
            </McText>
          </View>
        </VisibilitySec>
        <View>
          <TouchableOpacity style={styles.edit} onPress={() =>{
                  // updateData(selectedEvent)
                  navigation.navigate('EditEvent', {selectedEvent: selectedEvent});
                  // updateData(selectedEvent);
                }}>
            <McText h5>Edit this Event</McText>
          </TouchableOpacity>
        </View>
        <SectionFooter><McText h1 style={{
        //temp fix for padding
        color:'transparent'
      }}>hello</McText></SectionFooter>
      </ScrollView>
         <View style={styles.otherContainer}>
          <UserOptionsSection>
            <View style={{
              alignItems: 'center',
              marginRight: 60
            }}>
            <TouchableOpacity style={{
                      width: 60,
                      height: 60,
                      borderRadius: 80,
                      backgroundColor:join ? COLORS.purple: 'transparent' ,
                      borderWidth: 1,
                      borderColor: COLORS.gray,
                      justifyContent: 'center',
                      alignItems: 'center'
                      }} onPressOut={()=>{
                          join ? setJoin(false) : setJoin(true);
                          
                          handleJoin();
                          
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
                      backgroundColor: shoutout ? COLORS.purple : 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center'
                      }} onPress={()=>{
                        shoutout ? setShoutout(false) : setShoutout(true);
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
        </View>
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
  marginHorizontal: 15px;
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
  padding: 60px;
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
    backgroundColor: COLORS.black
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
  edit :{
    marginLeft: width/12,
    backgroundColor: COLORS.purple,
    width: width/3.5,
    borderRadius: 14,
    alignItems: 'center',
    height: 35,
    justifyContent: 'center',

  }
});

export default memo(EventDetail);
