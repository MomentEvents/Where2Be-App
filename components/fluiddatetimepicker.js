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
import InterestSelector from "../components/InterestSelect";

import { dummyData, FONTS, SIZES, COLORS, icons, images } from "../constants";
import { McText, McIcon, McAvatar } from "../components";
import { TouchableOpacity } from "react-native-gesture-handler";
import "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import { Dimensions } from "react-native";
import DatePicker from "react-native-modern-datepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FluidDateTimePicker from "../components/fluiddatetimepicker";

class DateTimePickerPopup extends Component {
  constructor(props) {
    /*
     * Props:
     *
     * setDate state function
     * style passed in
     *
     * */
    super(props);
    this.state = {
      date: undefined,
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
          <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#00000077"}}>
            <DatePicker
              onSelectedChange={(newDate) => {
                this.setState({ modalVisible: false, date: newDate });
              }}
              mode="calendar"
              options={{
                backgroundColor: "#090C08",
                textHeaderColor: "#8221fc",
                textDefaultColor: "#8221fc",
                mainColor: "#777777",
                textSecondaryColor: "#FFFFFF",
                borderColor: "000000",
              }}
            ></DatePicker>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => {
            this.setState({ modalVisible: true });
          }}
        >

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
                Pick a date
              </Text>
            ) : (
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
                {" "}
                {this.state.date}
              </Text>
            )}
        </TouchableOpacity>
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

export default DateTimePickerPopup;
