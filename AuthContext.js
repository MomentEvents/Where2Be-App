import React, { useState, useEffect, Context, createContext } from 'react';

//import * as keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import produce from 'immer';
import UsedServer from './constants/servercontants';
import registerForPushNotificationsAsync from './Services/Notifications';

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
  //const [UserToken, setUserToken] = useState(null);
  const [loadingToken, setloadingToken] = useState(false);
  const [UserId, setUserId] = useState(null);
  const [UserData, setUserData] = useState(null);

  // const [Choice_Dict, setChoice_Dict] = useState(null);
  const [Data0, setData0] = useState(null);
  const [Data1, setData1] = useState(null);
  const [Data2, setData2] = useState(null);
  const [Data3, setData3] = useState(null);
  const [Data4, setData4] = useState(null);
  const [Data5, setData5] = useState(null);
  const [Data6, setData6] = useState(null);
  const [Data7, setData7] = useState(null);
  const [Dict, setDict] = useState({});
  const [RefreshD, setRefreshD] = useState([]);
  const [FinImport, setFinImport] = useState([false, false, false]);

  const setupData = (data, nIn) =>{
    var dict = Dict;
    // var cdict = {};
    let newR = RefreshD;
    // let data = []
    let n = nIn;
    if(nIn == 2){
      n = 3
    }
    for(var l1 in data){
      // console.log('rows?:', typeof(l1), typeof(n));
      let row_num = parseInt(l1) + n
      // console.log('row_num?:', typeof(row_num))
      newR.push(false);
      for(var l2 in data[l1].data){
        let key = data[l1].data[l2].id;
        // let key = event.id;
        // dict[key] = [l1,l2];

        // cdict[key] = {joined : event.joined, shouted : event.shouted}
        if(!(key in dict)){
          dict[key] = []
        }
        dict[key].push([row_num,l2]);
        // console.log(l1,l2, data[l1].data[l2].id)
      }
      setData(data[l1], row_num);
    }
    //{/* Choice_Dict[item.id] */}
    setRefreshD(newR);
    
    setDict(dict);
    let t= FinImport;
    t[nIn] = true;
    setFinImport(t);
    // console.log(data)
    // setChoice_Dict(cdict);
    // console.log(cdict[8163].joined);


    // sdata.header
  }

  const Data = () =>{
    let array = []
    array.push(Data0)
    array.push(Data1)
    array.push(Data2)
    array.push(Data3)
    array.push(Data4)
    array.push(Data5)
    array.push(Data6)
    array.push(Data7)
    // console.log(array.slice(1,3))
    return array
  }

  const clearData = () =>{
    setData0(null);
    setData1(null);
    setData2(null);
    setData3(null);
    setData4(null);
    setData5(null);
    setData6(null);
    setData7(null);
    setDict({});
    setRefreshD([]);
    setFinImport([false, false, false]);
  }

  const setData = (data, n) =>{
    // console.log('setdata: ', n)
    if(n == 0){setData0(data)}
    else if(n == 1){setData1(data)}
    else if(n == 2){setData2(data)}
    else if(n == 3){setData3(data)}
    else if(n == 4){setData4(data)}
    else if(n == 5){setData5(data)}
    else if(n == 6){setData6(data)}
    else if(n == 7){setData7(data)}
  }

  const updateData =  (event) =>{
    // let new_dict = Choice_Dict;
    // new_dict[event.id] = {joined : event.joined, shouted : event.shouted};
    // setChoice_Dict(new_dict);

    // console.log(event);
    // const idx = Dict[event.id];
    // console.log(idx);
    // if(idx){
    //   let r = RefreshD;
    //   r[idx] = !r[idx];
    //   let newRow = Data1[idx[0]].data.slice()
    //   // console.log(newRow[idx[1]]);
    //   // console.log(event);
    //   newRow[idx[1]] = event
    //   // console.log('idx:', idx[0])
    //   const newArr = Data1.map((c,i)=>{
    //     // console.log(i)
    //     if(i == idx[0]){

    //       // console.log(newRow);
    //       return {header: c.header, data: newRow};
    //     }else{
    //       // console.log(c.header)
    //       return c;
    //     }
    //   });
    //   // console.log(newRow);
    //   console.log(r);
    //   setRefreshD(r);
    //   setData1(newArr);
    // }
    // else{
    //   console.log('index not found');
    // }

    
    if(event.id in Dict){
      const idxs = Dict[event.id];
      for(const idx of idxs){
        let r = RefreshD;
        r[idx[0]] = !r[idx[0]];
        // const newRow = produce(Data()[idx[0]].data, draft => {
        //   draft[idx[1]] = event
        // })
        const newRow = Data()[idx[0]]//.data.slice()
        // // [...Data()[idx[0]]]
        let eventsData = newRow.data.slice()
        eventsData[idx[1]] = event
        setData({header: Data()[idx[0]].header, data: eventsData}, idx[0])
        // console.log(r);
        setRefreshD(r);
        // setData1(newArr);
      }
    }
    else{
      console.log('index not found');
    }
    
  }

  const test = () => {
    console.log(Choice_Dict[8163]);
  }


  const loginTok = (udata) =>{
    //let Uid = 'helpeg';
    // registerForPushNotificationsAsync(udata.username);
    
    AsyncStorage.setItem('uid', udata.username);
    AsyncStorage.setItem('pass', udata.password);
    setUserId(udata.username);
    console.log('udata: ', udata);
    setUserData(udata);
    
    //keychain.setGenericPassword('helpeg', 'helpeg');
  }

  const logoutTok = () =>{
    setUserId(null);
    AsyncStorage.removeItem('uid');
    AsyncStorage.removeItem('pass');
    clearData();
    //keychain.resetGenericPassword();
  }
  

  const isLoggedIn = async () =>{
    try{
      setloadingToken(true);
      //let usrToken = await keychain.getGenericPassword('helpeg');
      let uid = await AsyncStorage.getItem('uid');
      let pass = await AsyncStorage.getItem('pass');
      const resp = await fetch(UsedServer + "/user_test", {
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
    <AuthContext.Provider value={{loginTok, logoutTok, UserId, loadingToken, 
      UserData, updateData, setupData, test, RefreshD, Data, FinImport}}>
      {children}
    </AuthContext.Provider>
  )
}