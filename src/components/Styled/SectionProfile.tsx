import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Touchable,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { COLORS, SCREENS, SIZES, User } from "../../constants";
import { McText } from "./styled";
import { UserContext } from "../../contexts/UserContext";
import { ScreenContext } from "../../contexts/ScreenContext";
import { deleteUser } from "../../services/UserService";
import { displayError } from "../../helpers/helpers";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

type SectionProfileProps = {
  user: User;
  canEditProfile: boolean;
  canFollow: boolean;
};

const SectionProfile = (props: SectionProfileProps) => {
  const {
    userIDToUser,
    updateUserIDToUser,
    clientFollowUser,
    clientUnfollowUser,
  } = useContext(UserContext);
  const navigation = useNavigation<any>();
  const { userToken } = useContext(UserContext);
  return (
    <View style={styles.profileContainer}>
      <Image
        style={styles.imageContainer}
        source={{ uri: props.user.Picture }}
      />
      <View style={styles.infoContainer}>
        <View style={{ flexDirection: "row" }}>
          <McText h3 style={styles.displayNameContainer}>
            {props.user.DisplayName}
            {props.user.VerifiedOrganization && (
              <View style={{ paddingLeft: 3 }}>
                <MaterialIcons
                  name="verified"
                  size={18}
                  color={COLORS.purple}
                />
              </View>
            )}
          </McText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <McText body3 style={styles.usernameContainer}>
            @{props.user.Username}
          </McText>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(SCREENS.EditProfile, {
              user: props.user,
              isSelf: props.user.UserID === userToken.UserID,
            });
          }}
        >
          {props.canEditProfile && (
            <View style={styles.editProfileButtonContainer}>
              <McText h3>Edit Profile</McText>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            userIDToUser[props.user.UserID].UserFollow
              ? clientUnfollowUser(props.user.UserID)
              : clientFollowUser(props.user.UserID);
          }}
          disabled={
            !userIDToUser[props.user.UserID] &&
            (userIDToUser[props.user.UserID].UserFollow == null ||
              userIDToUser[props.user.UserID].UserFollow == undefined)
          }
        >
          {props.canFollow &&
          (userIDToUser[props.user.UserID] &&
          (userIDToUser[props.user.UserID].UserFollow !== undefined &&
            userIDToUser[props.user.UserID].UserFollow !== null) ? (
            <View style={styles.editProfileButtonContainer}>
              {userIDToUser[props.user.UserID].UserFollow ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name="checkmark-sharp"
                    size={22}
                    color="white"
                  />
                  <McText h3>Following</McText>
                </View>
              ) : (
                <McText h3>Follow</McText>
              )}
            </View>
          ) : (
            <View style={styles.loadingFollowButton}>
              <McText h3>Loading</McText>
            </View>)
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SectionProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  profileContainer: {
    backgroundColor: COLORS.trueBlack,
    flexDirection: "row",
  },
  imageContainer: {
    height: 90,
    width: 90,
    borderRadius: 90,
    borderWidth: 1,
    marginTop: 15,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
    borderColor: COLORS.white,
  },
  infoContainer: {
    paddingTop: 15,
    marginRight: 20,
    flex: 1,
    flexWrap: "wrap",
  },
  displayNameContainer: {},
  usernameContainer: {
    marginTop: 1,
  },
  buttonToggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.trueBlack,
  },
  toggleButton: {
    width: SIZES.width * 0.5,
    height: 40,
  },
  editProfileButtonContainer: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
    width: SIZES.width - 170,
    backgroundColor: COLORS.gray1,
  },
  loadingFollowButton: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
    width: SIZES.width - 170,
    backgroundColor: COLORS.black,
    borderWidth: 3,
    borderColor: COLORS.lightGray,
  },
  nukeProfileButtonContainer: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
    width: SIZES.width - 170,
    backgroundColor: COLORS.red,
  },
});
