import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../constants/theme";
import { McText } from ".";
import icons from "../../constants/Icons";

type sectionHeaderProps = {
  leftButtonSVG?: any;
  leftButtonOnClick?: () => void;
  title: string;
  rightButtonSVG?: any;
  rightButtonOnClick?: () => void;
};
const SectionHeader = (props: sectionHeaderProps) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 5,
        alignItems: "center",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: COLORS.gray2,
        backgroundColor: COLORS.black,
      }}
    >
      {props.leftButtonSVG && props.leftButtonOnClick? (
        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => props.leftButtonOnClick()}>
          {props.leftButtonSVG}
        </TouchableOpacity>
      ) : null}
      <McText h1 style={{ flex: 1 }}>
        {props.title}
      </McText>
      {props.rightButtonSVG && props.rightButtonOnClick ? (
        <TouchableOpacity style={{ alignContent: "flex-end" }} onPress={() => props.rightButtonOnClick()}>
          {props.rightButtonSVG}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({});
