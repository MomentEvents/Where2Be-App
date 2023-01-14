import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLORS, Interest } from "../constants";
import {
  getAllInterests,
  getEventInterestsByEventId,
} from "../services/InterestService";
import { displayError } from "../helpers/helpers";
import { McText } from "./Styled";
import { UserContext } from "../contexts/UserContext";

type InterestSelectorProps = {
  selectedTags: Interest[];
  setSelectedTags: React.Dispatch<Interest[]>;
};

const InterestSelector = (props: InterestSelectorProps) => {
  const [allTags, setAllTags] = useState<Interest[]>(null);
  const [allTagsMap, setAllTagsMap] = useState<{ [key: string]: boolean }>(
    null
  );
  const [loadedTags, setLoadedTags] = useState(false);
  const { currentSchool } = useContext(UserContext);

  const pullData = async () => {
    getAllInterests(currentSchool.SchoolID)
      .then((tags: Interest[]) => {
        setAllTags(tags);
      })
      .catch((error: Error) => {
        displayError(error);
      });

    var allTagsMapTemp = {};

    props.selectedTags.forEach((tag) => {
      allTagsMapTemp[tag.InterestID] = true;
    });
    setAllTagsMap(allTagsMapTemp);
  };

  useEffect(() => {
    pullData();
  }, []);

  useEffect(() => {
    setLoadedTags(true);
  }, [allTags, allTagsMap]);

  return (
    <View>
      {loadedTags ? (
        <FlatList
          data={allTags}
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
            <TouchableOpacity
              onPress={() => {
                if (!allTagsMap[item.InterestID]) {
                  props.selectedTags.push(item);
                } else {
                  const index = props.selectedTags.indexOf(item);
                  if (index > -1) {
                    props.selectedTags.splice(index, 1);
                  }
                }
                console.log("pressed " + item.Name)
                props.setSelectedTags(props.selectedTags)
                allTagsMap[item.InterestID] = !allTagsMap[item.InterestID]
                setAllTagsMap(allTagsMap)
              }}
              style={{
                width: item.Name.length * 8 + 20,
                height: 32,
                borderRadius: 10,
                marginTop: 8,
                marginRight: 8,
                backgroundColor: allTagsMap[item.InterestID]
                  ? COLORS.purple
                  : COLORS.input,
                opacity: 0.9,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <McText h5 style={{ letterSpacing: 0.4 }}>
                {allTagsMap[item.InterestID] ? "true" : "false"}
              </McText>
            </TouchableOpacity>
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
