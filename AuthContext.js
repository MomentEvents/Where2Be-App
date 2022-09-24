import React, { useState, useEffect, Context, createContext } from 'react';

//import * as keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
  const [UserToken, setUserToken] = useState(null);
  const [loadingToken, setloadingToken] = useState(false);

  const loginTok = () =>{
    let usrToken = 'helpeg';
    setUserToken(usrToken);
    AsyncStorage.setItem('usrToken', usrToken);
    //keychain.setGenericPassword('helpeg', 'helpeg');
  }

  const logoutTok = () =>{
    setUserToken(null);
    AsyncStorage.removeItem('usrToken');
    //keychain.resetGenericPassword();
  }
  
  const testLog = () =>{
    console.log('test');
  }

  const isLoggedIn = async () =>{
    try{
      setloadingToken(true);
      //let usrToken = await keychain.getGenericPassword('helpeg');
      let usrToken = await AsyncStorage.getItem('usrToken');
      //console.log("usrToken", usrToken);
      setUserToken(usrToken);
      setloadingToken(false);
    }
    catch(e){
      console.log('isLogged in error', e);
    }
  }

    useEffect(()=>{
      isLoggedIn();
    }, []);

  return(
    <AuthContext.Provider value={{loginTok, logoutTok, UserToken, loadingToken}}>
      {children}
    </AuthContext.Provider>
  )
}