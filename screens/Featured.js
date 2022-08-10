//import React from 'react';
import React, { useState, useEffect } from 'react';
import { TouchableHighlight , Platform, Text, View, StyleSheet, ScrollView, Button, SafeAreaView, TextInput, FlatList, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur';

import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';
import { McText, McIcon, McAvatar} from '../components'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';

// import React from 'react';
// import { Text, View, StyleSheet, Button } from 'react-native';
const Featured = ({ navigation, route }) => {

  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
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
    // const resp = await fetch("http://10.0.2.2:3000/data");
    // const data = await resp.json();

    const resp = await fetch(`http://mighty-chamber-83878.herokuapp.com/feat`, {
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
    setLoading(false);
  };

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

  const _renderItem = ({item, index}) => {
    return (
      <TouchableWithoutFeedback
        onPress={()=>{
          navigation.navigate('EventDetail', {selectedEvent: item});
          console.log("clicked the event")
        }}
      >
        <View style={{
          marginLeft: index === 0 ? 20: 15,
        }}>
          <LinearGradient
                colors = {['#902070', '#DD77EB', '#a2d2ff']}
                style = {{padding:2, borderRadius: 20 }}>
            <LinearGradient
                colors = {['#000000','#000000']}
                style = {{padding:2.5, borderRadius: 20 }}>
              <ImageBackground source={{uri: item.image}}
          resizeMode='cover'
          borderRadius= {SIZES.radius}
          borderColor={COLORS.gray}
          borderWidth= {0.2}// string not number typeError
          style={{
            width: SIZES.width/2.7 + 10,
            height: SIZES.width/2.3 + 10,
            justifyContent: 'space-between'
          }}
          >
          <View style={{
              alignItems: 'flex-end',
              marginHorizontal: 8,
              marginVertical: 8
            }}>
            <DateBox>
              <McText body5 color={COLORS.black} 
              style={{opacity: 0.5,
                      letterSpacing: 2
                    }}>
                {moment(item.startingTime).format('MMM').toUpperCase()}
              </McText>
              <McText h3 color={COLORS.black}>
                {moment(item.startingTime).format('DD')}
              </McText>
            </DateBox>
          </View>
          
            {/* <GrayBox> */}
              <View style={{
                flexDirection: 'row',
                marginVertical: 8,
                // alignItems: 'center',
                // justifyContent: 'center'
              }}>
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
                console.log("like " + item.title)
              }}>
                <McIcon source={icons.like} size={18} style={{
              tintColor:COLORS.white,
            }}/>
            </TouchableHighlight>
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
                console.log("join " + item.title)
              }}>
                <McIcon source={icons.check} size={20} style={{
              tintColor:COLORS.white,
            }}/>
            </TouchableHighlight>
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
            </TouchableHighlight>
              </View>
            {/* </GrayBox> */}
            
          </ImageBackground>
          </LinearGradient>
          </LinearGradient>
          <TouchableWithoutFeedback>
          <View style={{
                  marginLeft: 10,
                  marginTop: 5,
                  width: SIZES.width/3 +10,
                  //backgroundColor: COLORS.black
                }}
                >
                  <McText h5 numberOfLines={1}>{item.title}</McText>
        <McText>{moment(item.startingTime).format('hh:mm A').toUpperCase()}</McText>
                </View>
                </TouchableWithoutFeedback>
        </View>

      </TouchableWithoutFeedback>

    )
  }

  // const _renderList = (heading, dataset) => {
  //   return (
  //     <View>
  //       <SectionTitle>
  //         <McText h3>
  //           {heading}
  //         </McText>
  //       </SectionTitle>
  //       <View>
  //         <FlatList
  //           horizontal

  //           showsHorizontalScrollIndicator={false}
  //           keyExtractor={(item) => 'event_' + item.id}
  //           //data={dummyData[dataset]}
  //           data={dataset}
  //           renderItem={_renderItem}
  //         ></FlatList>
  //       </View>
  //     </View>
  //   )
  // }
  return (
    <View style={styles.container}>
      <LinearGradient
                colors = {['#252525', COLORS.black, COLORS.black,'#652070']}
                start = {{x: 0, y: 0}}
                end = {{ x: 1, y: 1}}
                style = {{padding:2 }}>
      {/* Header here */}
      <SafeAreaView>
        <View style={styles.tempNav}>
      <SectionHeader>
        <View>
          <McText h1>
            <Text>Explore {name}</Text></McText>
        </View>
        <View style={{
          paddingLeft: 16,
        }}>
        <TouchableWithoutFeedback 
        onPress={()=>{
          navigation.navigate('Search')
        }}>
          <McIcon source ={icons.search} size={28} style={{
            tintColor:COLORS.gray
          }}/>
        </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback
        onPress={()=>{
          navigation.navigate('Interests')
        }}>
          <McIcon source={icons.tab_4} size={28} style={{
            tintColor:COLORS.gray
          }}/>
        </TouchableWithoutFeedback>
      </SectionHeader>
      </View>
      
      {/* <Button
        onPress={() => {
          navigation.navigate('EventDetail');
        }}
        title="Go to Event Detail"
      /> */}
      <ScrollView style={styles.scrollView}>
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
      {/* {_renderList("FEATURED", data)}
      {_renderList("ABTEST", data2)}
      {_renderList("ABTEST", data2)} */}
      <SectionFooter><McText h1 style={{
        //temp fix for padding
        color:'transparent'
      }}>hello</McText></SectionFooter>
      </ScrollView>
      
      {/* <SectionTitle>
        <McText h5>FOR YOU</McText>
      </SectionTitle>  */}
      </SafeAreaView>
      </LinearGradient>
    </View>
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
  background-color: rgba(100,100,100,0.8);
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
  padding: 100px;
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
  },
});

export default Featured;
