//import React from 'react';
import React, { useState, useEffect } from 'react';
import { TouchableHighlight , Platform, Text, View, StyleSheet, ScrollView, Button, SafeAreaView, TextInput, FlatList, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient'
import InterestSelector from '../components/InterestSelect';

import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';
import { McText, McIcon, McAvatar} from '../components'
import { TouchableOpacity } from 'react-native-gesture-handler';
import 'react-native-gesture-handler'
import { useRoute } from '@react-navigation/native';
import { Dimensions } from "react-native";
import DatePicker from 'react-native-date-picker'

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

import * as SplashScreen from 'expo-splash-screen';
const dummyTags = ['Academic',
  'Entertainment',
  'Community',
  'Career Development',
  'Athletics',
  'Other',
  'Recreation',]
const inTags = []
var outTags = []
// import React from 'react';
// import { Text, View, StyleSheet, Button } from 'react-native';
const CreateEvent = ({ navigation, route }) => {

  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  // console.log(ab);
  // for (var i = 0; i < numrows; i++) {
  //     rows.push(ObjectRow());
  // }
  // return tbody(rows);
  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.tempNav}>
      <SectionHeader>
      <TouchableOpacity 
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: -12,
                  marginTop: 4,
                }}
                onPress={() =>{
                  navigation.navigate('Featured');
                }}>
                <McIcon source={icons.close} style={{
                    tintColor: COLORS.white,
                    marginBottom: 4,
                    marginLeft: -8
                }} size={32}/>
                </TouchableOpacity>
          <McText h1>Create Event</McText>
          <View style={{
            position: 'absolute',
            right: 0,
          }}>
          <TouchableOpacity style={{
            marginRight: 15,
            marginTop: 5,
          }}>
            <McText h3 style={{
              color: COLORS.purple
            }}>Post</McText>
          </TouchableOpacity>
          </View>
      </SectionHeader>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <SectionInputs>
        <McText h3 style={{
          marginBottom: 16,
        }}>Image</McText>
          <TouchableOpacity style={{
            height: SIZES.height/4,
            width: SIZES.width * 0.75,
            backgroundColor: COLORS.black,
            borderRadius: 10,
            marginBottom: 8,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: COLORS.gray
          }}>
            <McIcon source={icons.addphoto} size={60} style={{
              margin:4,
              tintColor:COLORS.purple,
            }}/>
          </TouchableOpacity>
          <View style={{
            marginVertical: 8
          }}>
            <McText h3 style={{
              marginBottom: 8,
              }}>Title</McText>
            <SectionTextIn>
              <TextInput
                placeholder='Enter a short, descriptive title.'
                placeholderTextColor={COLORS.gray1}
                multiline={true}
                //onChange={handleOnSearch}
                //value={bad}
                style={{
                  ...FONTS.body3,
                  color: COLORS.white,
                  width: 250,
                  marginBottom: 5,
                  marginLeft: 5,
                  padding: 4,
                }}
              />
            </SectionTextIn>
          </View>
          <View style={{
            marginVertical: 8
          }}>
            <McText h3 style={{
              marginBottom: 8,
              }}>Description</McText>
            <SectionTextIn>
              <TextInput
                placeholder='Enter a description for your event.'
                placeholderTextColor={COLORS.gray1}
                //onChange={handleOnSearch}
                //value={bad}
                style={{
                  ...FONTS.body3,
                  color: COLORS.white,
                  marginBottom: 5,
                  marginLeft: 5,
                  padding: 4,
                }}
              />
            </SectionTextIn>
          </View>
          <View style={{
            marginVertical: 8
          }}>
            <McText h3 style={{
              marginBottom: 8,
              }}>Date</McText>
            <SectionTextIn>
            {/* <DatePicker date={date} mode={'date'} onDateChange={setDate}/> */}
            </SectionTextIn>
          </View>
          <View style={{
            marginVertical: 8
          }}>
            <McText h3 style={{
              marginBottom: 8,
              }}>Time</McText>
            <View style={{
              flexDirection: 'row',
            }}>
              <SectionTimings>
                <TextInput
                  placeholder='Start'
                  placeholderTextColor={COLORS.gray1}
                  //onChange={handleOnSearch}
                  //value={bad}
                  style={{
                    ...FONTS.body3,
                    color: COLORS.white,
                    width: 250,
                    marginBottom: 5,
                    marginLeft: 5,
                    padding: 4,
                  }}
                />
              </SectionTimings>
              <View style={{
                paddingLeft: SIZES.width/10,
              }}>
              <SectionTimings>
                <TextInput
                  placeholder='End'
                  placeholderTextColor={COLORS.gray1}
                  //onChange={handleOnSearch}
                  //value={bad}
                  style={{
                    ...FONTS.body3,
                    color: COLORS.white,
                    width: 250,
                    marginBottom: 5,
                    marginLeft: 5,
                    padding: 4,
                  }}
                />
              </SectionTimings>
              </View>
            </View>
          </View>
          <View style={{
            marginVertical: 8
          }}>
            <McText h3 style={{
              marginBottom: 8,
              }}>Location</McText>
            <SectionTextIn>
              <TextInput
                placeholder='Where will your event happen?'
                placeholderTextColor={COLORS.gray1}
                style={{
                  ...FONTS.body3,
                  color: COLORS.white,
                  width: 250,
                  marginBottom: 5,
                  marginLeft: 5,
                  padding: 4,
                }}
              />
            </SectionTextIn>
          </View>
          <View style={{
            marginVertical: 8
          }}>
            <McText h3 style={{
              marginBottom: 8,
              }}>Tags (select up to 2)</McText>

                    <FlatList data={dummyTags}
                    columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, marginTop: 1 }}
                    numColumns={4}
                    style={{
                        backgroundColor: 'transparent',
                    }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item, index})=>(
                        <InterestSelector text={item} wide={item.length} list={inTags} out={outTags}/>
                      )}
                    keyExtractor={(item) => `basicListEntry-${item}`}
                        />
          </View>
      </SectionInputs>
      </ScrollView>
      
      {/* <SectionTitle>
        <McText h5>FOR YOU</McText>
      </SectionTitle>  */}
      </SafeAreaView>
  );
};

const SectionHeader = styled.View`
  background-color: transparent;
  padding: 16px ${SIZES.padding};
  align-items: center;
  flex-direction: row;
`;

const SectionImage = styled.View`
  background-color: transparent;
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

const SectionInputs = styled.View`
  margin-left: 50;
  margin-vertical: 15;
`
const SectionTextIn = styled.View`
  background-color: ${COLORS.black};
  width: ${SIZES.width*0.76};
  border-radius: 10;
  justify-content: center;
  border: 2px;
  border-color: ${COLORS.gray};
  align-items: flex-start;
`
const SectionTimings = styled.View`
  background-color: ${COLORS.black};
  width: ${SIZES.width*0.33};
  border-radius: 10;
  justify-content: center;
  border: 2px;
  border-color: ${COLORS.gray};
`

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default CreateEvent;
