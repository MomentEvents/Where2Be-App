import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { LoadingContext } from "../../Contexts/LoadingContext";
import { AuthContext } from "../../Contexts/AuthContext";
import { COLORS, SIZES } from "../../constants";
import { Event } from "../../Services/EventService";
import { User } from "../../Services/UserService";
import { Interest } from "../../Services/InterestService";

/*********************************************
 * route parameters:
 *
 * EventID: string,
 * SetCardLikes?: React.SetStateAction<number>,
 * SetCardShoutouts?: React.SetStateAction<number>,
 * SetCardUserLiked?: React.SetStateAction<boolean>,
 * SetCardUserShouted?: React.SetStateAction<boolean>
 */

const NewEventDetailScreen = ({ route }) => {
  // Props from previous event card to update
  const propsFromEventCard = route.params;

  // Loading context in case we want to disable the screen
  const { setLoading } = useContext(LoadingContext);

  const [viewedEvent, setViewedEvent] = useState<Event>();
  const [host, setHost] = useState<User>();
  const [tags, setTags] = useState<Interest[]>();
  const [likes, setLikes] = useState<number>();
  const [shoutouts, setShoutouts] = useState<number>();
  const [userLiked, setUserLiked] = useState<boolean>();
  const [userShouted, setUserShouted] = useState<boolean>();
  const [isHost, setIsHost] = useState<boolean>();

  const addUserLike = () => {};

  const addUserShoutout = () => {};

  const removeUserLike = () => {};

  const removeUserShoutout = () => {};

  useEffect(() => {
    // Disable the screen
    setLoading(true);

    const pulledEvent: Event = {
      EventID: "1373",
      Title: "Wassup this is my title",
      Description: "This is our description",
      Picture:
        "https://test-bucket-chirag5241.s3.us-west-1.amazonaws.com/test_image.jpeg",
      Location: "Hi",
      StartDateTime: new Date(),
      EndDateTime: undefined,
      Visibility: false,
    };
    setViewedEvent(pulledEvent);

    const pulledTags: Interest[] = [
      {
        InterestID: "abcde",
        Name: "Interest 1",
        Category: "Interest 1 Category",
      },
      {
        InterestID: "fghijk",
        Name: "Interest 2",
        Category: "Interest 2 Category",
      },
    ];
    setTags(pulledTags);

    const pulledHost: User = {
      UserID: "ABCDE",
      Name: "Kyle Wade",
      Username: "kyle1373",
      Email: "kwade@ucsd.edu",
      Picture:
        "https://test-bucket-chirag5241.s3.us-west-1.amazonaws.com/test_image.jpeg",
    };
    setHost(pulledHost);

    const pulledLikes: number = 20;
    setLikes(pulledLikes);

    const pulledShoutouts: number = 21;
    setShoutouts(pulledShoutouts);

    const pulledUserLiked: boolean = false;
    setUserLiked(pulledUserLiked);

    const pulledUserShouted: boolean = false;
    setUserShouted(pulledUserShouted);

    // Set previous event card shoutouts
    propsFromEventCard.SetCardLikes !== undefined
      ? propsFromEventCard.SetCardLikes(pulledLikes)
      : {};
    propsFromEventCard.SetCardLikes !== undefined
      ? propsFromEventCard.SetCardUserLiked(pulledUserLiked)
      : {};
    propsFromEventCard.SetCardShoutouts !== undefined
      ? propsFromEventCard.SetCardShoutouts(pulledShoutouts)
      : {};
    propsFromEventCard.SetCardLikes !== undefined
      ? propsFromEventCard.SetCardUserShouted(pulledUserShouted)
      : {};

    setLoading(false);
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: "transparent",
        }}
        style={{
          backgroundColor: "transparent",
          //temp fix for padding
          paddingBottom: 300,
        }}
      >
        {/*ImageBackground*/}

        <ImageBackground
          resizeMode="cover"
          source={{
            uri: viewedEvent === undefined ? null : viewedEvent.Picture,
          }}
          style={{
            width: "100%",
            height:
              SIZES.height < 700 ? SIZES.height * 0.4 : SIZES.height * 0.5,
          }}
        />
      </ScrollView>
    </View>
  );
};

export default NewEventDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    //justifyContent: 'center',
    //alignItems: 'center',
  },
});
function Sleep(arg0: number) {
  throw new Error("Function not implemented.");
}
