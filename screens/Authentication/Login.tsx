import React, { useState, useEffect, Context, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  ImageBackground,
  TouchableWithoutFeedback,
  Image,
  Alert,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import moment from "moment";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import {
  dummyData,
  FONTS,
  SIZES,
  COLORS,
  icons,
  images,
} from "../../constants";
import ProgressLoader from "rn-progress-loader";
import events from "../../constants/events.json";
import { McText, McIcon, McAvatar } from "../../components";
import Fuse from "fuse.js";
import { Dimensions } from "react-native";
import { CustomInput } from "./Signup.js";
import { AuthContext } from "../../AuthContext";
import UsedServer from "../../constants/servercontants";
import registerForPushNotificationsAsync from "../../Services/NotificationService";
import { login } from "../../Services/AuthService";
import { User, getUserByEmail, getUserById } from "../../Services/UserService";
import { checkIfStringIsEmail } from "../../helpers/helpers";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

//datas = events
const Login = ({ navigation, route }) => {
  const [usercred, setusercred] = useState("");
  const [password, setpass] = useState("");
  const [error, seterror] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [ServerErr, setServerErr] = useState(false);
  const { loginTok } = useContext(AuthContext);

  const userlogin = async () => {
    setLoading(true);
    if(usercred == "" || password == ""){
      Alert.alert("Error", "Please enter valid fields")
      setLoading(false);
      return
    }
    const checkUser: User = {
      id: null,
      picture: null,
      name: null,
      email: null,
      password_hash: null,
      push_token: null,
    };
    
    if(checkIfStringIsEmail(usercred)){
      checkUser.email = usercred
      const emailResponse = await getUserByEmail(usercred)
      if(emailResponse == null){
        Alert.alert("Error", "No user found with inputted email")
        setLoading(false)
        return
      }
    }
    else{
      checkUser.id = usercred
      const idResponse = await getUserById(usercred)
      if(idResponse == null){
        Alert.alert("Error", "No user with inputted username")
        setLoading(false)
      }
    }
    const loginResponse = await login(checkUser);

    if(loginResponse == null){
      Alert.alert("Error", "Incorrect password")
    }

    

    // OLD CODE IS HERE
    // setLoading(true);
    // seterror(false);
    // setServerErr(false);
    // let udata = {};
    // let erry = false;
    // let username = ''
    // let email = ''
    // if(usercred == "" || password == ""){
    //   erry = true;
    //   setLoading(false);
    //   seterror(true);
    // }

    // else{
    //   if(validateEmail(usercred)){
    //     try {
    //       const resp = await fetch(UsedServer + "/email_login", {
    //         method: "POST",
    //         headers: {
    //           Accept: "application/json",
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           password: password,
    //           email: usercred,
    //         }),
    //       });
    //       const result = await resp.json();
    //       console.log(result);
    //       udata = result
    //       if (udata.name){
    //         setData(result);
    //         registerForPushNotificationsAsync(udata.username);
    //       }else if(udata.error){
    //         erry = true;
    //         seterror(true);
    //       }else{
    //         erry = true;
    //         setServerErr(true);
    //       }
    //       //setData(result);
    //     } catch (err) {
    //       setServerErr(true);
    //       console.log("ERRROR");
    //       console.log(err);

    //       erry = true;
    //     } finally {
    //       setLoading(false);
    //       trylogin(erry, udata);
    //     }
    //   }
    //   else{
    //     try {
    //       const resp = await fetch(UsedServer + "/user_login", {
    //         method: "POST",
    //         headers: {
    //           Accept: "application/json",
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           username: usercred,
    //           password: password,
    //         }),
    //       });
    //       const result = await resp.json();
    //       console.log(result);
    //       udata = result
    //       if (udata.name){
    //         setData(result);
    //         registerForPushNotificationsAsync(udata.username);
    //       }else if(udata.error){
    //         erry = true;
    //         seterror(true);
    //       }else{
    //         erry = true;
    //         setServerErr(true);
    //       }
    //       //setData(result);
    //     } catch (err) {
    //       setServerErr(true);
    //       console.log("ERRROR");
    //       console.log(err);

    //       erry = true;
    //     } finally {
    //       setLoading(false);
    //       trylogin(erry, udata);
    //     }
    //   }

    // }

    //return userdata
  };
  const trylogin = (erry, udata) => {
    if (erry == false) {
      //navigation.navigate('Interests')
      loginTok(udata);
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
      <View>
        {ServerErr && (
          <McText style={{ color: "#cc0000" }}>
            {" "}
            Server is down, please try again later{" "}
          </McText>
        )}
      </View>
      <CustomInput
        value={usercred}
        setValue={setusercred}
        placeholder="Username or Email"
        secureTextEntry={undefined}
      />

      <CustomInput
        value={password}
        setValue={setpass}
        placeholder="Password"
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
            Wrong Username/Email or Password
          </McText>
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
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
      <TouchableOpacity
        style={styles.button}
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
  width: ${width * 0.65};
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
  },
  button: {
    height: 50,
    width: width * 0.65,
    backgroundColor: COLORS.input,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 5,
  },
});

export default Login;
