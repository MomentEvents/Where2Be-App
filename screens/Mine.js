import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient'
import { 
    SectionList,
    TouchableOpacity, 
    Text, 
    View, 
    StyleSheet, 
    SafeAreaView, 
    TextInput, 
    FlatList, 
    ImageBackground, 
    TouchableWithoutFeedback,
    DevSettings,
    Image,
 } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import {Platform} from "react-native";


import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';
import events from '../constants/events.json'
import { McText, McIcon, McAvatar} from '../components'
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from "react-native";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

 //datas = events
 const Mine = ({ navigation }) => {
  

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  var type = "Instagram";
  var type2 = "Discord";


  const fetchData = async () => {
    // const resp = await fetch("http://10.0.2.2:3000/data");
    // const data = await resp.json(

    const resp = await fetch(`http://54.226.108.97:8080/spotlight`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: type,
      })
    }); 
    const data = await resp.json();

    setData(data);
    setLoading(false);
  };
  // var ab = 0;

  useEffect(() => {
    fetchData();
    console.log(data.event)
  }, [type, type2]);

  const imageUri = "https://img.buzzfeed.com/buzzfeed-static/static/2022-04/12/19/asset/b96d474ef097/sub-buzz-418-1649792177-24.png" //+ "=s"+ (SIZES.width).toString()+ "-c"
  const dataset = [
    {images: ["https://img.buzzfeed.com/buzzfeed-static/static/2022-04/12/19/asset/b96d474ef097/sub-buzz-418-1649792177-24.png"
    , "https://img.buzzfeed.com/buzzfeed-static/static/2022-04/12/19/asset/b96d474ef097/sub-buzz-418-1649792177-24.png"
    , "https://img.buzzfeed.com/buzzfeed-static/static/2022-04/12/19/asset/b96d474ef097/sub-buzz-418-1649792177-24.png"
    , "https://img.buzzfeed.com/buzzfeed-static/static/2022-04/12/19/asset/b96d474ef097/sub-buzz-418-1649792177-24.png"]}
  ]

  const _renderSpotlight = ({item, index}) => {
    return (
      <TouchableWithoutFeedback
                            onPress={()=>{
                                console.log(item)
                                navigation.navigate('EventDetail', {selectedEvent: item});
                            }}>
                            <View style={{
                            marginRight: 20,
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
                                    </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
    )}

  return (
    <View style={styles.container}>
      <LinearGradient
                colors = {['#252525', COLORS.black, COLORS.black,'#652070']}
                start = {{x: 0, y: 0}}
                end = {{ x: 1, y: 1}}
                style = {{padding:2, borderRadius: 20 }}>
     <SafeAreaView style={{
      height: height,
      width: width
     }}>
      

        <SectionHeader>
          <TouchableWithoutFeedback onPress={()=>{
               {console.log("Add Friends")}
              }}>
          <McIcon source={icons.friend_add} style={{
            margin: 24,
            tintColor: COLORS.white
          }}
          size={28}/>
          </TouchableWithoutFeedback>
          <View style={{
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <McText h3> Me</McText>
          <McText h4 style={{
            color: COLORS.gray,
            margin: 6,
          }}>username</McText>
          </View>
          <TouchableWithoutFeedback onPress={()=>{
               navigation.navigate('Login')
              }}>
          {/* <McIcon source={icons.settings} style={{
            margin: 24,
            tintColor: COLORS.white
          }}
          size={28}/> */}
          <McText body3 style={{
            marginRight: 16,
          }}>Log Out</McText>
          </TouchableWithoutFeedback>
        </SectionHeader>
        <SectionProfilePic>
          <Image
          style={styles.userProfilePic}
          source={{
            uri:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
          }}>
          </Image>
        </SectionProfilePic>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <SectionButton>
        <TouchableOpacity onPress={()=>{
               {console.log("Profiledit")}
              }}>
          <McText h4 style={{
            letterSpacing: 2,
            margin: 8,
            marginHorizontal: 16,
          }}>EDIT PROFILE</McText>
          </TouchableOpacity>
        </SectionButton>
        <SectionOtherButton><TouchableOpacity onPress={()=>{
               navigation.navigate('Interests')
              }}>
          <McText h4 style={{
            letterSpacing: 2,
            margin: 8,
            marginHorizontal: 16,
          }}>INTERESTS</McText>
          </TouchableOpacity></SectionOtherButton>
        </View>
        

        <SectionImages>
        <View style={styles.EventsHeader}>
                <TouchableWithoutFeedback onPress={() =>{
                            console.log('Liked Events')
                        }}>
                    <McText h2 style={{
                        marginLeft: 10,
                        padding: 10
                        }}>Liked</McText>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() =>{
                            console.log('Past')
                        }}>
                    <McText h2 style={{
                    padding: 10,
                    opacity: 0.7
                }}>Past</McText>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() =>{
                            console.log('Gallery')
                        }}>
                    <McText h2 style={{
                    padding: 10,
                    opacity: 0.7
                }}>Gallery</McText>
                </TouchableWithoutFeedback>
            </View>
        <ScrollView>
        <View><FlatList
                keyExtractor={(item) => 'event_' + item.id}
                //data={dummyData[dataset]}
                data={data}
                renderItem={_renderSpotlight}
                style={{
                  marginTop: 8,
                  marginBottom: -12,
                  marginLeft: 6,
                }}
              ></FlatList></View>
              <SectionFooter><McText h1 style={{
        //temp fix for padding
        color:'transparent'
      }}>hello</McText></SectionFooter>

        </ScrollView>
        </SectionImages>
        
     </SafeAreaView>
     </LinearGradient>
     </View>
   );
 };
 const SectionHeader = styled.View`
 flex-direction: row;
 justify-content: space-between;
 align-items: center;
 margin-top: ${Platform.OS === 'ios'?'20px':'10px'};
 width: 100%
`;
const SectionName = styled.View`
  margin: 8px;
  height: 50px;
  width: ${width};
  justify-content: center;
  align-items: center;
`;

const SectionButton = styled.View`
  margin-horizontal: 10;
  flex-direction: row;
  justify-content: center;
  border-radius: 20;
  background-color: ${COLORS.input};
  align-items: center;

`
const SectionOtherButton = styled.View`
  margin-horizontal: 10;
  flex-direction: row;
  justify-content: center;
  border-radius: 20;
  background-color: ${COLORS.input};
  align-items: center;

`


const SectionImages = styled.View`
  margin: 12px;
  width: ${width};
  justify-content: center;
  align-items: flex-start;
`


const SectionFooter = styled.View`
  background-color: transparent;
  padding: 180px;
  justify-content: space-between;
`;


const SectionProfilePic = styled.View`
  justify-content: center;
  align-items: center;
`;
const SearchView = styled.View`
flex-direction: row;
justify-content: center;
align-items: center;
margin-left: 9px;
margin-right: 9px;
`;


const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: COLORS.black,
  }, 
  userProfilePic: {
    height: 120,
    width: 120,
    borderRadius: 300,
    padding: 30,
    margin: 24,
    borderWidth: 1,
    borderColor: COLORS.gray,
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
 
 export default Mine;
 