import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { LoadingContext } from "../../Contexts/LoadingContext";
import { AuthContext } from "../../Contexts/AuthContext";

/*********************************************
 * route parameters:
 * 
 * EventID: string,
 * SetCardTitle?: React.SetStateAction<string>,
 * SetCardImage?: React.SetStateAction<string>,
 * SetCardStartingTime?: React.SetStateAction<Date>,
 * SetCardLikes?: React.SetStateAction<number>,
 * SetCardShoutouts?: React.SetStateAction<number>,
 * SetCardUserLiked?: React.SetStateAction<boolean>,
 * SetCardUserShouted?: React.SetStateAction<boolean>
 */

const NewEventDetailScreen = ({ route }) => {
  const propsFromEventCard = route.params
  const {setLoading} = useContext(LoadingContext)

  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [image, setImage] = useState<string | null>();
  const [startingDateTime, setStartingDateTime] = useState<Date>();
  const [endingDateTime, setEndingDateTime] = useState<Date>();
  const [likes, setLikes] = useState<number>();
  const [shoutouts, setShoutouts] = useState<number>();
  const [userLiked, setUserLiked] = useState<boolean>();
  const [userShouted, setUserShouted] = useState<boolean>();
  const [tags, setTags] = useState<string[]>();
  const [hostUsername, setHostUsername] = useState<string>();

  useEffect(() => {
    setLoading(true)
    setLoading(false)
  }, []);
  return (
    
    <View>
      <Text>NewEventDetailScreen</Text>
    </View>
  );
};

export default NewEventDetailScreen;

const styles = StyleSheet.create({});
