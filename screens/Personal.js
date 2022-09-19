//import React from 'react';
import React, { useState, useEffect } from 'react';
import { TouchableHighlight , Platform, Text, View, StyleSheet, ScrollView, Button, SafeAreaView, TextInput, FlatList, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient'

import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';
import { McText, McIcon, McAvatar} from '../components'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { Dimensions } from "react-native";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

import * as SplashScreen from 'expo-splash-screen';

// import React from 'react';
// import { Text, View, StyleSheet, Button } from 'react-native';
const Personal = ({ navigation, route }) => {

  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [category_feat, setcategory_feat] = useState([]);

  const [loading, setLoading] = useState(true);
  // const [type, setType] = useState("Instagram");
  var type = "Instagram";
  var type2 = "Discord";

  // const route = useRoute()
  // const name = route.params.name ? route.params.name : null 
  // console.log(name)

  // const {name} = route.params

//  useEffect(()=> {
//   console.log("featured.js")
//   console.log(navigation.joinedEvent  ? "yes data received" : "not received")

//  },[])
// useEffect(()=>{
//   console.log(route.params.name)
// })
  //handlleling the joinded event data 
  // useEffect(()=>{
  //   if(route.params?.selectedEvent) {
  //     console.log(route.params?.selectedEvent)
  //     console.log('selectEvnet')
  //   }else{
  //     console.log('not true')
  //   }

  // },[route.params])

  const fetchData = async () => {

    const resp2 = await fetch(`http://3.136.67.161:8080/spotlight`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: type,
      })
    }); 
    const data2 = await resp2.json();
    setData2(data2);

    const resp = await fetch(`http://3.136.67.161:8080/feat`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: type,
        password: 'testpassword'
      })
    }); 
    const data = await resp.json();

    setData(data);

    

    const resp3 = await fetch(`http://3.136.67.161:8080/feat_orgs`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: type,
      })
    }); 
    const data3 = await resp3.json();
    setData3(data3)
    
    const resp4 = await fetch(`http://3.136.67.161:8080/categories`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: type,
      })
    }); 
    const data4 = await resp4.json();
    setData4(data4)

    const resp5 = await fetch(`http://3.136.67.161:8080/categories_feat`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: type,
      })
    }); 
    const category_feat = await resp5.json();
    setcategory_feat(category_feat)

    setLoading(false);
  };
  const categories = data4
  const orgs = data3
  const spotlight = data2
  // var ab = 0;

  useEffect(() => {
    fetchData();
  }, [type, type2]);
  
  var type_arr = ["Discord", "Instagram"];

  const change_names = () => {
    type = type_arr[1];
    //console.log(data[0].id);
    // ab = data[0].type;
  }


  change_names();
  // console.log(ab);
  // for (var i = 0; i < numrows; i++) {
  //     rows.push(ObjectRow());
  // }
  // return tbody(rows);

  const _renderOrgs = ({item, index}) => {
    return(
      <View style={{
        marginHorizontal: 6,
      }}>
      <TouchableHighlight
        onPress={()=>{
          navigation.navigate('OrganizationDetail', {OrgID: item.uniqueID});
        }}
        style={{
          borderRadius:20
        }}
      >
        <View style={{
          width: SIZES.width/3
        }}>
          <View style={styles.org}>
          <Image source={{uri: item.image}}
            resizeMode='cover'
            borderRadius= {SIZES.radius}
            borderColor={COLORS.gray}
            borderWidth= {0.2}// string not number typeError
            style={styles.userProfilePic}
            />
            {/* <GrayBox> */}
            {/* </GrayBox> */}
            <View style={{
              marginHorizontal: 10,
              marginBottom: 10,
              
            }}>
            <McText h4 numberOfLines={1} style={{
              
            }}>{item.title}</McText>
            </View>
        </View>
        </View>
      </TouchableHighlight>
      </View>
    )
  }

  const _renderCategories = ({item, index}) => {
    SplashScreen.hideAsync();
    return (
      <View>
      <TouchableHighlight
        onPress={()=>{
          navigation.navigate('InterestDetail', {selectedInterest: item.name})
        }}
        style={styles.category}>
        <View style={{
        width: width/3.3,
        height: height/25,
        alignItems: 'center',
      }}><McText h3>{item.name}</McText>
      <McText body4 style={{
        opacity: 0.7
      }}>{item.event_count} Events</McText></View>
        </TouchableHighlight>
    </View>
    )
  }

  const _renderItem = ({item, index}) => {
    return (
   
      <View style={{
        marginLeft: index === 0 ? 20: 15,
      }}><TouchableHighlight
      onPress={()=>{
        navigation.navigate('EventDetail', {selectedEvent: item});
      }}
      style={{
        borderRadius: 20,
      }}
    >
        <ImageBackground source={{uri: item.image}}
          resizeMode='cover'
          borderRadius= {SIZES.radius}
          borderColor={COLORS.gray}
          borderWidth= {0.3}// string not number typeError
          style={{
            width: SIZES.width/2.5 + 10,
            height: SIZES.width/1.9 + 10,
            justifyContent: 'space-between'
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
              end = {{ x: 1, y: 0.9}}
              style = {{padding:0, marginBottom: 0.3, borderRadius: 20, height: SIZES.height/7}}>
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
                      color: COLORS.white,
                      opacity:0.7,
                    }}>{moment(item.startingTime).format('MMM DD h:mm A')}</McText>
                    <View style={{
                  flexDirection: 'row',
                  opacity: 0.8
                }}>
                  <McIcon source ={icons.shoutout} size={20} style={{
                      tintColor:COLORS.lightGray,
                      marginRight: 10,
                    }}/>
                    <McText body7 style={{
                      marginTop: 2,
                      marginLeft: -7,
                      marginRight: 10,
                      color: COLORS.lightGray
                    }}>12</McText>
                    <McIcon source ={icons.check} size={20} style={{
                      tintColor:COLORS.lightGray,
                      marginRight: 10,
                    }}/>
                    <McText body7 style={{
                      marginTop: 2,
                      marginLeft: -7,
                      marginRight: 10,
                      color: COLORS.lightGray
                    }}>46</McText>
                </View>
                </View>
                
        </LinearGradient>
      </ImageBackground>
      </TouchableHighlight>
      </View>
    
    )
  }
  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.tempNav}>
      <SectionHeader>
        <View>
          <McText h1>
            <Text>Your Events</Text></McText>
        </View>
        <View style={{
          paddingLeft: 16,
          flexDirection:'row'
        }}><TouchableWithoutFeedback 
        onPress={()=>{
          navigation.navigate('Search')
        }}>
          <McIcon source ={icons.filter} size={28} style={{
            tintColor:COLORS.purple,
            marginRight: 10,
          }}/>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback 
        onPress={()=>{
          navigation.navigate('Search')
        }}>
          <McIcon source ={icons.search} size={28} style={{
            tintColor:COLORS.purple,
            marginRight: 10,
          }}/>
        </TouchableWithoutFeedback>
        </View>

      </SectionHeader>
      </View>
      
      {/* <Button
        onPress={() => {
          navigation.navigate('EventDetail');
        }}
        title="Go to Event Detail"
      /> */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {data ?
          data.map((sdata)=>
          <View>
            <SectionTitle>
              <McText h3>
                {sdata.header}
              </McText>
            </SectionTitle>
            <View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => 'event_' + item.id}
                //data={dummyData[dataset]}
                data={sdata.data}
                renderItem={_renderItem}
              ></FlatList>
            </View>
          </View>
          
          //{_renderList(sdata.header, sdata.data)}

          )
          : <Text>loadd....</Text>
        }
      <SectionFooter><McText h1 style={{
        //temp fix for padding
        color:'transparent'
      }}>hello</McText></SectionFooter>
      </ScrollView>
      
      {/* <SectionTitle>
        <McText h5>FOR YOU</McText>
      </SectionTitle>  */}
      </SafeAreaView>
  );
};

