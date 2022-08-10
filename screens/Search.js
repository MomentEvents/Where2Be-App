import React, { useState, useEffect } from 'react';
import {Platform, Text, DateBox, View, StyleSheet, SafeAreaView, TextInput, FlatList, ImageBackground, TouchableWithoutFeedback, Image } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';
import {Platform} from 'react-native'

import events from '../constants/events.json'
import { McText, McIcon, McAvatar} from '../components'
import Fuse from 'fuse.js'

 //datas = events
 const Search = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
  const resp = await fetch('http://mighty-chamber-83878.herokuapp.com/search', {
      method: 'GET',
    });

    console.log("here")
    const data = await resp.json();

    console.log(data);

    
    setData(data);
    setLoading(false);
  };

  // var ab = 0;

  useEffect(() => {
    fetchData();
  },[]);
 

  const fuse = new Fuse(data, {
      keys: [
        'id',
        'key',
        'title',
        'startingTime',
        'location',
        'tagList'
      ]
    });

    const [text, setText] = useState('');
    //const [bad, setQuery] = useState('');
    const results = fuse.search(text);
    const sResults = results.map(result => result.item);
   return (
     <SafeAreaView style={styles.container}>
      <SectionSearch>
        <SearchView>
          <TouchableOpacity
          onPress={() =>{
            navigation.goBack();
          }}
          >
          <McIcon source={icons.back_arrow} size={22} style={{
            margin: 4
          }}/>
          </TouchableOpacity>
          <TextInput
            placeholder='Search'
            placeholderTextColor={COLORS.gray1}
            //onChange={handleOnSearch}
            //value={bad}
            onChangeText={newText => setText(newText)}
            defaultValue={text}
            style={{
              ...FONTS.h4,
              color: COLORS.white,
              width: 250,
              marginLeft: 5
            }}
          ></TextInput>
        </SearchView>
      </SectionSearch> 
      <ScrollView>
        {
            sResults.map((res)=>
              <TouchableOpacity
                style={{
                width: SIZES.width -40,
                height: 50,
                //borderRadius: 10,
                marginRight: 10,
                marginLeft: 30,
                //backgroundColor: COLORS.input,
                justifyContent: 'center',
                // alignItems: 'center'
                }}
                onPress={()=>{
                  navigation.navigate('EventDetail', {selectedEvent: res});
                }}
              >
                <SrchRes>
                  <Image
                  source={{uri: res.image}}
                  style = {{
                    width:40,
                    height: 40,
                    borderRadius: 10,
                  }}
                  />
                  <TxtBox>
                    <McText h5 
                    style={{
                      //opacity: 0.5, 
                      letterSpacing: 1, 
                      marginLeft: 10,
                      //marginTop: 5,
                    }}
                    >{res.title}</McText>
                    <McText body6 
                    style={{
                      opacity: 0.5, 
                      letterSpacing: 1, 
                      marginLeft: 10,
                    }}
                    >{moment(res.startingTime).format('MMMM Do YYYY, h:mm a').toUpperCase()}</McText>
                  </TxtBox>
                </SrchRes>
              </TouchableOpacity>
              
            )
          }
      </ScrollView>

     </SafeAreaView>
   );
 };
 const SectionHeader = styled.View`
 flex-direction: row;
 justify-content: flex-start;
 margin-top: ${Platform.OS === 'ios'?'40px':'20px'};
 width: 100%
`;
const SectionSearch = styled.View`
  margin: 4px ${SIZES.padding};
  height: 50px;
  background-color: ${COLORS.input};
  border-radius: 15px;
  justify-content: center;
`;
const SearchView = styled.View`
flex-direction: row;
justify-content: space-between;
align-items: center;
margin-left: 9px;
margin-right: 15px;
`;

const SrchRes = styled.View`
flex-direction: row;
align-items: center;
height: 40px;
`

const TxtBox = styled.View`

`

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
 
 export default Search;
 