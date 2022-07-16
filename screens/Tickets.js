import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, ScrollView, Button, SafeAreaView, TextInput, FlatList, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient'
//import { BlurView } from '@react-native-community/blur';

import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';
import { McText, McIcon, McAvatar} from '../components'
import { TouchableOpacity } from 'react-native-gesture-handler';

const Tickets = ({ params }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
                colors = {['#000000','#302070']}
                start = {{x: 0.6, y: 0.7}}
                end = {{ x: 1, y: 1}}
                style = {{padding:2, borderRadius: 20 }}>
      {/* Header here */}
      <SectionHeader>
        <View>
          <McText h1>Feed</McText>
        </View>
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
      
      {/* <SectionTitle>
        <McText h5>FOR YOU</McText>
      </SectionTitle>  */}
      </LinearGradient>
    </SafeAreaView>
  )
};


const SectionTitle = styled.View`
  margin: 15px ${SIZES.padding};
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
  border-radius: ${SIZES.radius};
`;
const SectionHeader = styled.View`
  background-color: transparent;
  padding: 8px ${SIZES.padding};
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
const SectionFooter = styled.View`
  background-color: transparent;
  padding: 30px ${SIZES.padding};
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
});

export default Tickets;
