import React, { useState, Component, useEffect } from "react";
import {
  SectionList,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import styled from "styled-components/native";
import moment from "moment";

import { dummyData, FONTS, SIZES, COLORS, icons, images } from "../constants";
import events from "../constants/events.json";
import { McText } from "../components";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationHelpersContext } from "@react-navigation/native";

type InterestSelectorProps = {
  id: string;
  text: string;
  wide: number;
  interestMap: {
    [tag: string]: boolean;
  };
};

type InterestSelectorState = {
  toggle: boolean;
};
const InterestSelector = (props: InterestSelectorProps) => {
  const checkList = (list: { [tag: string]: boolean }, id: string) => {
    console.log("checkList for " + id + " evaluated " + list[id]);
    if (list[id]) {
      return true;
    }
  };

  const [toggle, setToggle] = useState<boolean>(
    checkList(props.interestMap, props.id)
  );

  const _onPress = () => {
    setToggle(!toggle);
    props.interestMap[props.id] = !props.interestMap[props.id];
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <TouchableOpacity
        onPress={() => {
          _onPress();
        }}
        style={{
          width: props.wide * 8 + 20,
          height: 32,
          borderRadius: 10,
          marginTop: 8,
          marginRight: 8,
          backgroundColor: checkList(props.interestMap, props.id) ? COLORS.purple : COLORS.input,
          opacity: 0.9,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <McText h5 style={{ letterSpacing: 0.4 }}>
          {props.text}
        </McText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default InterestSelector
