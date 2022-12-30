import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Dispatch, SetStateAction } from "react";

/*********************************************
 * route parameters:
 * 
 * EventID: string,
 * SetTitle?: React.SetStateAction<string>,
 * SetImage?: React.SetStateAction<string>,
 * SetStartingTime?: React.SetStateAction<Date>,
 * SetLikes?: React.SetStateAction<number>,
 * SetShoutouts?: React.SetStateAction<number>,
 * SetUserLiked?: React.SetStateAction<boolean>,
 * SetUserShouted?: React.SetStateAction<boolean>
 */

const NewEventDetailScreen = ({ route }) => {
  useEffect(() => {
    console.log("going here")
    route.params.SetTitle("It Updated Lmao")
    console.log("finished here")
  }, []);
  return (
    <View>
      <Text>NewEventDetailScreen</Text>
    </View>
  );
};

export default NewEventDetailScreen;

const styles = StyleSheet.create({});
