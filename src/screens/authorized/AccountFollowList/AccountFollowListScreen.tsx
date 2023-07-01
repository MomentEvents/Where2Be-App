import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import EventViewer from "../../../components/EventViewer/EventViewer";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { COLORS, SCREENS, icons } from "../../../constants";
import FollowList from "../../../components/FollowList/FollowList";
import { useNavigation } from "@react-navigation/native";
import { FOLLOW_LIST } from "../../../constants/components";

interface AccountFollowListParams {
  followType: string;
  userID: string;
}
const AccountFollowListScreen = ({ route }) => {
  const { followType, userID }: AccountFollowListParams = route.params;
  const navigation = useNavigation<any>();

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={followType === FOLLOW_LIST.Followers ? "Followers" : "Following"}
        leftButtonOnClick={() => {
          navigation.goBack();
        }}
        leftButtonSVG={<icons.backarrow />}
      />
      <FollowList followType={followType} userID={userID} />
    </MobileSafeView>
  );
};

export default AccountFollowListScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.trueBlack,
  },
});
