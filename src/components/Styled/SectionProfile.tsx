import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Touchable,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLORS, SCREENS, SIZES, User } from "../../constants";
import { McText } from "./styled";
import { UserContext } from "../../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FOLLOW_LIST } from "../../constants/components";
import { truncateNumber } from "../../helpers/helpers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { selectUserByID } from "../../redux/users/userSelectors";

type SectionProfileProps = {
  userID: string;
  canEditProfile: boolean;
  canFollow: boolean;
  showStatistics?: boolean;
};

const SectionProfile = (props: SectionProfileProps) => {
  const {
    clientFollowUser,
    clientUnfollowUser,
  } = useContext(UserContext);

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectUserByID(state, props.userID));
  const navigation = useNavigation<any>();
  const { userToken } = useContext(UserContext);

  if (!user) {
    return <></>;
  }

  return (
    <View style={styles.profileContainer}>
      <Image
        style={styles.imageContainer}
        source={{ uri: user?.Picture }}
      />
      <View style={styles.infoContainer}>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity disabled={true}>
            <McText numberOfLines={1} h4 style={{ textAlign: "center" }}>
              {truncateNumber(user?.NumEvents)}
            </McText>
            <McText numberOfLines={1} body6 style={{ textAlign: "center" }}>
              {user?.NumEvents === 1 ? "Event" : "Events"}
            </McText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.push(SCREENS.AccountFollowList, {
              followType: FOLLOW_LIST.Followers,
              userID: props.userID,
            })}
          >
            <McText numberOfLines={1} h4 style={{ textAlign: "center" }}>
              {truncateNumber(user?.NumFollowers)}
            </McText>
            <McText numberOfLines={1} body6 style={{ textAlign: "center" }}>
              {user?.NumFollowers === 1
                ? "Follower"
                : "Followers"}
            </McText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.push(SCREENS.AccountFollowList, {
              followType: FOLLOW_LIST.Following,
              userID: props.userID,
            })}
          >
            <McText numberOfLines={1} h4 style={{ textAlign: "center" }}>
              {truncateNumber(user?.NumFollowing)}
            </McText>
            <McText numberOfLines={1} body6 style={{ textAlign: "center" }}>
              {user?.NumFollowing === 1
                ? "Following"
                : "Following"}
            </McText>
          </TouchableOpacity>
        </View>
        <View style={{ marginRight: 50, flexDirection: "row" }}>
          <McText
            numberOfLines={1}
            ellipsizeMode="tail"
            h4
            style={styles.displayNameContainer}
          >
            {user?.DisplayName}
          </McText>
          {user?.VerifiedOrganization && (
            <View style={{ paddingLeft: 5 }}>
              <MaterialIcons name="verified" size={18} color={COLORS.purple} />
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.push(SCREENS.EditProfile, {
              user: user,
              isSelf: user?.UserID === userToken.UserID,
            });
          }}
        >
          {props.canEditProfile && (
            <View style={styles.editProfileButtonContainer}>
              <McText h4>Edit Profile</McText>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            user?.UserFollow
              ? clientUnfollowUser(user.UserID)
              : clientFollowUser(user.UserID);
          }}
          disabled={
            !user ||
            user.UserFollow ==
              null ||
            user.UserFollow ==
              undefined
          }
        >
          {props.canFollow &&
            (user?.UserID &&
            user?.UserFollow !==
              undefined &&
            user?.UserFollow !==
              null && (
              <View style={styles.editProfileButtonContainer}>
                {user?.UserFollow ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      style={{ marginRight: 5 }}
                      name="checkmark-sharp"
                      size={22}
                      color="white"
                    />
                    <McText h4>Following</McText>
                  </View>
                ) : (
                  <McText h4>Follow</McText>
                )}
              </View>
            ))}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SectionProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
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
    borderColor: COLORS.gray2,
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
    backgroundColor: COLORS.gray2,
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
