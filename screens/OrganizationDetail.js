import React, {useState, useEffect, useCallback} from 'react';
// import { Text, View, StyleSheet } from 'react-native';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Platform, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { McIcon, McText } from '../components';
import { dummyData, FONTS, SIZES, COLORS, icons } from '../constants';
import styled from 'styled-components';
import { LinearGradient } from 'expo-linear-gradient'
import { Dimensions } from "react-native";
import moment from 'moment';
import { Colors } from 'react-native/Libraries/NewAppScreen';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


const OrganizationDetail = ({ navigation, route }) => {

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
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
    
    // console.log(iD)
    const fetchData = async () => {
        let data;
        if(iD !== 'bad') {
            const resp = await fetch('http://mighty-chamber-83878.herokuapp.com/organization_events', {
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
          setLoading(false);
    };
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
    
   
  return (
    <View style={styles.container}>
        <View style={{
            width: width,
            height: height
        }}>
            <LinearGradient
                colors = {['#252525', COLORS.black,COLORS.black,'#003060']}
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
                            }}>
                            <McIcon source={icons.back_arrow} size={24}/>
                        </TouchableOpacity>
                        
                        </SectionImageHeader>
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
                                        <McText h1>{selectedEvent?.Name}</McText>
                                    </View>
                                    <View style={{
                                        paddingBottom:15
                                    }}>
                                    </View>
                                </FooterContentView>
                            </LinearGradient>
                        </SectionImageFooter>
                        
                    </ImageBackground> 
                    
                    {
                        data.map((item)=>
                        <TouchableWithoutFeedback
                            onPress={()=>{
                            console.log(item.startingTime)
                            navigation.navigate('EventDetail', {selectedEvent: item});
                            }}
                        >
                            <View style={{
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 10,
                            marginBottom: 5,
                            }}>
                            <LinearGradient
                                    colors = {['#902070', '#DD77EB', '#a2d2ff']}
                                    style = {{padding:2, borderRadius: 20 }}>
                                <LinearGradient
                                    colors = {['#000000','#000000']}
                                    style = {{padding:2.5, borderRadius: 20,  flexDirection: 'row'}}>

                                <ImageBackground source={{uri: item.image}}
                            resizeMode='cover'
                            borderRadius= {SIZES.radius}
                            borderColor={COLORS.gray}
                            //borderWidth= '0.2'
                            style={{
                                width: SIZES.width/2 - 10,
                                height: SIZES.width/2 + 10,
                                justifyContent: 'space-between'
                    
                            }}
                            ></ImageBackground>   
                            <View style={{
                                alignItems: 'flex-end',
                                //marginHorizontal: 15,
                                //marginVertical: 15
                                }}>
                                {/* <DateBox>
                                <McText body5 color={COLORS.black} 
                                style={{opacity: 0.5,
                                        letterSpacing: 2
                                        }}>
                                    {moment(item.startingTime).format('MMM').toUpperCase()}
                                </McText>
                                <McText h3 color={COLORS.black}>
                                    {moment(item.startingTime).format('DD')}
                                </McText>
                                </DateBox> */}
                            
                            
                                
                                {/* <BlurView> */}
                                    <View style={{
                                    marginLeft: 5,
                                    width : 140,
                                    marginBottom: 10,
                                    marginTop: 5,
                                    alignItems : 'center',
                                    //backgroundColor: COLORS.black
                                    }}>
                                    {/* <McText body5 style={{opacity: 0.5}}>{item.type}</McText> */}
                                    <McText h3 onPress={()=>{
                                    console.log("Chirag's an idiot")
                                    }}>{item.title}</McText>
                                    <McText h8
                                        style={{color: COLORS.gray}}>
                                        {moment(item.startingTime).format('MMM DD YYYY').toUpperCase()}
                                    </McText>
                                    <McText h8
                                        style={{color: COLORS.gray}}>
                                        {item.location}
                                    </McText>
                                    </View>
                                    {/* </BlurView> */}
                                
                                </View>
                            
                            </LinearGradient>
                            </LinearGradient>
                            </View>
                    
                        </TouchableWithoutFeedback>
    
                        )
                    }

                </ScrollView>
            </LinearGradient>
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
  
`;
const FooterContentView = styled.View`
flex-direction: row;
justify-content: space-between;
align-items: center;
margin: 0px 30px;
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
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrganizationDetail;
// 
    