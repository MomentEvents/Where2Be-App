import React, { useState, useEffect, useContext } from 'react';
import {Platform, Text, DateBox, Dimensions, View, StyleSheet, SafeAreaView, TextInput, FlatList, ImageBackground, TouchableWithoutFeedback, Image } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';


import events from '../constants/events.json'
import { McText, McIcon, McAvatar} from '../components'
import Fuse from 'fuse.js'
import UsedServer from '../constants/servercontants';
import { AuthContext } from '../AuthContext';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


 //datas = events
 const Search = ({ navigation, route }) => {
  const [dataOrg, setDataOrg] = useState([]);
  const [dataEvent, setDataEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(true);
  const {UserId} = useContext(AuthContext)
  const fetchData = async () => {
    const resp1 = await fetch(UsedServer + '/search_org', {
      method: 'GET', 
    });
    const data1 = await resp1.json();
    setDataOrg(data1);
    const resp2 = await fetch(UsedServer + '/search_events', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        UserId: UserId,
      })
    });
    const data2 = await resp2.json();
    console.log('got data events')
    setDataEvent(data2);
    setLoading(false);
  };

  // var ab = 0;

  useEffect(() => {
    fetchData();
  },[]);
 

  const fuseOrg = new Fuse(dataOrg, {
    keys: [
      'id',
      'name',
    ]
  });
  const fuseEvent = new Fuse(dataEvent, {
    keys: [
      'title',
      'location',
    ]
  });

    const [text, setText] = useState('');
    //const [bad, setQuery] = useState('');
    const resultsOrg = fuseOrg.search(text);
    const resultsEvent = fuseEvent.search(text);
    const sResultsOrg = resultsOrg.map(result => result.item);
    const sResultsEvent =  resultsEvent.map(result => result.item);

    const _renderOrgs = ({item, index}) => {
      return(
        <View>
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
              navigation.push('OrganizationDetail', {OrgID: item.OrgID});
            }}
          >
            <SrchRes>
              <Image
              source={{uri: item.image}}
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
                >{item.name}</McText>
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
        </View>
      )
    }
    const _renderEvent = ({item, index}) =>{
      return(
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
            navigation.navigate('EventDetail', {selectedEvent: item});
          }}
        >
          <SrchRes>
            <Image
            source={{uri: item.image}}
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
              >{item.title}</McText>
              <McText body6 
              style={{
                opacity: 0.5, 
                letterSpacing: 1, 
                marginLeft: 10,
              }}
              >{moment(item.startingTime).format('MMMM Do YYYY, h:mm a').toUpperCase()}</McText>
            </TxtBox>
          </SrchRes>
        </TouchableOpacity>
      )
    }

   return (
     <SafeAreaView style={styles.container}>
      <View style={{
        flexDirection:'row',
      }}>
        {/* <TouchableOpacity
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
          </TouchableOpacity> */}
      <SectionSearch>
        <SearchView>
        <McIcon source={icons.search} style={{
                  tintColor: COLORS.white,
                  marginRight: 8,
                  marginLeft: 8
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
      <ButtonBox>
        <TouchableOpacity
          style = {{
            width: width /2.3,
            height: 38,
            backgroundColor: tab ? COLORS.purple : COLORS.gray,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 15,
            marginLeft: 15,
            marginRight: 7
          }}
          onPress={() => {
            setTab(true);
          }}
        ><McText h3>Upcoming Events</McText>
          </TouchableOpacity>
        <TouchableOpacity
        style = {{
          width: width /2.3,
          height: 38,
          backgroundColor: tab ? COLORS.gray: COLORS.purple,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 15,
          marginLeft: 7,
          marginRight: 15
        }}
          onPress={() => {
            setTab(false);
          }}
          >
            <McText h3>Accounts</McText>
          </TouchableOpacity>
      </ButtonBox>
      <View >
       {tab? <FlatList
          vertical
          data = {sResultsOrg}
          renderItem = {_renderOrgs}
          initialNumToRender = {4}
          style={{
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 20,
          }}
        />
        :<FlatList
          vertical
          data = {sResultsEvent}
          renderItem = {_renderEvent}
          initialNumToRender = {4}
          style={{
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 20,
          }}
        />}
      </View>
      <SectionFooter><McText h1 style={{
        //temp fix for padding
        color:'transparent'
      }}>hello</McText>
      </SectionFooter>
       

     </SafeAreaView>
   );
 };

 const ButtonBox = styled.View`
background-color: transparent;
flex-direction: row;
align-items: center;
justify-content: space-between;
`
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
  margin-top: 15px;
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
const SectionFooter = styled.View`
  background-color: transparent;
  padding: 28px;
  justify-content: space-between;
`;

const TxtBox = styled.View`

`

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'flex-start',
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
 