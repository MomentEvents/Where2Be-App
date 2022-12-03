import React, { useState, useEffect, useContext, Context } from "react";
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

import { dummyData, FONTS, SIZES, COLORS, icons, images } from "../../constants";
import ProgressLoader from "rn-progress-loader";
import events from "../../constants/events.json";
import { McText, McIcon, McAvatar} from "../../components";
import Fuse from "fuse.js";
import { Dimensions } from "react-native";
import SelectList from 'react-native-dropdown-select-list';
import { AuthContext } from '../../AuthContext';
import UsedServer from "../../constants/servercontants";
import registerForPushNotificationsAsync from "../../Services/Notifications";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export const CustomInput = ({value, setValue, placeholder, secureTextEntry}) =>{
	return(
    <SectionInput>
      <TextInput
        value={value}
        onChangeText={setValue}
        //onBlur={onBlur}
        placeholderTextColor={COLORS.gray1}
        placeholder = {placeholder}
        secureTextEntry={secureTextEntry}
        style={{
            ...FONTS.h4,
            color: COLORS.white,
            marginLeft: 12,
        }}
      />
    
    </SectionInput>	
  )
};

function validateEmail(test) {
  const expression =
    /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  return expression.test(String(test).toLowerCase());
}
//datas = events
const Signup = ({ navigation, route }) => {
  const [username, setusernm] = useState("");
  const [password, setpass] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [error, seterror] = useState(false);
  const [emailErr, setemailErr] = useState(false);
  const [ServerErr, setServerErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [school, setSchool] = useState("");
  const [errors, seterrors] = useState({name:false, username:false, password:false, email:false, school:false})
  const {loginTok} = useContext(AuthContext);
  const schlist = [
    {key:'UIUC', value: 'UIUC'},
    {key:'UCSD', value: 'UCSD'}
  ];

  const usersignup = async () => {
    setLoading(true);
    seterror(false);
    setemailErr(false);
    setServerErr(false);
    //seterrors({name:false, username:false, password:false, email:false})
    let temperrors = {name:false, username:false, password:false, email:false, school:false}
    let erry = false;
    let udata = {};
    if(username == "" || username.match(/^[0-9A-Za-z]+$/) === null){
      erry = true;
      temperrors.username=true;
    }
    if(password == ""){
      erry = true;
      temperrors.password=true;
    }
    if(school == ""){
      erry = true;
      temperrors.school=true;
    }
    if(name == "" || name.match(/^[0-9A-Za-z]/) === null){
      erry = true;
      temperrors.name=true;
    }
    if(email == "" || !validateEmail(email)){
      erry = true;
      temperrors.email=true;
    }
    console.log(temperrors);
    //console.log('school: ',school);
   //erry = true;
    if(erry == false){
      try {
        const resp = await fetch(UsedServer + "/create_user", {
          //10.0.2.2:8080
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
            name: name,
            email: email,
            school: "univ_"+school,
          }),
        });
        const result = await resp.json();
        udata = result;
        console.log(result);
        if(udata.error){
          erry = true;
          if(udata.error == "userid"){
            seterror(true);
          }else if(udata.error == "email"){
            setemailErr(true);
          }else{
            setemailErr(true);
            seterror(true);
          }
        }
        else if (udata.name){
          setData(result);
          registerForPushNotificationsAsync(udata.username);
        }else{
          erry = true;
          setServerErr(true);
        }
        
      } catch (err) {
        seterror(true);
        console.log("ERRROR");
        console.log('error is: ',err);
        erry = true;
      } finally {
        trylogin(erry, udata);
      }
    } 
    
    seterrors(temperrors);
    setLoading(false);
    //return userdata
  };
  const trylogin = (erry, udata) =>{
    if(erry == false){
      loginTok(udata);
      //navigation.navigate('Interests')
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
        <McText h1>Create Account</McText>
      </SectionHeader>
      <View>
        {ServerErr && <McText style={{color: "#cc0000",}}> {" "} Server is down, please try again later </McText>}
      </View>
      <CustomInput
        value= {name}
        setValue={setname}
        placeholder ="Display Name"
      />
      <View>
        {errors.name && (
          <McText style={{color: "#cc0000",}}>
            {" "}
            Please enter a name
          </McText>
        )}
      </View>
      <CustomInput
        value= {username}
        setValue={setusernm}
        placeholder ="Username"
      />
      <View>
        {error
        ? <McText style={{color: "#cc0000",}}> {" "} Username already taken, try a different one</McText>
        : errors.username && <McText style={{color: "#cc0000",}}> {" "} Please enter a valid Username </McText>
        }
      </View>
      <CustomInput
        value= {email}
        setValue={setemail}
        placeholder ="Email"
      />
      <View>
        {emailErr
        ?<McText style={{color: "#cc0000",}}> {" "} Email already in use, try a different one</McText>
        :errors.email && (
          <McText style={{color: "#cc0000",}}>
            {" "}
            Please enter a valid email
          </McText>
        )}
      </View>
      <CustomInput
        value= {password}
        setValue={setpass}
        placeholder ="Password"
        secureTextEntry 
      />
      <View>
        {errors.password && (
          <McText style={{color: "#cc0000",}}>
            {" "}
            Please enter a password
          </McText>
        )}
      </View>
      <SelectList
        placeholder = "Select School"
        data = {schlist}
        search = {false}
        setSelected = {setSchool}
        //onSelect={() => alert(school)}
        maxHeight = {100}
        dropdownTextStyles ={{
          ...FONTS.h4,
          color: COLORS.white,
          marginLeft: 12,
        }}
        inputStyles = {{
          ...FONTS.h4,
          color: COLORS.white,
          marginLeft: 12,
        }}
        boxStyles = {{
          margin: 4,
          height: 50,
          width: width * 0.65,
          backgroundColor: COLORS.input,
          borderRadius: 15,
          justifyContent: 'center',
        }}
        dropdownStyles = {{
          margin: 4,
          height: 50,
          width: width * 0.65,
          //backgroundColor: COLORS.input,
          borderRadius: 15,
        }}
        //dropdownItemStyles = {{backgroundColor: COLORS.input}}
      />
      {errors.school && (
          <McText style={{color: "#cc0000",}}>
            {" "}
            Please select a school
          </McText>
        )}
        
        <TouchableOpacity style={styles.button}
          onPress={() => {
            console.log("logging in");
            console.log(usersignup());
          }}
        >
          <McText h4>Create Account</McText>
        </TouchableOpacity>
      <View>
        <McText h4>Or</McText>
      </View>
        <TouchableOpacity style={styles.button}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <McText h4>Already have an account? Login</McText>
        </TouchableOpacity>
    </SafeAreaView>
  );
};
const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: ${Platform.OS === "ios" ? "40px" : "20px"};
  width: ${width*0.65};
  margin: 20px;

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
const SectionInput = styled.View`
  margin: 4px;
  height: 50px;
  width: 65%;
  background-color: ${COLORS.input};
  border-radius: 15px;
  justify-content: center;
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

export default Signup;
