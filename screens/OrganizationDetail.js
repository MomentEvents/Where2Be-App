import React, {useState, useEffect, useCallback} from 'react';
// import { Text, View, StyleSheet } from 'react-native';
import { Text, View, StyleSheet, ScrollView, Image, ImageBackground, Platform, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { McIcon, McText } from '../components';
import { dummyData, FONTS, SIZES, COLORS, icons } from '../constants';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient'
import { Dimensions } from "react-native";
import moment from 'moment';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <LinearGradient
      colors = {[ COLORS.black,COLORS.black,'#1060b6']}
      start = {{x: 0, y: 0}}
      end = {{ x: 1, y: 1}}
      style = {{padding:2, borderRadius: 20 }}>
        <SafeAreaView>
        <TouchableOpacity 
                onPress={() =>{
                  navigation.goBack();
                }}
                style={{
                  width: 56,
                  height: 40,
                  marginLeft: 30,
                  marginBottom: 6,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 13,
                }}
              >
                <McIcon source={icons.back_arrow} size={24}/>
                </TouchableOpacity>
            <View style={{
                flexDirection: 'row',
                width: width,
                alignItems: 'center',
                marginHorizontal: 30,
            }}>
                <Image
                style={styles.userProfilePic}
                source={{
                    uri:selectedEvent?.image
                }}/>
                <View style={{
                    flexDirection: 'column',
                    marginVertical: 8,
                    marginLeft: 12,
                    width: width/1.5,
                    alignItems: 'flex-start',
                }}>
                    <View style={{
                        alignItems: 'center'
                    }}>
                    <McText h2 numberOfLines={3} style={{
                        paddingBottom: 6,
                        paddingHorizontal: 8,
                    }}>{selectedEvent?.title}</McText>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 12,
                    }}><McText h4 style={{
                        letterSpacing: 1.2,
                    }}>XYZ Followers</McText>
                        <TouchableOpacity style={styles.button}><McText h4 style={{
                            letterSpacing: 1.2,
                        }}
                        onPress={() =>{
                            console.log('FOLLOW')
                        }}
                        >FOLLOW</McText></TouchableOpacity>
                    </View>
                    
                </View>
            </View>
            <View style={styles.EventsHeader}>
                <TouchableWithoutFeedback onPress={() =>{
                            console.log('Upcoming')
                        }}>
                    <McText h3 style={{
                        marginLeft: 10,
                        padding: 10
                        }}>Upcoming</McText>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() =>{
                            console.log('Past')
                        }}>
                    <McText h3 style={{
                    padding: 10,
                    opacity: 0.7
                }}>Past</McText>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() =>{
                            console.log('Gallery')
                        }}>
                    <McText h3 style={{
                    padding: 10,
                    opacity: 0.7
                }}>Gallery</McText>
                </TouchableWithoutFeedback>
            </View>

            <ScrollView 
                contentContainerStyle={{
                    backgroundColor: 'transparent'
                }}
                style={{
                    backgroundColor: 'transparent',
                }}
                >
                    {data.map((item)=>
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                console.log(item.startingTime)
                                navigation.navigate('EventDetail', {selectedEvent: item});
                            }}>
                            <View style={{
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 10,
                            marginBottom: 5,
                            flexDirection: 'row',
                            backgroundColor: COLORS.input,
                            borderRadius: 30,
                            opacity: 0.97,
                            }}>
                                <ImageBackground source={{uri: item.image}}
                                    resizeMode='cover'
                                    borderRadius= {SIZES.radius}
                                    borderColor={COLORS.gray}
                                    //borderWidth= '0.2'
                                    style={{
                                        width: SIZES.width/4 - 10,
                                        height: SIZES.width/4 + 10,
                                        margin: 10,
                                        justifyContent: 'space-between',
                                    }}/>  
                            <View style={{
                                alignItems: 'flex-end',
                                //marginHorizontal: 15,
                                //marginVertical: 15
                                }}>
                                    <View style={{
                                    marginHorizontal: 15,
                                    width : width/1.7,
                                    marginBottom: 10,
                                    margin: 15,
                                    alignItems : 'flex-start',
                                    //backgroundColor: COLORS.black
                                    }}>
                                    {/* <McText body5 style={{opacity: 0.5}}>{item.type}</McText> */}
                                    <McText h3 numberOfLines={2} onPress={()=>{
                                    console.log(item.title)
                                    }}>{item.title}</McText>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginHorizontal: 2,
                                        marginVertical: 1.5,
                                    }}>
                                        <McIcon source={icons.event} size={16} style={{
                                            tintColor: COLORS.gray,
                                            marginLeft: -4,
                                        }}/>
                                        <McText h8
                                            style={{color: COLORS.gray}}>
                                            {moment(item.startingTime).format('MMM DD YYYY, h:mm a').toUpperCase()}
                                        </McText>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginHorizontal: 2,
                                    }}>
                                        <McIcon source={icons.location} size={16} style={{
                                            tintColor: COLORS.gray,
                                            marginLeft: -4,
                                        }}/>
                                        <McText h8
                                            style={{color: COLORS.gray, width: width/1.8}} numberOfLines={1}>
                                            {item.location}
                                        </McText>
                                    </View>
                                    <View style={{
                                        position: 'absolute',
                                        flexDirection:'column',
                                        height: height/8.1,
                                        justifyContent: 'flex-end',
                                    }}>
                                    <View style={{
                                        flexDirection: 'row',
                                    }}>
                                        <View style= {{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                        <TouchableOpacity style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: 80,
                                            marginHorizontal: 2,
                                            backgroundColor: 'transparent',
                                            borderWidth: 1,
                                            borderColor: COLORS.gray,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                            }} onPress={()=>{
                                                console.log("Like")
                                            }}>
                                            <McIcon source={icons.like} size={16} style={{
                                                tintColor:COLORS.gray,
                                                marginHorizontal: 8
                                                }}/>
                                        </TouchableOpacity>
                                        <McText h8 style={{
                                            marginTop: 2,
                                            color: COLORS.gray
                                        }}>666</McText>
                                        </View>
                                        <View style= {{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginHorizontal: 4,

                                        }}>
                                        <TouchableOpacity style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: 80,
                                            marginHorizontal: 2,
                                            backgroundColor: 'transparent',
                                            borderWidth: 1,
                                            borderColor: COLORS.gray,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                            }} onPress={()=>{
                                                console.log("Interested")
                                            }}>
                                            <McIcon source={icons.check} size={20} style={{
                                                tintColor:COLORS.gray,
                                                marginHorizontal: 8
                                                }}/>
                                        </TouchableOpacity>
                                        <McText h8 style={{
                                            marginTop: 2,
                                            color: COLORS.gray
                                        }}>666</McText>
                                        </View>
                                        <View style= {{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                        <TouchableOpacity style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: 80,
                                            marginHorizontal: 2,
                                            backgroundColor: 'transparent',
                                            borderWidth: 1,
                                            borderColor: COLORS.gray,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                            }} onPress={()=>{
                                                console.log("Shoutout")
                                            }}>
                                            <McIcon source={icons.shoutout} size={16} style={{
                                                tintColor:COLORS.gray,
                                                marginHorizontal: 8
                                                }}/>
                                        </TouchableOpacity>
                                        <McText h8 style={{
                                            marginTop: 2,
                                            color: COLORS.gray
                                        }}>666</McText>
                                        </View>
                                    </View>
                                    </View>
                                    {/* <McText h8 
                                        style={{color: COLORS.gray, width: width/1.8}} numberOfLines={1}>
                                            666 Attending
                                        </McText>
                                        <McText h8 
                                        style={{color: COLORS.gray, width: width/1.8}} numberOfLines={1}>
                                            444 Interested
                                        </McText>
                                        <McText h8 
                                        style={{color: COLORS.gray, width: width/1.8}} numberOfLines={1}>
                                            90 ShoutOuts
                                        </McText> */}
                                    </View>
                                    {/* </BlurView> */}
                                
                                </View>
                            </View>
                    
                        </TouchableWithoutFeedback>
    
                        )
                    }
                    <SectionFooter><McText h1 style={{
        //temp fix for padding
        color:'transparent'
      }}>hello</McText></SectionFooter>

                </ScrollView>

                
        </SafeAreaView>
        </LinearGradient>
    </View>
  );
};

const SectionEventHeader = styled.View`
  flex-direction: row;
  margin-top: 10px;
  margin-left: 30px;
  margin-right: 30px;
`
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
  padding: 180px;
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
    backgroundColor: '#000',
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

export default OrganizationDetail;
// 
    