import React, { useState, useEffect, Context, createContext } from 'react';

//import * as keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
  //const [UserToken, setUserToken] = useState(null);
  const [loadingToken, setloadingToken] = useState(false);
  const [UserId, setUserId] = useState(null);
  const [UserData, setUserData] = useState(null)

  const loginTok = (udata) =>{
    //let Uid = 'helpeg';
    setUserId(udata.username);
    console.log('udata: ', udata);
    setUserData(udata);
    AsyncStorage.setItem('uid', udata.username);
    AsyncStorage.setItem('pass', udata.password);
    //keychain.setGenericPassword('helpeg', 'helpeg');
  }

  const logoutTok = () =>{
    setUserId(null);
    AsyncStorage.removeItem('uid');
    AsyncStorage.removeItem('pass');
    //keychain.resetGenericPassword();
  }
  

  const isLoggedIn = async () =>{
    try{
      setloadingToken(true);
      //let usrToken = await keychain.getGenericPassword('helpeg');
      let uid = await AsyncStorage.getItem('uid');
      let pass = await AsyncStorage.getItem('pass');
      const resp = await fetch("http://10.0.2.2:8080/user_test", {
        //10.0.2.2:8080
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          password: pass,
        }),
      });
      const result = await resp.json();
      console.log(result);
      //console.log("usrToken", usrToken);
      setUserData(result);
      setUserId(uid);
    }
    catch(e){
      console.log('isLogged in error', e);
      logoutTok();
    }
    finally{
      setloadingToken(false);
    }
  }

    useEffect(()=>{
      isLoggedIn();
    }, []);

  return(
    <AuthContext.Provider value={{loginTok, logoutTok, UserId, loadingToken, UserData}}>
      {children}
    </AuthContext.Provider>
  )
}