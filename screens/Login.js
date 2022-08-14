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
const Login = ({ navigation, route }) => {
  const [username, setusernm] = useState("");
  const [password, setpass] = useState("");
  const [error, seterror] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const userlogin = async () => {
    setLoading(true);
    seterror(false);
    try {
      const resp = await fetch("http://mighty-chamber-83878.herokuapp.com/user_login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      // if(!resp.ok){
      //   throw new Error('bad smth');
      // }
      const result = await resp.json();
      console.log(result);
      setData(result);
    } catch (err) {
      seterror(true);
      console.log("ERRROR");
    } finally {
      setLoading(false);
    }
    //return userdata
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader>
        <McText h1>Welcome to Moment</McText>
      </SectionHeader>
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
            Wrong Username or Password
          </McText>
        )}
      </View>
        <TouchableOpacity style={styles.button}
          onPress={() => {
            navigation.navigate("Featured");
          }}
        >
          <McText h4>Straight to feature lmao</McText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
          onPress={() => {
            console.log("logging in");
            console.log(userlogin());
            navigation.navigate('Interests')
          }}
        >
          <McText h4>Log In</McText>
        </TouchableOpacity>
      <View>
        <McText h4>Or</McText>
      </View>
        <TouchableOpacity style={styles.button}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <McText h4>Create A New Account</McText>
        </TouchableOpacity>
    </SafeAreaView>
  );
};
const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: flex-start;
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

export default Login;