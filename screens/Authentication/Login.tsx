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

import { dummyData, FONTS, SIZES, COLORS, icons, images } from "../../constants";
import ProgressLoader from "rn-progress-loader";
import events from "../../constants/events.json";
import { McText, McIcon, McAvatar} from "../../components";
import Fuse from "fuse.js";
import { Dimensions } from "react-native";
import {CustomInput} from "./Signup.js"
import { AuthContext } from '../../AuthContext';
import UsedServer from "../../constants/servercontants";
import registerForPushNotificationsAsync from "../../Services/NotificationService";
import { login } from '../../Services/AuthService'
import { User } from "../../Services/UserService";


var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height


function validateEmail(test) {
  const expression =
    /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  return expression.test(String(test).toLowerCase());
}


//datas = events
const Login = ({ navigation, route }) => {
  const [usercred, setusercred] = useState("");
  const [password, setpass] = useState("");
  const [error, seterror] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [ServerErr, setServerErr] = useState(false);
  const {loginTok} = useContext(AuthContext);

  const userlogin = async () => {

    const checkUser: User = {
      id: 'string', // This is also a username
      picture: null,
      name: null,
      email: null,
      password_hash: null,
      push_token: null,
    }
    checkUser.id = 'hello'
    console.log("going to service")
    login(checkUser)
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
  const trylogin = (erry, udata) =>{
    if(erry == false){
      //navigation.navigate('Interests')
      loginTok(udata)
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
        {ServerErr && <McText style={{color: "#cc0000",}}> {" "} Server is down, please try again later </McText>}
      </View>
      <CustomInput
        value={usercred}
        setValue={setusercred}
        placeholder="Username or Email" secureTextEntry={undefined}      />
      
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
            Wrong Username/Email or Password
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