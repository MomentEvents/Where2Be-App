import React, { useState, useEffect } from 'react';
import { Text, DateBox, View, StyleSheet, SafeAreaView, TextInput, FlatList, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';

import events from '../constants/events.json'
import { McText, McIcon, McAvatar} from '../components'
import Fuse from 'fuse.js'

 //datas = events
 const Search = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
  const resp = await fetch('http://10.0.2.2:3000/search', {
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
        'type',
        'title',
        'startingTime',
      ]
    });

    const [text, setText] = useState('');
    //const [bad, setQuery] = useState('');
    const results = fuse.search(text);
    const sResults = results.map(result => result.item);

    
   return (
     <View style={styles.container}>
       {/* <SectionHeader>
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
      </SectionHeader> */}
      <SectionSearch>
        <SearchView>
          <TouchableOpacity
          onPress={() =>{
            navigation.goBack();
          }}
          >
          <McIcon source={icons.back_arrow} size={22}/>
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
          <McIcon source={icons.filter}/>
        </SearchView>
      </SectionSearch> 
      
      <ScrollView>
        
        {
            sResults.map((res)=>
              <TouchableOpacity
                style={{
                width: 80,
                height: 32,
                borderRadius: 10,
                marginRight: 10,
                backgroundColor: COLORS.input,
                justifyContent: 'center',
                alignItems: 'center'
                }}
              >
                <McText h6 style={{opacity: 0.5, letterSpacing: 1}}>{res.title}</McText>
              </TouchableOpacity>
              
            )
          }
      </ScrollView>
        {/* <ScrollView>
          {
            sResults.map((res)=>
              <TouchableOpacity
                style={{
                width: 80,
                height: 32,
                borderRadius: 10,
                marginRight: 10,
                backgroundColor: COLORS.input,
                justifyContent: 'center',
                alignItems: 'center'
                }}
              >
                <McText h6 style={{opacity: 0.5, letterSpacing: 1}}>{res.title}</McText>
              </TouchableOpacity>
              
            )
          }
        </ScrollView> */}
     </View>
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
 
 export default Search;
 