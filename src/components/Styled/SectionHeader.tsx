import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../constants/theme";
import { McText } from ".";

type sectionHeaderProps = {
  leftButtonSVG?: any;
  leftButtonOnClick?: () => void;
  title: string;
  rightButtonSVG?: any;
  rightButtonOnClick?: () => void;
  hideBottomUnderline?: boolean;
  style?;
};
const SectionHeader = (props: sectionHeaderProps) => {
  const headerHeight = SIZES.sectionHeaderHeight;
  return (
    <View
      style={{
        height: headerHeight,
        paddingHorizontal: 20,
        paddingVertical: 6,
        alignItems: "center",
        flexDirection: "row",
        borderBottomWidth: props.hideBottomUnderline
          ? 0
          : StyleSheet.hairlineWidth,
        borderColor: COLORS.gray2,
        backgroundColor: "transparent",
        ...props.style
      }}
    >
      {props.leftButtonSVG && props.leftButtonOnClick ? (
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => props.leftButtonOnClick()}
        >
          {props.leftButtonSVG}
        </TouchableOpacity>
      ) : null}
      <McText numberOfLines={1} h2 style={{ flex: 1 }}>
        {props.title}
      </McText>
      {props.rightButtonSVG && props.rightButtonOnClick ? (
        <TouchableOpacity
          style={{ alignContent: "flex-end" }}
          onPress={() => props.rightButtonOnClick()}
        >
          {props.rightButtonSVG}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({});
