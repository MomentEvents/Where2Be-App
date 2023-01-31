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
    Navigator.navigate(SCREENS.ProfileDetails, { User: props.user });
  };

  return (
    <View
      style={{
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: "center",
      }}
    >
      <TouchableOpacity onPress={onUserPress}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              height: 70,
              width: 70,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: COLORS.white,
            }}
            source={{ uri: props.user.Picture }}
          />
          <View
            style={{
              marginRight: 20,
              marginLeft: 30,
              flex: 1,
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
            <McText h3>
                {props.user.Name}
            </McText>
            <McText b5>
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
