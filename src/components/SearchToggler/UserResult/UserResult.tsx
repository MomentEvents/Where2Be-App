import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import React from "react";
import { COLORS, SCREENS, User } from "../../../constants";
import * as Navigator from "../../../navigation/Navigator";
import { McText } from "../../Styled";

type UserResultProps = {
  user: User;
};
const UserResult = (props: UserResultProps) => {
  const onUserPress = () => {
    Navigator.navigate(SCREENS.ProfileDetails, { user: props.user });
  };

  return (
    <View
      style={{
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginLeft:10,
        justifyContent: "center",
        backgroundColor: COLORS.black
      }}
    >
      <TouchableOpacity onPress={onUserPress}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              height: 70,
              width: 70,
              borderRadius: 50,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: COLORS.white,
            }}
            source={{ uri: props.user.Picture }}
          />
          <View
            style={{
              marginRight: 20,
              marginLeft: 15,
              flex: 1,
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
            <McText h3 numberOfLines={1}>
                {props.user.DisplayName}
            </McText>
            <McText b5 numberOfLines={1} style={{color: COLORS.gray}}>
                @{props.user.Username}
            </McText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default UserResult;

const styles = StyleSheet.create({});
