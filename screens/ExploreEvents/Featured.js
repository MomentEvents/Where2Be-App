//import React from 'react';
import React, { useState, useEffect, useContext } from "react";
import {
  TouchableHighlight,
  Platform,
  Text,
  View,
  RefreshControl,
  StyleSheet,
  ScrollView,
  Button,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import styled from "styled-components/native";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import EventCard from "../../components/EventCard";

import { dummyData, FONTS, SIZES, COLORS, icons as Icons, images } from "../../constants";
import { McText, McIcon, McAvatar } from "../../components";
import { TouchableOpacity } from "react-native-gesture-handler";
import "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { AuthContext } from "../../Contexts/AuthContext";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

import * as SplashScreen from "expo-splash-screen";
import UsedServer from "../../constants/servercontants";

// import React from 'react';
// import { Text, View, StyleSheet, Button } from 'react-native';
const Featured = ({ navigation, route }) => {
  const [category_feat, setcategory_feat] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const {
    UserId,
    setupData,
    Data,
    RefreshD,
    FinImport,
    refreshFeat,
    Headers,
    MData,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  // const [type, setType] = useState("Instagram");
  var type = "Instagram";
  var type2 = "Discord";

  const fetchData = async () => {
    console.log("collecting featured data");
    refreshFeat();
    const resp2 = await fetch(UsedServer + `/spotlight`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserId: UserId,
      }),
    });
    const data2 = await resp2.json();
    console.log("got featured data");
    // setData2(data2);
    setupData([data2], 0);
    console.log("got spotlight");
    const resp = await fetch(UsedServer + `/feat`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserId: UserId,
      }),
    });
    const data = await resp.json();

    // setData(data);
    setupData(data, 1);
    // console.log(data);
    setRefreshing(false);

    console.log("got feature");

    // const resp3 = await fetch(UsedServer + `/feat_orgs`, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     UserId: UserId,
    //   })
    // });
    // const data3 = await resp3.json();
    // setData3(data3)

    // const resp4 = await fetch(UsedServer + `/categories`, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     UserId: UserId,
    //   })
    // });
    // const data4 = await resp4.json();
    // setData4(data4)

    const resp5 = await fetch(UsedServer + `/categories_feat`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserId: UserId,
      }),
    });
    const category_feat = await resp5.json();
    // setcategory_feat(category_feat);
    setupData(category_feat, 2);
    console.log("starting 6");
    const resp6 = await fetch(UsedServer + `/personal_cal_future`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserId: UserId,
      }),
    });
    const pcal1 = await resp6.json();
    console.log("starting 7");
    const resp7 = await fetch(UsedServer + `/personal_cal_past`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserId: UserId,
      }),
    });
    const pcal2 = await resp7.json();
    // console.log(pcal2);
    setupData([pcal1, pcal2], 3);
    // console.log(Headers,MData);
    setLoading(false);
  };

  // var ab = 0;

  useEffect(() => {
    fetchData();
  }, [type, type2]);

  var type_arr = ["Discord", "Instagram"];

  const change_names = () => {
    type = type_arr[1];
    //console.log(data[0].id);
    // ab = data[0].type;
  };

  change_names();
  // console.log(ab);
  // for (var i = 0; i < numrows; i++) {
  //     rows.push(ObjectRow());
  // }
  // return tbody(rows);

  const _renderOrgs = ({ item, index }) => {
    return (
      <View
        style={{
          marginHorizontal: 6,
        }}
      >
        <TouchableHighlight
          onPress={() => {
            navigation.navigate("OrganizationDetail", { OrgID: item.uniqueID });
          }}
          style={{
            borderRadius: 20,
          }}
        >
          <View
            style={{
              width: SIZES.width / 3,
            }}
          >
            <View style={styles.org}>
              <Image
                source={{ uri: item.image }}
                resizeMode="cover"
                borderRadius={SIZES.radius}
                borderColor={COLORS.gray}
                borderWidth={0.2} // string not number typeError
                style={styles.userProfilePic}
              />
              {/* <GrayBox> */}
              {/* </GrayBox> */}
              <View
                style={{
                  marginHorizontal: 10,
                  marginBottom: 10,
                }}
              >
                <McText h4 numberOfLines={1} style={{}}>
                  {item.title}
                </McText>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  const _renderCategories = ({ item, index }) => {
    SplashScreen.hideAsync();
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            navigation.navigate("InterestDetail", {
              selectedInterest: item.name,
            });
          }}
          style={styles.category}
        >
          <View
            style={{
              width: width / 3.3,
              height: height / 25,
              alignItems: "center",
            }}
          >
            <McText h3>{item.name}</McText>
            <McText
              body4
              style={{
                opacity: 0.7,
              }}
            >
              {item.event_count} Events
            </McText>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  const _renderSpotlight = ({ item, index }) => {
    return (
      <View
        style={{
          margin: 16,
        }}
      >
        <TouchableHighlight
          onPress={() => {
            navigation.navigate("EventDetail", { selectedEvent: item });
          }}
          style={{
            borderRadius: 20,
            margin: -8,
          }}
        >
          <ImageBackground
            source={{ uri: item.image }}
            resizeMode="cover"
            borderRadius={SIZES.radius}
            borderColor={COLORS.gray1}
            borderWidth={0.3} // string not number typeError
            style={{
              width: SIZES.width / 1.15,
              height: SIZES.width / 1.9 + 10,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                alignItems: "flex-end",
                marginHorizontal: 8,
                marginVertical: 8,
              }}
            ></View>
            <View>
              <LinearGradient
                colors={["transparent", COLORS.black]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: 0,
                  borderRadius: 20,
                  height: SIZES.height / 6,
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    width: SIZES.width / 1.2,
                    position: "absolute",
                    bottom: 8,
                    left: 12,
                  }}
                >
                  <McText h1 numberOfLines={2}>
                    {item.title}
                  </McText>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <McText
                      h3
                      style={{
                        color: COLORS.white,
                        opacity: 0.8,
                        marginTop: 4,
                        letterSpacing: 1.2,
                        marginRight: 4,
                      }}
                    >
                      {moment(item.startingTime).format("MMM DD").toUpperCase()}
                    </McText>
                    <McText
                      h3
                      style={{
                        color: COLORS.purple,
                        opacity: 0.9,
                        marginTop: 4,
                        letterSpacing: 1.2,
                      }}
                    >
                      {moment(item.startingTime)
                        .format("hh:mm A")
                        .toUpperCase()}
                    </McText>
                    <View
                      style={{
                        flexDirection: "row",
                        position: "absolute",
                        right: 0,
                      }}
                    >
                      <McIcon
                        source={Icons.check}
                        size={20}
                        style={{
                          tintColor: item.joined
                            ? COLORS.purple
                            : COLORS.lightGray,
                          marginRight: 10,
                        }}
                      />
                      <McText
                        body7
                        style={{
                          marginTop: 2,
                          marginLeft: -7,
                          marginRight: 10,
                          color: item.joined ? COLORS.purple : COLORS.lightGray,
                        }}
                      >
                        {item.num_joins}
                      </McText>
                      <McIcon
                        source={Icons.shoutout}
                        size={20}
                        style={{
                          tintColor: item.shouted
                            ? COLORS.purple
                            : COLORS.lightGray,
                          marginRight: 10,
                        }}
                      />
                      <McText
                        body7
                        style={{
                          marginTop: 2,
                          marginLeft: -7,
                          marginRight: 10,
                          color: item.shouted
                            ? COLORS.purple
                            : COLORS.lightGray,
                        }}
                      >
                        {item.num_shouts}
                      </McText>
                    </View>
                  </View>
                  {/* <TouchableHighlight style={{
                      width: 32,
                      height: 32,
                      borderRadius: 80,
                      marginLeft: 10,
                      backgroundColor: COLORS.input,
                      borderWidth: 1,
                      borderColor: COLORS.white,
                      justifyContent: 'center',
                      alignItems: 'center'
                      }} onPress={()=>{
                console.log("like " + item.title)
              }}>
                <McIcon source={icons.like} size={18} style={{
              tintColor:COLORS.white,
            }}/>
            </TouchableHighlight>
            <TouchableHighlight style={{
                      width: 32,
                      height: 32,
                      borderRadius: 80,
                      marginLeft: 10,
                      backgroundColor: COLORS.input,
                      borderWidth: 1,
                      borderColor: COLORS.white,
                      justifyContent: 'center',
                      alignItems: 'center'
                      }} onPress={()=>{
                console.log("join " + item.title)
              }}>
                <McIcon source={icons.check} size={20} style={{
              tintColor:COLORS.white,
            }}/>
            </TouchableHighlight>
            <TouchableHighlight style={{
                      width: 32,
                      height: 32,
                      borderRadius: 80,
                      marginLeft: 10,
                      backgroundColor: COLORS.input,
                      borderWidth: 1,
                      borderColor: COLORS.white,
                      justifyContent: 'center',
                      alignItems: 'center'
                      }} onPress={()=>{
                console.log("shoutout " + item.title)
              }}>
                <McIcon source={icons.shoutout} size={18} style={{
              tintColor:COLORS.white,
            }}/>
            </TouchableHighlight> */}
                </View>
              </LinearGradient>
            </View>
          </ImageBackground>
        </TouchableHighlight>
      </View>
    );
  };

  const _renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          marginLeft: index === 0 ? 20 : 15,
        }}
      >
        <TouchableHighlight
          onPress={() => {
            navigation.navigate("EventDetail", { selectedEvent: item });
          }}
          style={{
            borderRadius: 20,
          }}
        >
          <ImageBackground
            source={{ uri: item.image }}
            resizeMode="cover"
            borderRadius={SIZES.radius}
            borderColor={COLORS.gray}
            borderWidth={0.3} // string not number typeError
            style={{
              width: SIZES.width / 2.5 + 10,
              height: SIZES.width / 1.9 + 10,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                marginVertical: 8,
                marginHorizontal: 8,
                alignItems: "flex-end",
              }}
            >
              <View style={{ flexDirection: "row" }}></View>
            </View>
            <LinearGradient
              colors={["transparent", COLORS.trueBlack]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 0.9 }}
              style={{ padding: 0, borderRadius: 20, height: SIZES.height / 7 }}
            >
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  width: SIZES.width / 2.7,
                  position: "absolute",
                  bottom: 8,
                  left: 12,
                }}
              >
                <McText h3 numberOfLines={2}>
                  {item.title}
                </McText>
                <McText
                  body3
                  style={{
                    marginTop: -2,
                    color: COLORS.white,
                    opacity: 0.8,
                  }}
                >
                  {moment(item.startingTime).format("MMM DD h:mm A")}
                </McText>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <McIcon
                    source={Icons.check}
                    size={20}
                    style={{
                      tintColor: item.joined ? COLORS.purple : COLORS.lightGray,
                      marginRight: 10,
                    }}
                  />
                  <McText
                    body7
                    style={{
                      marginTop: 2,
                      marginLeft: -7,
                      marginRight: 10,
                      color: item.joined ? COLORS.purple : COLORS.lightGray,
                    }}
                  >
                    {item.num_joins}
                  </McText>
                  <McIcon
                    source={Icons.shoutout}
                    size={20}
                    style={{
                      tintColor: item.shouted
                        ? COLORS.purple
                        : COLORS.lightGray,
                      marginRight: 10,
                    }}
                  />
                  <McText
                    body7
                    style={{
                      marginTop: 2,
                      marginLeft: -7,
                      marginRight: 10,
                      color: item.shouted ? COLORS.purple : COLORS.lightGray,
                    }}
                  >
                    {item.num_shouts}
                  </McText>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableHighlight>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
            <EventCard
        EventID={10}
        Title="No Title Set"
        Image="https://test-bucket-chirag5241.s3.us-west-1.amazonaws.com/test_image.jpeg"
        StartingDateTime={new Date()}
        Likes={69}
        Shoutouts={69}
        UserLiked={true}
        UserShouted={false}
      />
      <View style={styles.tempNav}>
        <SectionHeader>
          <View>
            <McText h1>
              <Text>Explore Events</Text>
            </McText>
          </View>

          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("Interests");
            }}
          >
            <McIcon
              source={Icons.tag}
              size={24}
              style={{
                tintColor: COLORS.gray,
                marginTop: 1,
              }}
            />
          </TouchableWithoutFeedback>
        </SectionHeader>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
      >
        <View>
          {MData[0] ? (
            <FlatList
              horizontal
              keyExtractor={(item) => "event_" + item.id}
              //data={dummyData[dataset]}
              data={Object.values(MData[0])}
              renderItem={_renderSpotlight}
              style={{
                marginTop: 8,
                marginBottom: -12,
                marginLeft: 6,
              }}
            ></FlatList>
          ) : (
            <Text>loadd....</Text>
          )}
        </View>
        {MData[1] ? (
          Object.values(MData)
            .slice(1, 3)
            .map(
              (sdata, idx) => (
                <View>
                  <SectionTitle>
                    <McText h3>
                      {sdata === null ? null : Headers[idx + 1]}
                    </McText>
                  </SectionTitle>
                  <View>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => "event_" + item.id}
                      //data={dummyData[dataset]}
                      data={sdata === null ? null : Object.values(sdata)}
                      renderItem={_renderItem}
                      extraData={RefreshD[idx + 1]}
                    ></FlatList>
                  </View>
                </View>
              )

              //{_renderList(sdata.header, sdata.data)}
            )
        ) : (
          <Text>loadd....</Text>
        )}
        {MData[3] ? (
          Data()
            .slice(3, 8)
            .map(
              (sdata, idx) => (
                <View>
                  <SectionTitle>
                    <McText h3>
                      {sdata === null ? null : Headers[idx + 3]}
                    </McText>
                  </SectionTitle>
                  <View>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => "event_" + item.id}
                      //data={dummyData[dataset]}
                      data={sdata === null ? null : Object.values(sdata)}
                      renderItem={_renderItem}
                    ></FlatList>
                  </View>
                </View>
              )

              //{_renderList(sdata.header, sdata.data)}
            )
        ) : (
          <Text>loading....</Text>
        )}
        <SectionFooter>
          <McText
            h1
            style={{
              //temp fix for padding
              color: "transparent",
            }}
          >
            hello
          </McText>
        </SectionFooter>
      </ScrollView>
      <SectionDone>
        {/* <LinearGradient
          colors={["#B66DFF", "#280292"]}
          style={{
            width: 60,
            height: 60,
            marginBottom: 60,
            borderRadius: 80,
          }}
        > */}
          <TouchableOpacity
            style={{
              width: 60,
              height: 60,
              marginBottom: 60,
              borderRadius: 80,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("CreateEvent");
              console.log("Chirag's an idiot");
            }}
          >
            <Icons.plusbutton
            width={70} height={70}>

            </Icons.plusbutton>
            {/* <McIcon
              source={icons.plus}
              size={44}
              style={{
                tintColor: COLORS.white,
              }}
            /> */}
          </TouchableOpacity>
        {/* </LinearGradient> */}
      </SectionDone>
      {/* <SectionTitle>
        <McText h5>FOR YOU</McText>
      </SectionTitle>  */}
    </SafeAreaView>
  );
};

