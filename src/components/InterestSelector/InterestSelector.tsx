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

type InterestSelectorProps = {
  selectedTags: Interest[];
  setSelectedTags: React.Dispatch<React.SetStateAction<Interest[]>>;
};

const InterestSelector = (props: InterestSelectorProps) => {
  const [interestIDToInterestMap, setInterestIDToInterestMap] = useState<{
    [key: string]: Interest;
  }>(null);

  const [selectedTagsMap, setSelectedTagsMap] = useState<{
    [key: string]: boolean;
  }>(null);
  const [loadedTags, setLoadedTags] = useState(false);
  const { currentSchool } = useContext(UserContext);

  const pullData = async () => {
    getAllInterests(currentSchool.SchoolID)
      .then((tags: Interest[]) => {
        var interestIDToInterestMapTemp = {};
        tags.forEach((element) => {
          interestIDToInterestMapTemp[element.InterestID] = element;
        });
        setInterestIDToInterestMap(interestIDToInterestMapTemp);
      })
      .catch((error: Error) => {
        displayError(error);
      });

    var selectedTagsMapTemp = {};

    props.selectedTags.forEach((tag) => {
      selectedTagsMapTemp[tag.InterestID] = true;
    });
    setSelectedTagsMap(selectedTagsMapTemp);
  };

  useEffect(() => {
    pullData();
  }, []);

  useEffect(() => {
    if (!interestIDToInterestMap || !selectedTagsMap) {
      setLoadedTags(false);
      return;
    }
    setLoadedTags(true);
  }, [interestIDToInterestMap, selectedTagsMap]);

  return (
    <View>
      {loadedTags ? (
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
              interestMap={selectedTagsMap}
              setInterestMap={setSelectedTagsMap}
              selectedTags={props.selectedTags}
              setSelectedTags={props.setSelectedTags}
            />
          )}
        />
      ) : (
        <ActivityIndicator />
      )}
          <Button title={"Test here"} onPress={() => console.log(selectedTagsMap)}/>
    </View>
  );
};

export default InterestSelector;

const styles = StyleSheet.create({});
