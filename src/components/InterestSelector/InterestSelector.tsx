import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLORS, Interest } from "../../constants";
import {
  getAllInterests,
  getEventInterestsByEventId,
} from "../../services/InterestService";
import { displayError } from "../../helpers/helpers";
import { McText } from "../Styled";
import { UserContext } from "../../contexts/UserContext";
import InterestButton from "./components/InterestButton";
import { GestureObjects } from "react-native-gesture-handler/lib/typescript/handlers/gestures/gestureObjects";

type InterestSelectorProps = {
  selectedInterests: Set<Interest>;
  setSelectedInterests: React.Dispatch<React.SetStateAction<Set<Interest>>>;
};

const InterestSelector = (props: InterestSelectorProps) => {
  const [interestIDToInterestMap, setInterestIDToInterestMap] = useState<{[key: string]: Interest}>(null);
  const { currentSchool } = useContext(UserContext);

  const pullData = async () => {
    getAllInterests(currentSchool.SchoolID)
      .then((tags: Interest[]) => {
        var interestIDToInterestMapTemp = {};
        tags.forEach((element) => {
          interestIDToInterestMapTemp[element.InterestID] = element;
        });
        var selectedInterestsTemp = new Set<Interest>();
        props.selectedInterests.forEach((element) => {
          if (interestIDToInterestMapTemp[element.InterestID]) {
            selectedInterestsTemp.add(
              interestIDToInterestMapTemp[element.InterestID]
            );
          }
        });

        console.log(selectedInterestsTemp)

        props.setSelectedInterests(selectedInterestsTemp)
        setInterestIDToInterestMap(interestIDToInterestMapTemp)
      })
      .catch((error: Error) => {
        displayError(error);
      });
  };

  useEffect(() => {
    pullData();
  }, []);

  return (
    <View>
      {interestIDToInterestMap ? (
        <FlatList
          data={Object.values(interestIDToInterestMap)}
          columnWrapperStyle={{
            flexWrap: "wrap",
            flex: 1,
            marginTop: 1,
            marginRight: 10,
          }}
          numColumns={4}
          style={{
            backgroundColor: "transparent",
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <InterestButton
              tag={item}
              selectedInterests={props.selectedInterests}
              setSelectedInterests={props.setSelectedInterests}
            />
          )}
        />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

export default InterestSelector;

const styles = StyleSheet.create({});
