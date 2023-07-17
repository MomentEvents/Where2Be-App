import { useState } from "react";
import { SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, Interest } from "../../../constants";
import { McText } from "../../Styled";

type InterestButtonProps = {
  tag: Interest;
  selectedInterests: Set<Interest>;
  setSelectedInterests: React.Dispatch<React.SetStateAction<Set<Interest>>>;
};

const InterestButton = (props: InterestButtonProps) => {
  const isSelected = Array.from(props.selectedInterests).some(
    (item) => item.InterestID === props.tag.InterestID
  );

  const _onPress = () => {
    if (isSelected) {
      props.setSelectedInterests(new Set());
    } else {
      props.setSelectedInterests(new Set([props.tag]));
    }
  };

  return (
    <TouchableOpacity
      onPress={_onPress}
      style={{
        height: 32,
        borderRadius: 5,
        marginVertical: 4,
        marginHorizontal: 4,
        paddingHorizontal: 10,
        opacity: 0.9,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isSelected
          ? COLORS.purple
          : COLORS.input,
      }}
    >
      <McText h5 style={{ letterSpacing: 0.4 }}>
        {props.tag.Name}
      </McText>
    </TouchableOpacity>
  );
};

export default InterestButton;