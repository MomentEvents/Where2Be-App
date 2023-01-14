import { useState } from "react";
import { SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, Interest } from "../../../constants";
import { McText } from "../../Styled";
import { displayError, formatError } from "../../../helpers/helpers";

type InterestButtonProps = {
  tag: Interest;
  interestMap: {
    [tag: string]: boolean;
  };
  setInterestMap: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
  selectedTags: Interest[],
  setSelectedTags: React.Dispatch<
  React.SetStateAction<Interest[]>
>;
};
const InterestButton = (props: InterestButtonProps) => {
  const checkList = (list: { [tag: string]: boolean }, id: string) => {
    if (list[id]) {
      return true;
    }
  };

  const [toggle, setToggle] = useState<boolean>(
    checkList(props.interestMap, props.tag.InterestID)
  );

  const _onPress = () => {
    const index = props.selectedTags.indexOf(props.tag)
    if(toggle){
        // We are removing an item
        if(index == -1){
            // We are removing an item that isn't there. Just return
            throw formatError("Error", "You are clicking too fast! You are removing an item that is not there")
        }

        props.selectedTags.splice(index, 1)
    }
    else{
        // We are adding an item
        if(index > -1){
            // We are adding an item that is already there. Just return
            throw formatError("Error", "You are clicking too fast! You are adding an item that is already there")
        }
        props.selectedTags.push(props.tag)
    }
    setToggle(!toggle);
    props.interestMap[props.tag.InterestID] = !props.interestMap[props.tag.InterestID];
    props.setInterestMap(props.interestMap);

  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          _onPress();
        }}
        style={{
          width: props.tag.Name.length * 8 + 20,
          height: 32,
          borderRadius: 10,
          marginTop: 8,
          marginRight: 8,
          backgroundColor: toggle
            ? COLORS.purple
            : COLORS.input,
          opacity: 0.9,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <McText h5 style={{ letterSpacing: 0.4 }}>
          {props.tag.Name}
        </McText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default InterestButton;
