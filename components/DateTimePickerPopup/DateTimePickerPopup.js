//import React from 'react';
import React, { useState, useEffect, Component } from "react";
import {
  TouchableHighlight,
  Platform,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  Alert,
  Modal,
  Pressable,
  Appearance,
  useColorScheme,
} from "react-native";
import styled from "styled-components/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

import { dummyData, FONTS, SIZES, COLORS, icons, images } from "../../constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import { Dimensions } from "react-native";
import DatePicker from "./src/index";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class DateTimePickerPopup extends Component {
  constructor(props) {
    /*
     * Props:
     *
     * setDate state function
     * style passed in
     * mode passed in as a string
     *
     * */
    super(props);
    this.state = {
      date: this.props.date,
      modalVisible: false,
    };
  }
  render() {
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "#00000077",
            }}
          >
            {this.props.mode === "date" ? (
              <DatePicker
                current={this.state.date}
                onSelectedChange={(newDate) => {
                  this.setState({ modalVisible: false, date: newDate });
                  this.props.setDate(newDate);
                }}
                mode="calendar"
                onTimeChange={(newDate) => {
                  this.setState({ modalVisible: false, date: newDate });
                  this.props.setDate(newDate);
                }}
                options={{
                  backgroundColor: "#212121",
                  textHeaderColor: "#FFFFFF",
                  textDefaultColor: "#FFFFFF",
                  mainColor: "#777777",
                  textSecondaryColor: "#FFFFFF",
                  borderColor: "000000",
                }}
              ></DatePicker>
            ) : (
              <DatePicker
                onSelectedChange={(newDate) => {
                  this.setState({ modalVisible: false, date: newDate });
                  this.props.setDate(newDate);
                }}
                mode="time"
                current={this.state.date}
                onTimeChange={(newDate) => {
                  this.setState({ modalVisible: false, date: newDate });
                  this.props.setDate(newDate);
                }}
                options={{
                  backgroundColor: "#212121",
                  textHeaderColor: "#FFFFFF",
                  textDefaultColor: "#FFFFFF",
                  mainColor: "#777777",
                  textSecondaryColor: "#FFFFFF",
                  borderColor: "000000",
                }}
              ></DatePicker>
            )}
          </View>
        </Modal>
        {this.props.mode === "time" ? (
          <TouchableOpacity
          onPress={() => {
            this.setState({ modalVisible: true });
          }}
        >
          <SectionTimings>
            {this.state.date === undefined ? (
              <Text
                style={{
                  ...FONTS.body3,
                  color: COLORS.gray1,
                  marginTop: 3,
                  marginBottom: 3,
                  marginLeft: 5,
                  padding: 4,
                }}
              >
                {this.props.placeholderText}
              </Text>
            ) : (
              <Text style={this.props.customStyles}>{this.state.date}</Text>
            )}
          </SectionTimings>
        </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              this.setState({ modalVisible: true });
            }}
          >
            <SectionTextIn>
              {this.state.date === undefined ? (
                <Text
                  style={{
                    ...FONTS.body3,
                    color: COLORS.gray1,
                    marginTop: 3,
                    marginBottom: 3,
                    marginLeft: 5,
                    padding: 4,
                  }}
                >
                  {this.props.placeholderText}
                </Text>
              ) : (
                <Text style={this.props.customStyles}>{this.state.date}</Text>
              )}
            </SectionTextIn>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const SectionTextIn = styled.View`
  background-color: ${COLORS.black};
  width: ${SIZES.width * 0.76};
  border-radius: 10;
  justify-content: center;
  border: 2px;
  border-color: ${COLORS.gray};
  align-items: flex-start;
`;
const SectionTimings = styled.View`
  background-color: ${COLORS.black};
  width: ${SIZES.width * 0.33};
  border-radius: 10;
  justify-content: center;
  border: 2px;
  border-color: ${COLORS.gray};
`;

export default DateTimePickerPopup;
