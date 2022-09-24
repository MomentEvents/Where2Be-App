import React, { useState, useEffect } from 'react';
import {Platform, Text, DateBox, View, StyleSheet, SafeAreaView, TextInput, FlatList, ImageBackground, TouchableWithoutFeedback, Image } from 'react-native';
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
  const resp = await fetch('http://3.136.67.161:8080/search_org', {
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
        'name',
      ]
    });

    const [text, setText] = useState('');
    //const [bad, setQuery] = useState('');
    const results = fuse.search(text);
    const sResults = results.map(result => result.item);
   return (
     <SafeAreaView style={styles.container}>
      <View style={{
        flexDirection:'row',
        justifyContent: 'space-between'
      }}>
        <TouchableOpacity
          onPress={() =>{
            navigation.goBack();
          }}
          style={{
            marginTop: 18,
            marginRight: 20,
          }}
          >
          <McIcon source={icons.back_arrow} style={{
                  tintColor: COLORS.white,
                }} size={24}/>
          </TouchableOpacity>
      <SectionSearch>
        <SearchView>
        <McIcon source={icons.search} style={{
                  tintColor: COLORS.white,
                  marginRight: 8,
                  marginLeft: 4
                }} size={24}/>
          <TextInput
            placeholder='Search'
            placeholderTextColor={COLORS.gray1}
            //onChange={handleOnSearch}
            //value={bad}
            onChangeText={newText => setText(newText)}
            defaultValue={text}
            autoFocus={true}
            style={{
              ...FONTS.h4,
              color: COLORS.white,
              width: 250,
              marginLeft: 5
            }}
          />
        </SearchView>
      </SectionSearch> 
      </View>
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
                  navigation.push('OrganizationDetail', {OrgID: res?.OrgID});
                }}
              >
                <SrchRes>
                  <Image
                  source={{uri: res.image}}
                  style = {styles.userProfilePic}
                  />
                  <TxtBox>
                    <McText h4
                    style={{
                      //opacity: 0.5, 
                      letterSpacing: 1, 
                      marginLeft: 10,
                      //marginTop: 5,
                    }}
                    >{res.name}</McText>
                    {/* <McText body6 
                    style={{
                      opacity: 0.5, 
                      letterSpacing: 1, 
                      marginLeft: 10,
                    }}
                    ></McText> */}
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
  marginLeft: -6;
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
  },userProfilePic: {
    height: 40,
    width: 40,
    borderRadius: 300,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
 
 export default Search;
 