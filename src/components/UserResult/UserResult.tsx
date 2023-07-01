import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLORS, SCREENS, User } from "../../constants";
import { McText } from "../Styled";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons'; 
import { UserContext } from "../../contexts/UserContext";

type UserResultProps = {
  user: User;
};
const UserResult = (props: UserResultProps) => {
  const navigation = useNavigation<any>();
  const {userIDToUser, updateUserIDToUser} = useContext(UserContext)
  const [fetchedUser, setFetchedUser] = useState(false)
  const onUserPress = () => {
    navigation.push(SCREENS.ProfileDetails, { userID: props.user.UserID });
  };

  const pullData = async () => {
    updateUserIDToUser({ id: props.user.UserID, user: props.user });
    setFetchedUser(true);
  };

  // First time being loaded and rendered
  useEffect(() => {
    pullData();
  }, []);

  if (!fetchedUser || !userIDToUser[props.user.UserID]) {
    return <View />;
  }
  
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
            source={{ uri: userIDToUser[props.user.UserID].Picture }}
          />
          <View
            style={{
              marginRight: 30,
              marginLeft: 15,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection:'row', alignItems: 'center'}}>
              <McText h3 numberOfLines={1}>
                {userIDToUser[props.user.UserID].DisplayName}
              </McText>
              {userIDToUser[props.user.UserID].VerifiedOrganization &&
                <View style={{ paddingLeft: 3 }}>
                  <MaterialIcons name="verified" size={18} color={COLORS.purple} /> 
                </View>}
            </View>
            <McText body5 numberOfLines={1} style={{color: COLORS.gray}}>
                @{userIDToUser[props.user.UserID].Username}
            </McText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default UserResult;

const styles = StyleSheet.create({});
