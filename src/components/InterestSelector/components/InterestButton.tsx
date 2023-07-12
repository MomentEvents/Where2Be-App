import { useState } from "react";
import { SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, Interest } from "../../../constants";
import { McText } from "../../Styled";

type InterestButtonProps = {
  tag: Interest;
  selectedInterests: Set<Interest>;
  setSelectedInterests: React.Dispatch<React.SetStateAction<Set<Interest>>>;
};
const InterestButton = (props: InterestButtonProps) => {

  const [toggle, setToggle] = useState<boolean>(
    props.selectedInterests.has(props.tag)
  );

  const _onPress = () => {
    if(toggle){
        // We are removing an item
        props.selectedInterests.delete(props.tag)
    }
    else{
        // We are adding an item
        props.selectedInterests.add(props.tag)
    }
    setToggle(!toggle);
  };

  return (
      <TouchableOpacity
        onPress={() => {
          _onPress();
        }}
        style={{
          height: 32,
          borderRadius: 5,
          marginVertical: 4,
          marginHorizontal: 4,
          paddingHorizontal: 10,
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
