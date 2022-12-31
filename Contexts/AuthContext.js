import React, { useState, useEffect, Context, createContext } from "react";

//import * as keychain from 'react-native-keychain';
import AsyncStorage from "@react-native-async-storage/async-storage";
import produce from "immer";
import UsedServer from "../constants/servercontants";
import registerForPushNotificationsAsync from "../Services/NotificationService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //const [UserToken, setUserToken] = useState(null);
  const [loadingToken, setloadingToken] = useState(false);
  const [UserId, setUserId] = useState(null);
  const [UserData, setUserData] = useState(null);
  const [UserSchool, setUserSchool] = useState(null);
  const [MData, setMData] = useState({});
  const [Headers, setHeaders] = useState({});
  const [PCalendar, setPCalendar] = useState(null);
  const [Dict, setDict] = useState({});
  const [RefreshD, setRefreshD] = useState([]);
  const [FinImport, setFinImport] = useState([false, false, false, false]);

  const setupData = (data, nIn) => {
    var dict = Dict;
    // var cdict = {};
    let newR = RefreshD;
    // let data = []
    let n = nIn;
    if (nIn == 2) {
      n = 3;
    }
    if (nIn == 3) {
      n = 8;
    }
    for (var l1 in data) {
      // console.log('rows?:', typeof(l1), typeof(n));
      let row_num = parseInt(l1) + n;
      // if(nIn == 0){
      //   console.log(row_num, l1);
      // }
      // console.log('row_num?:', typeof(row_num))
      newR.push(false);
      let data_row = [];
      if (data[l1].data) {
        data_row = data[l1].data;
      } else {
        data_row = data[l1];
      }
      for (var l2 in data_row) {
        let col_num = parseInt(l2);
        let key = data_row[l2].id;
        // let key = event.id;
        // dict[key] = [l1,l2];

        // cdict[key] = {joined : event.joined, shouted : event.shouted}
        if (!(key in dict)) {
          dict[key] = [];
          dict[key].push([row_num, col_num]);
        } else {
          if (!dict[key].includes([row_num, col_num])) {
            dict[key].push([row_num, col_num]);
          }
        }
        // console.log(nIn, row_num, col_num);

        // console.log(l1,l2, data[l1].data[l2].id)
      }
      setData(data[l1], row_num);
    }
    //{/* Choice_Dict[item.id] */}
    setRefreshD(newR);
    // console.log('dict: ', dict)
    setDict(dict);
    let t = FinImport;
    t[nIn] = true;
    setFinImport(t);
    // console.log(FinImport);
  };

  const Data = () => {
    return Object.values(MData);
    //   let array = []
    //   array.push(Data0)
    //   array.push(Data1)
    //   array.push(Data2)
    //   array.push(Data3)
    //   array.push(Data4)
    //   array.push(Data5)
    //   array.push(Data6)
    //   array.push(Data7)
    //   array.push(PCalendar)
    //   // console.log(array.slice(1,3))
    //   return array
  };

  const clearData = () => {
    // setData0(null);
    // setData1(null);
    // setData2(null);
    // setData3(null);
    // setData4(null);
    // setData5(null);
    // setData6(null);
    // setData7(null);
    // setPCalendar(null);
    setMData({});
    setHeaders({});
    setDict({});
    setRefreshD([]);
    setFinImport([false, false, false]);
  };

  const setData = (data, n) => {
    // console.log('setdata: ', n)
    // if(n == 0){setData0(data)}
    // else if(n == 1){setData1(data)}
    // else if(n == 2){setData2(data)}
    // else if(n == 3){setData3(data)}
    // else if(n == 4){setData4(data)}
    // else if(n == 5){setData5(data)}
    // else if(n == 6){setData6(data)}
    // else if(n == 7){setData7(data)}
    // else if(n == 8){setPCalendar(data)}
    // console.log(n);
    if (data.data) {
      // console.log(n, data.header)
      setHeaders((prevH) => ({ ...prevH, [n]: data.header }));
      setMData((prevD) => ({ ...prevD, [n]: { ...data.data } }));
    } else {
      setHeaders((prevH) => ({ ...prevH, [n]: "" }));
      setMData((prevD) => ({ ...prevD, [n]: { ...data } }));
    }
    // console.log(n, Headers);
    // Object.assign
    // console.log(Headers);
  };

  const updateData = (event) => {
    console.log("start");
    if (event.id in Dict) {
      const idxs = Dict[event.id];
      // console.log(idxs, event.id)
      for (const idx of idxs) {
        let r = RefreshD;
        r[idx[0]] = !r[idx[0]];

        if (MData[idx[0]][idx[1]].id == event.id) {
          setMData({
            ...MData,
            [idx[0]]: {
              ...MData[idx[0]],
              [idx[1]]: event,
            },
          });
        }

        // const newRow = Data()[idx[0]]//.data.slice()
        // // // [...Data()[idx[0]]]
        // let eventsData= [];

        // if(newRow.data){
        //   eventsData = newRow.data.slice();
        //   if(eventsData[idx[1]].id == event.id){
        //     eventsData[idx[1]] = event
        //     setData({header: Data()[idx[0]].header, data: eventsData}, idx[0])
        //   }
        // }else{
        //   eventsData = newRow.slice();
        //   if(eventsData[idx[1]].id == event.id){
        //     eventsData[idx[1]] = event
        //     setData(eventsData, idx[0])
        //   }
        // }

        // console.log(r);
        setRefreshD(r);
        // setData1(newArr);
      }
      console.log("finish");
    } else {
      console.log("index not found");
    }
  };

  // const test = () => {
  //   console.log(Choice_Dict[8163]);
  // }

  const refreshFeat = () => {
    setDict({});
  };

  // const refreshPCal = () =>{
  //   for(var ev in PCalendar){
  //     let arr = Dict[PCalendar[ev].id];
  //     var index = arr.indexOf([8, parseInt(ev)]);
  //     if (index > -1) {
  //       arr.splice(index, 1);
  //     }
  //     setDict({...Dict,
  //       [PCalendar[ev].id] : arr
  //     })
  //   }
  // }

  const loginTok = (udata) => {
    //let Uid = 'helpeg';
    // registerForPushNotificationsAsync(udata.username);

    AsyncStorage.setItem("uid", udata.username);
    AsyncStorage.setItem("pass", udata.password);
    setUserId(udata.username);
    setUserSchool(udata.school);
    console.log("udata: ", udata);
    setUserData(udata);

    //keychain.setGenericPassword('helpeg', 'helpeg');
  };

  const logoutTok = () => {
    console.log(UserId);
    setUserId(null);
    console.log(UserId);
    setUserSchool(null);
    setUserData(null);
    AsyncStorage.removeItem("uid");
    AsyncStorage.removeItem("pass");
    clearData();
    //keychain.resetGenericPassword();
  };

  const isLoggedIn = async () => {
    try {
      setloadingToken(true);
      //let usrToken = await keychain.getGenericPassword('helpeg');
      let uid = await AsyncStorage.getItem("uid");
      let pass = await AsyncStorage.getItem("pass");
      // console.log('starting loading in', UsedServer)
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
      setUserSchool(result.school);
      setUserId(uid);
      // console.log('done loading in')
    } catch (e) {
      console.log("isLogged in error", e);
      logoutTok();
    } finally {
      setloadingToken(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loginTok,
        logoutTok,
        UserId,
        loadingToken,
        Headers,
        MData,
        UserData,
        updateData,
        setupData,
        RefreshD,
        Data,
        FinImport,
        refreshFeat,
        UserSchool,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
