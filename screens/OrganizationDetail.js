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

    const [OrgID, setOrgID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    useEffect(()=>{
        let {OrgID} = route.params;
        setOrgID(OrgID);
    },[])

    let iD;
    if (OrgID !== undefined){
        iD = OrgID;
    } else {
        iD = 'bad';
    }
    
    // console.log(iD)
    const fetchData = async () => {
        let data;
        let data2;
        if(iD !== 'bad') {
            console.log('A')
            const resp = await fetch('http://3.136.67.161:8080/organization_events', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: iD
                    })
            });
            console.log('resp', resp);
                
            
            const resp2 = await fetch('http://3.136.67.161:8080/organization_details', {
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
            data2 = await resp2.json();
            console.log('data2', data2)
        }
        else{
            console.log('EEEEEEEE')
            data = ['help'];
            data2 = ['help2']
        }
        setData(data);
        setData2(data2);
        console.log(OrgID)
        console.log('hello',data2)
            
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
    
   
  return (
        <SafeAreaView style={styles.container}>
        <TouchableOpacity
                onPress={() =>{
                  navigation.goBack();
                  console.log('hello')
                }}
                style={{
                    position: 'absolute',
                    top: 50,
                    left: 10,
                    width: 20,
                    borderRadius: 13,
                }}
              >
                <McIcon source={icons.back_arrow} style={{
                  tintColor: COLORS.white,
                  marginLeft: 20,
                }} size={24}/>
                </TouchableOpacity>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 40,
                marginLeft: 44,
            }}>
            <View style={{
                flexDirection: 'row',
                width: width,
                alignItems: 'center',
            }}>
                <Image
                style={styles.userProfilePic}
                source={{
                    uri:data2.image
                }}/>
                <View style={{
                    flexDirection: 'column',
                    marginVertical: 8,
                    marginHorizontal: 20,
                    width: width/1.6,
                    alignItems: 'flex-start',
                }}>
                    <McText h2 style={{
                        paddingBottom: 6,
                    }}>{data2?.name}</McText>
                    </View>
            </View>
            </View>
            <View style={{
                alignItems: 'center'
            }}>
            <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    }}>
                        <View style={{
                            alignItems: 'center',
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                        }}>
                            <McText h3 style={{
                                letterSpacing: 1.2,
                                color: COLORS.purple
                                }}>666 </McText>
                            <McText h6 style={{
                                letterSpacing: 1.2,
                                color: COLORS.white
                            }}>Followers</McText>
                        </View>
                        <View style={{
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        }}>
                            <McText h3 style={{
                                letterSpacing: 1.2,
                                color: COLORS.purple
                                }}>999 </McText>
                            <McText h6 style={{
                                letterSpacing: 1.2,
                                color: COLORS.white
                            }}>Events</McText>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={() =>{
                            console.log('FOLLOW')
                        }}><McText h4 style={{
                            letterSpacing: 1.2,
                        }}
                        
                        >FOLLOW</McText></TouchableOpacity>
                    </View>
                    </View>

            <View style={styles.EventsHeader}>
                <TouchableWithoutFeedback onPress={() =>{
                            console.log('Upcoming')
                        }}>
                    <McText h3 style={{
                        marginLeft: 10,
                        padding: 10
                        }}>Upcoming Events</McText>
                </TouchableWithoutFeedback>
                {/* <TouchableWithoutFeedback onPress={() =>{
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
                </TouchableWithoutFeedback> */}
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
                            console.log(item)
                            navigation.push('EventDetail', {selectedEvent: item});
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
                                    width : width/1.75,
                                    marginBottom: 10,
                                    margin: 15,
                                    alignItems : 'flex-start',
                                    //backgroundColor: COLORS.black
                                    }}>
                                    {/* <McText body5 style={{opacity: 0.5}}>{item.type}</McText> */}
                                    <McText h3 numberOfLines={2}>{item.title}</McText>
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
                                    {/* <View style={{
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
                                        </View>
                                    </View>
                                    </View> */}
                                    </View>
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
    backgroundColor: COLORS.black,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  userProfilePic: {
    height: 90,
    width: 90,
    borderRadius: 300,
    marginLeft: -15,
    borderWidth: 1,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 8,
    padding: 4,
    height: 32,
    width: 100,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.purple,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.white,
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
    