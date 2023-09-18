import { StyleSheet, Text, TouchableOpacity, Image, View, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLORS, SCREENS, User } from "../../constants";
import { McText } from "../Styled";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { UserContext } from "../../contexts/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { selectUserByID } from "../../redux/users/userSelectors";

type UserResultProps = {
  user: User;
};
const UserResult = (props: UserResultProps) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const onUserPress = () => {
    navigation.push(SCREENS.ProfileDetails, { userID: props.user.UserID });
  };

  const [isUserImageLoaded, setUserImageLoaded] = useState(false);

  const handleUserImageLoad = () => {
    setUserImageLoaded(true);
  };

  return (
    <View
      style={{
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginLeft: 10,
        justifyContent: "center",
      }}
    >
      <TouchableOpacity onPress={onUserPress}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={styles.userProfilePic}
            source={{ uri: props.user?.Picture }}
            onLoad={handleUserImageLoad}
          />
          {!isUserImageLoaded && (
            <ActivityIndicator size="small" color={COLORS.white} style={[styles.userProfilePic, {position: 'absolute'}]}/>
          )}
          <View
            style={{
              marginRight: 30,
              marginLeft: 15,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <McText h3 numberOfLines={1}>
                {props.user?.DisplayName}
              </McText>
              {props.user?.VerifiedOrganization && (
                <View style={{ paddingLeft: 3 }}>
                  <MaterialIcons
                    name="verified"
                    size={18}
                    color={COLORS.purple}
                  />
                </View>
              )}
            </View>
            <McText body5 numberOfLines={1} style={{ color: COLORS.gray }}>
              @{props.user?.Username}
            </McText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default UserResult;

const styles = StyleSheet.create({
  userProfilePic: {
    height: 70,
    width: 70,
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.gray2,
  }
});
