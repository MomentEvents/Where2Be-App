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
import { McIcon, McText } from '../components';
import { LinearGradient } from 'expo-linear-gradient'
import { FONTS, SIZES, COLORS, icons } from '../constants';
import moment from 'moment';
import MapView, { PROVIDER_GOOGLE} from 'react-native-maps'
import { createNavigatorFactory } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer';
import { AuthContext } from '../AuthContext';


import {memo} from "react"

import { Dimensions } from "react-native";
import UsedServer from '../constants/servercontants';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const img = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fnewevolutiondesigns.com%2Fcool-4k-wallpapers-for-desktop-ipad-and-iphone&psig=AOvVaw3IboKb7vdlKcS9FUJYEVx3&ust=1665266364697000&source=images&cd=vfe&ved=0CAkQjRxqFwoTCIC6j-OOz_oCFQAAAAAdAAAAABAM"

const dummyData = ["Title", "StartingTime", "Date", "Organizer", "Description", "Location", "Public", "Social", "Academic"]

function postEvent(dummyData){
  console.log(dummyData)
  var outData = []
  outData.push("")
}

const PreviewEventDetail = ({ navigation, route }) => {
  const [createEvent, setCreateEvent] = useState(null);
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore,setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const {UserId, setupData, Data, test, RefreshD, FinImport} = useContext(AuthContext)
  
  const toggleNumberOfLines = () => { //To toggle the show text or hide it
      setTextShown(!textShown);
  }

  useEffect(()=>{
    let {createEvent} = route.params;
    // console.log(createEvent);
    setCreateEvent(createEvent);
    // console.log(createEvent)
    // if(createEvent.liked == 1){
    //   setLike(true);
    // }
    // console.log(createEvent.id);
  },[])
  
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true);
  // console.log(joindedEvent)
  
  const onTextLayout = useCallback(e =>{
      setLengthMore(e.nativeEvent.lines.length > 2); //to check the text is more than 4 lines or not
      // console.log(e.nativeEvent);
  },[]);
 
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
          source={{uri:createEvent?.image}}
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
                  // updateData(createEvent)
                  navigation.goBack();
                  // updateData(createEvent);
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
                navigation.push('ImageScreen', {img: createEvent?.image})
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
                      {moment(createEvent?.date).format('MMM DD').toUpperCase()}
                    </McText>
                    <McText h3 style={{letterSpacing: 1.2, margin: 6, color: COLORS.white, opacity: 0.85 }}>
                    {createEvent?.start}
                    </McText>
                    <McText h3 style={{letterSpacing: 1.2, marginTop:6, marginHorizontal: -6, color: COLORS.white, opacity: 0.85 }}> to </McText>
                    <McText h3 style={{letterSpacing: 1.2, margin: 6, color: COLORS.white, opacity: 0.85 }}>
                    {createEvent?.end}
                    </McText>
                    </View>
                  </View>
                </FooterContentView>
                
              </LinearGradient>
            </SectionImageFooter>
          </View>
        </ImageBackground>
        {/* buttons group section */}
        <McText h1 numberOfLines={2} style={{width: width*0.8, marginHorizontal: 15, marginBottom: -5,}}>
          {createEvent?.title}
          </McText>
        <ButtonSection>
          <ScrollView horizontal = {true} showsHorizontalScrollIndicator={false}>
            {
              createEvent?.tags.map((taglist)=> 
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
          }} 
          // onPress={()=>{
          //       navigation.push('OrganizationDetail', {OrgID: createEvent?.userID})
          //       console.log(createEvent)
          //       console.log('lololololol')
          //     }}
              >
          <Image
                style={styles.orgProfilePic}
                source={{
                    uri: createEvent?.image
                }}/>
            <McText h4 numberOfLines={1} style={{
              letterSpacing: 1,
              textTransform: 'uppercase',
              width: width/1.25
              }}>
                {UserId}
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
                {createEvent?.desc}
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
                var uri = createEvent?.loc
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
                  {createEvent?.loc}
              </McText>
              </TouchableOpacity>
          </LocationSection>
          
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
                {dummyData[6]}
            </McText>
          </View>
        </VisibilitySec>
        <SectionFooter><McText h1 style={{
        //temp fix for padding
        color:'transparent'
      }}>hello</McText></SectionFooter>
      </ScrollView>
      <SectionDone>
          <TouchableOpacity
          style={{
            height: 60,
            marginBottom: 60,
            borderRadius: 80,
            borderWidth: 1,
            borderColor: COLORS.gray,
            backgroundColor: COLORS.purple,
            justifyContent: 'center',
            alignItems: 'center'
            }}
          onPress={()=>{
                      // test();
                      // navigation.navigate('Featured');
                      console.log(createEvent)
                      }}
                  >
                  <McText h3 style={{margin: 8}}>POST</McText>
          </TouchableOpacity>
      </SectionDone>
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

const SectionDone = styled.View`
  flex: 1;
  position: absolute;
  bottom: 0;
  right: 1;
  backgroundColor: transparent;
  marginHorizontal: 32px;
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
});

export default memo(PreviewEventDetail);
