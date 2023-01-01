import React, { useState, Component } from "react";
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
    id: string,
    text: string,
    wide: number,
    interestMap: {
        [tag: string]: boolean;
    }
}

type InterestSelectorState = {
    toggle: boolean,
}
export default class InterestSelector extends Component<InterestSelectorProps, InterestSelectorState> {
  state = {
    toggle: this.checkList(this.props.interestMap, this.props.id),
  };

  checkList(list: {[tag: string]: boolean}, id: string) {
    if (list[id]) {
      return true;
    }
  }

  _onPress() {
    const newState = !this.state.toggle;
    this.setState({ toggle: newState });
    this.props.interestMap[this.props.id] = !this.props.interestMap[this.props.id]
  }

  render() {
    this.checkList(this.props.interestMap, this.props.id);
    const { toggle } = this.state;
    const colorVal = toggle ? COLORS.purple : COLORS.input;
    const inList = toggle ? false : true;

    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this._onPress();
          }}
          style={{
            width: this.props.wide * 8 + 20,
            height: 32,
            borderRadius: 10,
            marginTop: 8,
            marginRight: 8,
            backgroundColor: colorVal,
            opacity: 0.9,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <McText h5 style={{ letterSpacing: 0.4 }}>
            {this.props.text}
          </McText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
