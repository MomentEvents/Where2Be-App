/**
 * React Native Event Booking App UI - Event Detail Screnn
 * -> The screen can be seperated 4 sections and 1 fixed bottom bar
 * 

 */
import React, {useState, useEffect, useCallback} from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Platform, TouchableOpacity } from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';
import { VERTICAL } from 'react-native/Libraries/Components/ScrollView/ScrollViewContext';
import styled from 'styled-components';
import { McIcon, McText } from '../components';
import { LinearGradient } from 'expo-linear-gradient'
import { dummyData, FONTS, SIZES, COLORS, icons } from '../constants';
import moment from 'moment';
import MapView, { PROVIDER_GOOGLE} from 'react-native-maps'
import { createNavigatorFactory } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


const EventDetail = ({ navigation, route }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore,setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => { //To toggle the show text or hide it
      setTextShown(!textShown);
  }
  
  const onTextLayout = useCallback(e =>{
      setLengthMore(e.nativeEvent.lines.length > 2); //to check the text is more than 4 lines or not
      // console.log(e.nativeEvent);
  },[]);
      
  useEffect(()=>{
    let {selectedEvent} = route.params;
    setSelectedEvent(selectedEvent);
  },[])

  return (
    <View style={styles.container}>
      <ScrollView 
      contentContainerStyle={{
        backgroundColor: COLORS.black
      }}
      style={{
        backgroundColor: COLORS.black
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
                }}
              >
                <McIcon source={icons.back_arrow} size={24}/>
              </TouchableOpacity>
              <View
              style={{
                width: 96,
                height: 40,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                borderRadius: 13,
              }}
              >
                <TouchableOpacity>
                  <McIcon 
                    source={icons.like} 
                    size={24}
                    style={{
                      marginLeft: 16, 
                      tinycolor: COLORS.white,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <McIcon 
                    source={icons.share} 
                    size={24} 
                    style={{
                      marginRight: 16, 
                      tinycolor: COLORS.white,
                    }}
                  />
                </TouchableOpacity>
              </View>
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
                    <McText h1>{selectedEvent?.title}</McText>
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
          <ScrollView horizontal = {true}>
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
                >
                  <McText h6 style={{opacity: 0.5, letterSpacing: 1}}>{taglist}</McText>
                </TouchableOpacity>
              )
            }
          </ScrollView>
        </ButtonSection>
        <LocationSection>
        <McIcon source ={icons.location} size={40} style={{
              margin:-6,
            }}/>
          <McText h4 style={{opacity: 0.8, letterSpacing: 1 }}>
            AT </McText>
            <TouchableWithoutFeedback onPress={()=>{
                console.log("Chirag's an idiot")
                }}>
              <McText h4 style={{
                opacity: 0.8,
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginTop: -1, 
                }}>
                  {selectedEvent?.location}
              </McText>
              </TouchableWithoutFeedback>
          </LocationSection>
          <OwnerSection>

            <McIcon source ={icons.tab_4} size={20} style={{
              margin:4,
            }}/>
            <McText h4 numberOfLines={1} style={{
              opacity: 0.8,
              letterSpacing: 1,
              textTransform: 'uppercase' 
              }}>{selectedEvent?.title}
            </McText>

        </OwnerSection>
    
        <DescriptionSection>
          <View style={{
                  marginLeft: 12,
                  marginBottom: 4,
                  marginTop: 4,
                  marginRight: 12,
                  //backgroundColor: COLORS.black
                }}>
            <McText 
              onTextLayout={onTextLayout}
              numberOfLines={textShown ? undefined : 3} body3>
                {selectedEvent?.description}
            </McText>
              {
                  lengthMore ? <McText
                  onPress={toggleNumberOfLines}
                  style={{ lineHeight: 21, marginTop: 10 }}>
                    {textShown ? 'Read less...' : 'Read more...'}</McText>
                  :null
              }
          </View>
        </DescriptionSection>
        <VisibilitySec>
        <McIcon source ={icons.tab_4} size={16} style={{
              margin:8,
            }}/>
        <View>
          
          <McText body5 numberOfLines={1} style={{
              opacity: 0.8,
              letterSpacing: 1,
              textTransform: 'uppercase' 
              }}>
                {selectedEvent?.visibility}PUBLIC EVENT
            </McText>
          </View>
        </VisibilitySec>
        
      </ScrollView>
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
`;


const LocationSection = styled.View`
  flex-direction: row;
  marginHorizontal: 16px;
  marginBottom: 8px;
  borderRadius: 10;
  align-items: center;
`;

const OwnerSection = styled.View`
  flex-direction: row;
  marginHorizontal: 16px;
  marginBottom: 8px;
  borderRadius: 10;
  align-items: center;
`;
const VisibilitySec = styled.View`
  flex-direction: row;
  margin: 16px;
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
});

export default EventDetail;
