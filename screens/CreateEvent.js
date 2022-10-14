//import React from 'react';
import React, { useState, useEffect } from "react";
import {
  TouchableHighlight,
  Platform,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  Alert,
  Modal,
  Pressable,
  Appearance,
  useColorScheme,
} from "react-native";
import styled from "styled-components/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import InterestSelector from "../components/InterestSelect";

import { dummyData, FONTS, SIZES, COLORS, icons, images } from "../constants";
import { McText, McIcon, McAvatar } from "../components";
import { TouchableOpacity } from "react-native-gesture-handler";
import "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import { Dimensions } from "react-native";
import DatePicker from "react-native-modern-datepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerPopup from "../components/DateTimePickerPopup/DateTimePickerPopup";
import ImagePickerComponent from "../components/ImagePickerComponent";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

import * as SplashScreen from "expo-splash-screen";
import { Colors } from "react-native/Libraries/NewAppScreen";
import PreviewEventDetail from "./PreviewEventDetail";
const dummyTags = [
  "Academic",
  "Entertainment",
  "Community",
  "Career Development",
  "Athletics",
  "Other",
  "Recreation",
];

const inTags = [];
var outTags = {};
function outDict(dict) {

  var outList = []
  for (const [key, value] of Object.entries(dict)) {
      if (value == true) {
          outList.push(key)
      }
  }
  return outList
 }

// import React from 'react';
// import { Text, View, StyleSheet, Button } from 'react-native';
const CreateEvent = ({ navigation, routenew }) => {
  const [title,setTitle] = useState(null)
  const [location,setLocation] = useState(null)
  const [image,setImage] = useState(null)
  const [date,setDate] = useState()
  const [desc, setDesc] = useState(null)
  const [start, setStart] = useState()
  const [end, setEnd] = useState()
  const [img, setImg] = useState()

  const handleSubmit = () => {
    console.log('Title: ' + title)
    console.log('Date: '+ date)
    console.log('Start: ' + start)
    console.log('End: ' + end)
    console.log('Desc: ' +desc)
    console.log('Loc: ' +location)
    var outList = outDict(outTags)
    console.log('Tags: ' + outList)
    console.log('Image: ', img)
    if(!img || !title || !date || !start || !end || !desc || !location){
      Alert.alert("Error", "Please fill in all the necessary fields.")
      return;
    }
    if(start >= end){
      Alert.alert("Error", "Please make the start time before the end time.")
      return;
    }
    if(outList.length == 0 || outList.lenghth > 2){
      Alert.alert("Error", "Please select up to 2 tags")
      return;
    }
    const out = {title: title, date: date, start: start, end: end, desc: desc, loc:location, tags: outList, image: img}
    navigation.navigate('PreviewEventDetail', {createEvent: out});
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tempNav}>
        <SectionHeader>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: -12,
              marginTop: 4,
            }}
            onPress={() => {
              navigation.navigate("Featured");
            }}
          >
            <McIcon
              source={icons.close}
              style={{
                tintColor: COLORS.white,
                marginBottom: 4,
                marginLeft: -8,
              }}
              size={32}
            />
          </TouchableOpacity>
          <McText h1>Create Event</McText>
          <View
            style={{
              position: "absolute",
              right: 0,
            }}
          >
            <TouchableOpacity
              style={{
                marginRight: 15,
                marginTop: 5,
              }}
              onPress={() =>{
                handleSubmit();
              }}
            >
              <McText
                h3
                style={{
                  color: COLORS.purple,
                }}
              >
                Next
              </McText>
            </TouchableOpacity>
          </View>
        </SectionHeader>
      </View>

      <KeyboardAwareScrollView>
        <SectionInputs>
          <McText
            h3
            style={{
              marginBottom: 16,
            }}
          >
            Image
          </McText>
          <View style={{alignItems:'center', marginLeft: -50}}>
          <ImagePickerComponent setImg={setImg}>
            image={image}  
            setImage={setImage}         
          </ImagePickerComponent>
          </View>
          <View
            style={{
              marginVertical: 8,
              
            }}
          >
            <McText
              h3
              style={{
                marginBottom: 8,
              }}
            >
              Title
            </McText>
            <SectionTextIn>
              <TextInput
                placeholder="Enter a short, descriptive title."
                placeholderTextColor={COLORS.gray1}
                value={title}
                onChangeText={setTitle}
                multiline={true}
                maxLength={100}
                style={{
                  ...FONTS.body3,
                  marginTop: 2,
                  color: COLORS.white,
                  padding: 10,
                }}
              />
            </SectionTextIn>
          </View>
          <View
            style={{
              marginVertical: 8,
            }}
          >
            <McText
              h3
              style={{
                marginBottom: 8,
              }}
            >
              Description
            </McText>
            <SectionTextIn>
              <TextInput
                placeholder="Enter a description for your event."
                placeholderTextColor={COLORS.gray1}
                multiline={true}
                maxLength={1000}
                value={desc}
                onChangeText={setDesc}
                //onChange={handleOnSearch}
                //value={bad}
                style={{
                  ...FONTS.body3,
                  marginTop: 2,
                  color: COLORS.white,
                  padding: 10,
                }}
              />
            </SectionTextIn>
          </View>
          <View
            style={{
              marginVertical: 8,
            }}
          >
            <McText
              h3
              style={{
                marginBottom: 8,
              }}
            >
              Date
            </McText>

              <DateTimePickerPopup setDate={setDate}
                mode="date"
                placeholderText="Pick a date."
                customStyles={{
                  ...FONTS.body3,
                  color: COLORS.white,
                  padding: 10,
                }}
              />
          </View>
          <View
            style={{
              marginVertical: 8,
            }}
          >
            <McText
              h3
              style={{
                marginBottom: 8,
              }}
            >
              Time
            </McText>
            <View
              style={{
                flexDirection: "row",
              }}
            >
                <DateTimePickerPopup setDate={setStart}
                  mode="time"
                  placeholderText="Start"
                  customStyles={{
                    ...FONTS.body3,
                    color: COLORS.white,
                    width: 250,
                    padding: 10,
                  }}
                />
              <View
                style={{
                  paddingLeft: SIZES.width / 10,
                }}
              >
                <DateTimePickerPopup setDate={setEnd}
                  mode="time"
                  placeholderText="End"
                  customStyles={{
                    ...FONTS.body3,
                    color: COLORS.white,
                    width: 250,
                    padding: 10,
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              marginVertical: 8,
            }}
          >
            <McText
              h3
              style={{
                marginBottom: 8,
              }}
            >
              Location
            </McText>
            <SectionTextIn>
              <TextInput
                placeholder="Where will your event happen?"
                placeholderTextColor={COLORS.gray1}
                maxLength={100}
                value={location}
                onChangeText={setLocation}
                style={{
                  ...FONTS.body3,
                  padding: 10,
                  color: COLORS.white,
                  width: 250,
                }}
              />
            </SectionTextIn>
          </View>
          <View
            style={{
              marginVertical: 8,
            }}
          >
            <McText
              h3
              style={{
                marginBottom: 8,
              }}
            >
              Tags (select up to 2)
            </McText>

            <FlatList
              data={dummyTags}
              columnWrapperStyle={{
                flexWrap: "wrap",
                flex: 1,
                marginTop: 1,
                marginRight: 10,
              }}
              numColumns={4}
              style={{
                backgroundColor: "transparent",
              }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <InterestSelector
                  text={item}
                  wide={item.length}
                  list={inTags}
                  out={outTags}
                />
              )}
              keyExtractor={(item) => `basicListEntry-${item}`}
            />
          </View>
        </SectionInputs>
      </KeyboardAwareScrollView>

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
`;
const SectionTextIn = styled.View`
  background-color: ${COLORS.black};
  width: ${SIZES.width * 0.76};
  border-radius: 10;
  justify-content: center;
  border: 2px;
  border-color: ${COLORS.gray};
  align-items: flex-start;