const SectionTitle = styled.View`
  margin: 16px ${SIZES.padding};
  margintop: 20px;
`;

const DateBox = styled.View`
  width: 50;
  height: 50;
  border-radius: 15px;
  border-color: #000000;
  border-width: 1px;
  background-color: ${COLORS.white};
  align-items: center;
`;
//background-color: rgba(100,100,100,0.65);
const GrayBox = styled.View`
  background-color: rgba(100, 100, 100, 0.3);
  borderbottomrightradius: 20px;
  borderbottomleftradius: 20px;
`;

const SectionHeader = styled.View`
  background-color: transparent;
  padding: 16px ${SIZES.padding};
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const SectionDone = styled.View`
  flex: 1;
  position: absolute;
  bottom: 0;
  right: 1;
  backgroundcolor: transparent;
  margin: 32px;
`;

//temp fix for padding
const SectionFooter = styled.View`
  background-color: transparent;
  padding: 60px;
  justify-content: space-between;
`;
//justify-content: space-between;
const SectionSearch = styled.View`
  margin: 8px ${SIZES.padding};
  height: 50px;
  marginbottom: 12px;
  background-color: ${COLORS.input};
  border-radius: 15px;
  justify-content: center;
`;

const SearchView = styled.View`
  flex-direction: row;

  align-items: center;
  margin-left: 9px;
  margin-right: 15px;
`;
//background-color: ${COLORS.white};
const Srch = styled.View`
  margin-left: 0px;
  width: 100px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  grabox: {
    backgroundColor: "rgba(100,100,100,0.8)",
    borderRadius: SIZES.radius,
  },
  tempNav: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#282828",
    // borderRadius: 20
  },
  org: {
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.gray,
  },
  userProfilePic: {
    height: height / 11,
    width: height / 11,
    borderRadius: 300,
    margin: 12,
    marginBottom: 5,
    padding: 30,
    borderWidth: 1,
    borderColor: COLORS.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  category: {
    width: width / 2.5,
    height: height / 15,
    backgroundColor: COLORS.input,
    marginHorizontal: 6,
    marginBottom: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Featured;
