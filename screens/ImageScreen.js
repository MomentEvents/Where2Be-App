/**
 * React Native Event Booking App UI - Event Detail Screnn
 * -> The screen can be seperated 4 sections and 1 fixed bottom bar
 * 

 */
import React, {useState, useEffect, useRef} from 'react';
import { Animated, Modal, Image, Linking, Text, View, StyleSheet, ScrollView, ImageBackground, Platform, TouchableOpacity } from 'react-native';
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
import ImageView from 'react-native-image-view';


import {memo} from "react"

import { Dimensions } from "react-native";
import ImageViewer from 'react-native-image-zoom-viewer';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

// const onPinchEvent = Animated.event([{
//   nativeEvent: {scale}
// }], {useNativeDriver: true})


const ImageScreen = ({ navigation, route }) => {
  const [img, setImg] = useState(null);

  const [loading, setLoading] = useState(true);
  // console.log(joindedEvent)
      
  useEffect(()=>{
    let {img} = route.params;
    setImg(img);
  },[])

  return (
    <View style={styles.container}>
       <LinearGradient
          colors = {[ '#650070', COLORS.trueBlack,'#003060']}
          start = {{x: 0, y: 0}}
          end = {{ x: 1, y: 1}}
          style = {{padding:2, borderRadius: 20, height: height,
          justifyContent: 'center',}}>
            <View style={{
              position: 'absolute',
              top: 52,
              left: 24,
            }}>
          <TouchableOpacity 
                onPress={() =>{
                  navigation.goBack();
                }}
                style={{
                  width: 56,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 13,
                  marginLeft: -20,
                }}>
                <McIcon source={icons.close} style={{
                  tintColor: COLORS.white,
                  marginLeft: 8,
                }} size={36}/>
              </TouchableOpacity>
          </View>
          <ImageViewer
              images={{uri:img}}
              imageIndex={0}
              isVisible={true}
              renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}>

          </ImageViewer>
            {/* <ImageBackground
          resizeMode='cover'
          source={{uri:img}}
          style = {{
            width: '100%',
            height: 
              SIZES.height < 700? SIZES.height * 0.4 : SIZES.height * 0.5,
            marginBottom: 80,
          }}
        /> */}
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

export default memo(ImageScreen);
