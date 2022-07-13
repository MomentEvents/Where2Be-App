//import React from 'react';
import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, ScrollView, Button, SafeAreaView, TextInput, FlatList, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient'
//import { BlurView } from '@react-native-community/blur';

import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';
import { McText, McIcon, McAvatar} from '../components'
import { TouchableOpacity } from 'react-native-gesture-handler';


// import React from 'react';
// import { Text, View, StyleSheet, Button } from 'react-native';
const Featured = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [type, setType] = useState("Instagram");
  var type = "Instagram";
  var type2 = "Discord";

  const fetchData = async () => {
    // const resp = await fetch("http://localhost:3000/data");
    // const data = await resp.json();

    const resp = await fetch('http://localhost:3001/log', {
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

    console.log("here")
    const data = await resp.json();

    console.log(data);

    const resp2 = await fetch('http://localhost:3001/log', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: type2,
        password: 'testpassword'
      })
    });
    console.log("here")
    const data2 = await resp2.json();
    console.log(data2);

    setData(data);
    setData2(data2);
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
        }}
      >
        <View style={{
          marginLeft: index === 0 ? 30: 20,
          marginRight: index === dummyData.Events.length - 1 ? 30 : 0
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
          style={{
            width: SIZES.width/3 + 30,
            height: SIZES.width/2 + 30,
            justifyContent: 'space-between'

          }}
          >
          <View style={{
              alignItems: 'flex-end',
              marginHorizontal: 15,
              marginVertical: 15
            }}>
            <DateBox>
              <McText body5 color={COLORS.black} 
              style={{opacity: 0.5,
                      letterSpacing: 2
                    }}>
                {moment(item.startingTime).format('MMM').toUpperCase()}
              </McText>
              <McText h2 color={COLORS.black}>
                {moment(item.startingTime).format('DD')}
              </McText>
            </DateBox>
          </View>
            <GrayBox>
              
                <View style={{
                  marginLeft: 20,
                  marginBottom: 10,
                  marginTop: 5,
                  //backgroundColor: COLORS.black
                }}>
                  {/* <McText body5 style={{opacity: 0.5}}>{item.type}</McText> */}
                  <McText h2>{item.title}</McText>
                </View>
              
            </GrayBox>
          </ImageBackground>
          </LinearGradient>
          </LinearGradient>
        </View>

      </TouchableWithoutFeedback>

    )
  }

  const _renderList = (heading, dataset) => {
    return (
      <View>
        <SectionTitle>
          <McText h3>
            {heading}
          </McText>
        </SectionTitle>
        <View>
          <FlatList
            horizontal
            contentContainerStyle={{}}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => 'event_' + item.id}
            //data={dummyData[dataset]}
            data={dataset}
            renderItem={_renderItem}
          ></FlatList>
        </View>
      </View>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Header here */}
      <SectionHeader>
        <View>
          <McText h1>Explore events</McText>
        </View>
        <TouchableWithoutFeedback
        onPress={()=>{
          navigation.navigate('Interests')
        }}>
          <McIcon source ={icons.tab_4} size={28}/>
        </TouchableWithoutFeedback>
      </SectionHeader>
      <TouchableOpacity
          onPress={() =>{
            navigation.navigate('Search');
          }}
          >
        <SectionSearch>
          <SearchView>
            <McIcon source={icons.search} size={24}/>
            <Srch>
              <McText h4 color={COLORS.gray1}>Search</McText>
            </Srch>
            {/* <TextInput
              placeholder='Search'
              placeholderTextColor={COLORS.gray1}
              style={{
                ...FONTS.h4,
                color: COLORS.white,
                width: 250
              }}
            ></TextInput> */}
            <McIcon source={icons.filter} style = {{marginLeft : 168}}/>
          </SearchView>
        </SectionSearch> 
      </TouchableOpacity>
      {/* <Button
        onPress={() => {
          navigation.navigate('EventDetail');
        }}
        title="Go to Event Detail"
      /> */}
      <ScrollView style={styles.scrollView}>
      {_renderList("FEATURED", data)}
      {_renderList("ABTEST", data2)}
      </ScrollView>
      {/* <SectionTitle>
        <McText h5>FOR YOU</McText>
      </SectionTitle>  */}
    </SafeAreaView>
  );
};

const SectionTitle = styled.View`
  margin: 20px ${SIZES.padding};
  
`;

const DateBox = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  border-color: #000000;
  border-width: 1px;
  background-color: ${COLORS.white};
  align-items: center;
`;
//background-color: rgba(100,100,100,0.65);
const GrayBox = styled.View`
  background-color: rgba(100,100,100,0.65);
  border-radius: ${SIZES.radius};
  
`;
const SectionHeader = styled.View`
  background-color: ${COLORS.black};
  padding: 8px ${SIZES.padding};
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
//justify-content: space-between;
const SectionSearch = styled.View`
  margin: 4px ${SIZES.padding};
  height: 50px;
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
});

export default Featured;
