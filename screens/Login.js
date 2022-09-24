import React, { useState, useEffect, Context, useContext } from "react";
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
  Alert,
} from "react-native";
import styled from "styled-components/native";
import moment from "moment";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import { dummyData, FONTS, SIZES, COLORS, icons, images } from "../constants";
import ProgressLoader from "rn-progress-loader";
import events from "../constants/events.json";
import { McText, McIcon, McAvatar} from "../components";
import Fuse from "fuse.js";
import { Dimensions } from "react-native";
import {CustomInput} from "./Signup.js"
import { AuthContext } from '../AuthContext';


var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


//datas = events
const Login = ({ navigation, route }) => {
  const [username, setusernm] = useState("");
  const [password, setpass] = useState("");
  const [error, seterror] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const {loginTok} = useContext(AuthContext);

  const userlogin = async () => {
    setLoading(true);
    seterror(false);
    
    let erry = false;
    if(username == "" || password == ""){
      erry = true;
      setLoading(false);
      seterror(true);
    }
    else{
      try {
        const resp = await fetch("http://10.0.2.2:3000/user_login", {
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
    } 
  
    //return userdata
  };
  const trylogin = (erry) =>{
    if(erry == false){
      //navigation.navigate('Interests')
      loginTok()
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressLoader
        visible={loading}
        isModal={true}
        isHUD={true}
        hudColor={"#000000"}
        color={"#FFFFFF"}
      ></ProgressLoader>
      <SectionHeader>
        <McText h1>Welcome to Moment</McText>
      </SectionHeader>
      <CustomInput
        value= {username}
        setValue={setusernm}
        placeholder ="Username"
      />
      
      <CustomInput
        value= {password}
        setValue={setpass}
        placeholder ="Password"
        secureTextEntry 
      />
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
            console.log("logging in");
            console.log(userlogin());
          }}
        >
          <McText h4>Log In</McText>
        </TouchableOpacity>
      <View>
        <McText h4>Or</McText>
      </View>
        <TouchableOpacity style={styles.button}
          onPress={() => {
            navigation.navigate("Signup");
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