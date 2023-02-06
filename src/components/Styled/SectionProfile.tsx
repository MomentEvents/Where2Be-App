import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Touchable,
  Alert,
} from "react-native";
import React, { useContext } from "react";
import { COLORS, SCREENS, SIZES, User } from "../../constants";
import { McText } from "./styled";
import * as Navigator from "../../navigation/Navigator";
import { UserContext } from "../../contexts/UserContext";
import { ScreenContext } from "../../contexts/ScreenContext";
import { deleteUser } from "../../services/UserService";
import { displayError } from "../../helpers/helpers";

type SectionProfileProps = {
  user: User;
  canEditProfile: boolean;
};

const SectionProfile = (props: SectionProfileProps) => {
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
          </McText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <McText body3 style={styles.usernameContainer}>
            @{props.user.Username}
          </McText>
        </View>
        <TouchableOpacity
          onPress={() => {
            Navigator.navigate(SCREENS.EditProfile, {user: props.user, isSelf: true});
          }}
        >
          {props.canEditProfile && (
            <View style={styles.editProfileButtonContainer}>
              <McText h3>Edit Profile</McText>
            </View>
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
