import { useState } from "react";
import { SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, Interest } from "../../../constants";
import { McText } from "../../Styled";
import { displayError, formatError } from "../../../helpers/helpers";

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
          marginHorizontal: 4,
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
