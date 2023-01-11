import { Component, useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Switch, ActivityIndicator } from "react-native";
import ModalSelector from "react-native-modal-selector";
import { getAllSchools } from "../../../../services/SchoolService";
import { COLORS, FONTS, School } from "../../../../constants";
import { displayError } from "../../../../helpers/helpers";
import {
  CUSTOMFONT_BOLD,
  CUSTOMFONT_REGULAR,
} from "../../../../constants/theme";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { LinearGradient } from "expo-linear-gradient";

type SchoolSelectorProps = {
  setSelectedSchool: React.Dispatch<React.SetStateAction<School>>;
};

type SchoolSelectorState = {
  selectionData: [{ key: string; label: string }];
  textInputValue: string;
};
const SchoolSelector = (props: SchoolSelectorProps) => {
  const [selectionData, setSelectionData] =
    useState<[{ key?: string; label?: string }]>(null);
  const [textInputValue, setTextInputValue] = useState<string>("");
  const [schoolMap, setSchoolMap] = useState<{ [key: string]: School }>(
    undefined
  );

  const [componentLoaded, setComponentLoaded] = useState<boolean>(false);

  const populateSchools = async (): Promise<void> => {
    const pulledSchools: School[] = await getAllSchools().catch(
      (error: Error) => {
        throw error;
      }
    );

    var selectionDataTemp: [{ key?: string; label?: string }] = [{}];
    var schoolMapTemp: { [key: string]: School } = {};

    selectionDataTemp.pop();

    pulledSchools.forEach((school) => {
      const selectionPart: { key?: string; label?: string } = {
        key: school.SchoolID,
        label: school.Abbreviation + " - " + school.Name,
      };
      selectionDataTemp.push(selectionPart);
      schoolMapTemp[school.SchoolID] = school;
    });

    console.log(selectionDataTemp);
    console.log(schoolMapTemp);

    setSelectionData(selectionDataTemp);
    setSchoolMap(schoolMapTemp);
  };

  useEffect(() => {
    populateSchools().catch((error: Error) => displayError(error));
  }, []);

  useEffect(() => {
    setComponentLoaded(schoolMap !== null && selectionData !== null);
    console.log(schoolMap !== null && selectionData !== null);
  }, [schoolMap, selectionData]);

  return (

      <View>
        {componentLoaded ? (
          <ModalSelector
            data={selectionData}
            initValue="select your school"
            selectStyle      ={{
                borderWidth: 0
            }}
            onChange={(option) => {
              props.setSelectedSchool(schoolMap[option.key]);
            }}
            selectTextStyle={{
              color: COLORS.white,
              fontFamily: CUSTOMFONT_BOLD,
            }}
            initValueTextStyle={{
              color: COLORS.white,
              fontFamily: CUSTOMFONT_BOLD,
            }}
            optionContainerStyle={{
              backgroundColor: "rgba(120,120,120,0.9)",
            }}
            optionTextStyle={{
              color: COLORS.white,
              fontFamily: CUSTOMFONT_BOLD,
            }}
            cancelTextStyle={{
              color: COLORS.white,
              fontFamily: CUSTOMFONT_BOLD,
            }}
            cancelStyle={{
              backgroundColor: "rgba(120,120,120,0.9)",
            }}

          />
        ) : (
          <ActivityIndicator size="small" />
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flexGrow: 1,
    flex: 1,
    justifyContent: "space-between",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
})

export default SchoolSelector;
