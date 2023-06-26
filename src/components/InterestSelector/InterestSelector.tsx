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
import { COLORS, Interest, SIZES } from "../../constants";
import {
  getAllInterests,
  getEventInterestsByEventId,
} from "../../services/InterestService";
import { displayError } from "../../helpers/helpers";
import { McText } from "../Styled";
import { UserContext } from "../../contexts/UserContext";
import InterestButton from "./components/InterestButton";
import { GestureObjects } from "react-native-gesture-handler/lib/typescript/handlers/gestures/gestureObjects";
import RetryButton from "../RetryButton";
import { CustomError } from "../../constants/error";

type InterestSelectorProps = {
  selectedInterests: Set<Interest>;
  setSelectedInterests: React.Dispatch<React.SetStateAction<Set<Interest>>>;
};

const InterestSelector = (props: InterestSelectorProps) => {
  const [interestIDToInterestMap, setInterestIDToInterestMap] = useState<{
    [key: string]: Interest;
  }>(null);
  const { currentSchool } = useContext(UserContext);

  const [showRetry, setShowRetry] = useState<boolean>(false);

  const pullData = async () => {
    getAllInterests(currentSchool.SchoolID)
      .then((tags: Interest[]) => {
        var interestIDToInterestMapTemp = {};
        tags.forEach((element) => {
          interestIDToInterestMapTemp[element.InterestID] = element;
        });
        var selectedInterestsTemp = new Set<Interest>();
        props.selectedInterests !== undefined
          ? props.selectedInterests.forEach((element) => {
              if (interestIDToInterestMapTemp[element.InterestID]) {
                selectedInterestsTemp.add(
                  interestIDToInterestMapTemp[element.InterestID]
                );
              }
            })
          : {};

        props.setSelectedInterests(selectedInterestsTemp);
        setInterestIDToInterestMap(interestIDToInterestMapTemp);
        console.log(selectedInterestsTemp)
      })
      .catch((error: CustomError) => {
        setShowRetry(true);
        if (error.shouldDisplay){
          displayError(error);
        }
      });
  };

  useEffect(() => {
    pullData();
  }, []);

  return (
    <View
      style={{ flexWrap: "wrap", flexDirection: "row", alignSelf: "baseline" }}
    >
      {interestIDToInterestMap ? (
        Object.keys(interestIDToInterestMap).map((key, index) => (
          <InterestButton
            tag={interestIDToInterestMap[key]}
            selectedInterests={props.selectedInterests}
            setSelectedInterests={props.setSelectedInterests}
            key={key + index}
          />
        ))
      ) : (
        // LOAD THIS
        showRetry? (
          <RetryButton setShowRetry={setShowRetry} retryCallBack={pullData} style={{ alignItems: 'center', justifyContent: 'center' }}/>
        ) : (
          <ActivityIndicator color={COLORS.white} />
        )
      )}
    </View>
  );
};

export default InterestSelector;

const styles = StyleSheet.create({});