const SectionTitle = styled.View`
  margin: 16px ${SIZES.padding};
  marginTop: 20px;
  
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
//background-color: rgba(100,100,100,0.65);
const GrayBox = styled.View`
  background-color: rgba(100,100,100,0.3);
  borderBottomRightRadius: 20px;
  borderBottomLeftRadius: 20px;
`

const SectionHeader = styled.View`
  background-color: transparent;
  padding: 16px ${SIZES.padding};
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
//temp fix for padding
const SectionFooter = styled.View`
  background-color: transparent;
  padding: 60px;
  justify-content: space-between;
`;
//justify-content: space-between;
const SectionSearch = styled.View`
  margin: 8px ${SIZES.padding};
  height: 50px;
  marginBottom: 12px;
  background-color: ${COLORS.input};
  border-radius: 15px;
  justify-content: center;
`;

const SearchView = styled.View`
flex-direction: row;

align-items: center;
margin-left: 9px;
margin-right: 15px;

`
//background-color: ${COLORS.white};
const Srch = styled.View`
  
  margin-left: 0px;
  width: 100px;
`

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#1E2029',
    backgroundColor: COLORS.black,
  },
  grabox: {
    backgroundColor: 'rgba(100,100,100,0.8)',
    borderRadius: SIZES.radius,
  },
  tempNav: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#282828",
    // borderRadius: 20
  }, org: {
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.gray,
  }, userProfilePic: {
    height: height/11,
    width: height/11,
    borderRadius: 300,
    margin:12,
    marginBottom: 5,
    padding: 30,
    borderWidth: 1,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  }, category: {
    width: width/2.5,
    height: height/15,
    backgroundColor: COLORS.input,
    marginHorizontal: 6,
    marginBottom: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Personal;
