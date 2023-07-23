import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import UserResult from "../UserResult/UserResult";
import { FOLLOW_LIST } from "../../constants/components";
import { COLORS, User } from "../../constants";
import { getUserFollowers, getUserFollowing } from "../../services/UserService";
import { UserContext } from "../../contexts/UserContext";
import { CustomError } from "../../constants/error";
import { displayError, showBugReportPopup } from "../../helpers/helpers";
import RetryButton from "../RetryButton";
import { McText } from "../Styled";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertContext } from "../../contexts/AlertContext";

interface FollowListProps {
  followType: string;
  userID: string;
}
const FollowList = (props: FollowListProps) => {
  const { userToken } = useContext(UserContext);
  const { showErrorAlert } = useContext(AlertContext);

  const [users, setUsers] = useState<User[]>(null);
  const [pulledUsers, setPulledUsers] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const canLoadMoreData = useRef(true);
  useEffect(() => {
    pullData();
  }, []);

  const pullData = () => {
    if (props.followType === FOLLOW_LIST.Followers) {
      getUserFollowers(userToken.UserAccessToken, props.userID)
        .then((users) => {
          setPulledUsers(true);
          setUsers(users);
        })
        .catch((error: CustomError) => {
          if (error.showBugReportDialog) {
            showBugReportPopup(error);
          }
          showErrorAlert(error);
          setShowRetry(true);
        });
    } else {
      getUserFollowing(userToken.UserAccessToken, props.userID)
        .then((users) => {
          setPulledUsers(true);
          setUsers(users);
        })
        .catch((error: CustomError) => {
          if (error.showBugReportDialog) {
            showBugReportPopup(error);
          }
          showErrorAlert(error);
          setShowRetry(true);
        });
    }
  };

  const loadMoreData = async () => {
    if (!canLoadMoreData.current) {
      return;
    }

    if (!isLoadingRef.current) {
      setIsLoading(true);
      isLoadingRef.current = true;
      let cursorUserID = null;

      if (users && users.length > 0) {
        cursorUserID = users[users.length - 1].UserID;
      }

      if (cursorUserID) {
        // Only proceed if cursor is not null
        try {
          let additionalUsers = null;
          if (canLoadMoreData.current) {
            if (props.followType === FOLLOW_LIST.Followers) {
              additionalUsers = await getUserFollowers(
                userToken.UserAccessToken,
                props.userID,
                cursorUserID
              );
            } else {
              additionalUsers = await getUserFollowing(
                userToken.UserAccessToken,
                props.userID,
                cursorUserID
              );
            }
            setUsers((currentUsers) => [...currentUsers, ...additionalUsers]);
          }
          console.log(JSON.stringify(additionalUsers));
          if (additionalUsers.length === 0) {
            console.log("CANT GO INTO DATA ANYMORE");
            canLoadMoreData.current = false;
          }
        } catch (error) {
          if (error.shouldDisplay) {
            console.warn(error);
          }
        }
      }
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  const renderUserResult = (user: User) => {
    return (
      <View key={user.UserID + "FollowList renderUserResult"}>
        <UserResult user={user} />
      </View>
    );
  };

  const renderItem = ({ item }) => renderUserResult(item);

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        style={{ backgroundColor: COLORS.trueBlack }}
        ListEmptyComponent={
          <View
            style={{
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {showRetry && (
              <RetryButton
                setShowRetry={setShowRetry}
                retryCallBack={pullData}
              />
            )}
            {!showRetry &&
              (pulledUsers ? (
                <McText h3>No one here yet!</McText>
              ) : (
                <ActivityIndicator color={COLORS.white} size={"small"} />
              ))}
          </View>
        }
        ListFooterComponent={() =>
          isLoading ? (
            <ActivityIndicator
              style={{ marginTop: 10, marginBottom: insets.bottom + 30 }}
              size="small"
              color={COLORS.white}
            />
          ) : (
            <View style={{ height: insets.bottom + 10 }} />
          )
        }
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.8}
        keyExtractor={(item, index) => item.UserID + "Flatlist result" + index}
      />
    </View>
  );
};

export default FollowList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
  },
});
