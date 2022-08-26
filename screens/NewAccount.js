import React, { useState, useEffect } from "react";
import {
  Text,
  DateBox,
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  ImageBackground,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import styled from "styled-components/native";
import moment from "moment";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import { dummyData, FONTS, SIZES, COLORS, icons, images } from "../constants";

import events from "../constants/events.json";
import { McText, McIcon, McAvatar } from "../components";
import Fuse from "fuse.js";
import { Dimensions } from "react-native";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


//datas = events
const NewAccount = ({ navigation, route }) => {
  const [username, setusernm] = useState("");
  const [password, setpass] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [error, seterror] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const createAccount = async () => {
    setLoading(true);
    seterror(false);
    let erry = false;
    try {
      const resp = await fetch("http://54.226.108.97:8080/create_user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          username: username,
          password: password,
        }),
      });
      const result = await resp.json();
      console.log(result);
      setData(result);
    } catch (err) {
      seterror(true);
      console.log("ERRROR");
      console.log(error);
      erry = true;
    } finally {
      setLoading(false);
      trylogin(erry);
    }
    //return userdata
  };
  const trylogin = (erry) =>{
    if(erry == false){
      navigation.navigate('Interests')
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader>
        <McText h1 style={{
          padding: 4
        }}>Welcome to</McText>
        <McText f0 style={{...FONTS.f0}}> Moment</McText>
      </SectionHeader>
      <SectionInput>
        <TextInput
          placeholder="Name"
          placeholderTextColor={COLORS.gray1}
          onChangeText={(newText) => setname(newText)}
          defaultValue={name}
          style={{
            ...FONTS.h4,
            color: COLORS.white,
            marginLeft: 12,
          }}
        ></TextInput>
      </SectionInput>
      <SectionInput>
        <TextInput
          placeholder="Email"
          placeholderTextColor={COLORS.gray1}
          onChangeText={(newText) => setemail(newText)}
          defaultValue={email}
          style={{
            ...FONTS.h4,
            color: COLORS.white,
            marginLeft: 12,
          }}
        ></TextInput>
      </SectionInput>
      <SectionInput>
        <TextInput
          placeholder="Username"
          placeholderTextColor={COLORS.gray1}
          onChangeText={(newText) => setusernm(newText)}
          defaultValue={username}
          style={{
            ...FONTS.h4,
            color: COLORS.white,
            marginLeft: 12,
          }}
        ></TextInput>
      </SectionInput>
      <SectionInput>
        <TextInput
          placeholder="Password"
          placeholderTextColor={COLORS.gray1}
          onChangeText={(newText) => setpass(newText)}
          defaultValue={password}
          secureTextEntry={true}
          style={{
            ...FONTS.h4,
            color: COLORS.white,
            marginLeft: 12,
          }}
        ></TextInput>
      </SectionInput>
      <View>
        {error && (
          <McText
            style={{
              color: "#cc0000",
            }}
          >
            {" "}
            Username already exists
          </McText>
        )}
      </View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 8,
      }}>
        <McText body4>Already have an account?</McText>
        <TouchableOpacity style={{
          marginHorizontal: 8,
        }}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <McText body4 style={{
            color: COLORS.blue
          }}>Log In!</McText>
        </TouchableOpacity>
      </View>
        <TouchableOpacity style={styles.button}
          onPress={() => {
            console.log("logging in");
            console.log(createAccount());
          }}>
          <McText h4>Create Account</McText>
        </TouchableOpacity>
    </SafeAreaView>
  );
};
const SectionHeader = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-top: ${Platform.OS === "ios" ? "40px" : "20px"};
  width: ${width*0.65};
  margin: 20px;

`;
const SectionInput = styled.View`
  margin: 4px;
  height: 50px;
  width: 65%;
  background-color: ${COLORS.input};
  border-radius: 15px;
  justify-content: center;
`;

const SectionButton = styled.View`
  margin-top: 10px;
  margin-bottom: 5px;
  height: 50px;
  width: 65%;
  background-color: ${COLORS.input};
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`;
const SearchView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 9px;
  margin-right: 9px;
`;

const SrchRes = styled.View`
  flex-direction: row;
  align-items: center;
  height: 40px;
`;

const TxtBox = styled.View``;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    justifyContent: "center",
    alignItems: "center",
  }, button: {
    height: 50,
    width: width*0.65,
    backgroundColor: COLORS.input,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 5,
  }
});

export default NewAccount;