`;
const SectionTimings = styled.View`
  background-color: ${COLORS.black};
  width: ${SIZES.width * 0.33};
  border-radius: 10;
  justify-content: center;
  border: 2px;
  border-color: ${COLORS.gray};
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  grabox: {
    backgroundColor: "rgba(100,100,100,0.8)",
    borderRadius: SIZES.radius,
  },
  tempNav: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#282828",
    // borderRadius: 20
  },
  org: {
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.gray,
  },
  userProfilePic: {
    height: height / 11,
    width: height / 11,
    borderRadius: 300,
    margin: 12,
    marginBottom: 5,
    padding: 30,
    borderWidth: 1,
    borderColor: COLORS.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  category: {
    width: width / 2.5,
    height: height / 15,
    backgroundColor: COLORS.input,
    marginHorizontal: 6,
    marginBottom: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  MainContainer: {
    flex: 1,
    padding: 6,
    alignItems: "center",
    backgroundColor: "white",
  },

  text: {
    fontSize: 25,
    color: "red",
    padding: 3,
    marginBottom: 10,
    textAlign: "center",
  },

  // Style for iOS ONLY...
  datePicker: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: 320,
    height: 260,
    display: "flex",
    backgroundColor: "#161616",
    borderRadius: 14,
  },

  modalBackground: {
    backgroundColor: "#161616",
    borderRadius: 15,
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: COLORS.purple,
  },
});

export default CreateEvent;
