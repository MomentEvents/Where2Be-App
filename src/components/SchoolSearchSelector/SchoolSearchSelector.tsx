import { Component, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Switch,
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
} from "react-native";
import ModalSelector from "./components";
import { getAllSchools } from "../../services/SchoolService";
import { COLORS, FONTS, School } from "../../constants";
import { showBugReportPopup } from "../../helpers/helpers";
import {
  CUSTOMFONT_BOLD,
  CUSTOMFONT_REGULAR,
  CUSTOMFONT_SEMIBOLD,
  SIZES,
} from "../../constants/theme";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { LinearGradient } from "expo-linear-gradient";
import RetryButton from "../../components/RetryButton";
import { CustomError } from "../../constants/error";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { McText } from "../Styled";
import { AlertContext } from "../../contexts/AlertContext";
import React from "react";

type SchoolSelectorProps = {
  onSelectSchool: (school: School) => void;
  textStyle: any;
  initialTextStyle: any;
  buttonStyle: any;
  initialText: string;
  maxLines?: number;
};

const SchoolSearchSelector = (props: SchoolSelectorProps) => {
  const insets = useSafeAreaInsets();

  const { showErrorAlert } = useContext(AlertContext);

  const [selectionData, setSelectionData] =
    useState<[{ key?: string; label?: string }]>(null);
  const [schoolMap, setSchoolMap] = useState<{ [key: string]: School }>(
    undefined
  );

  const [componentLoaded, setComponentLoaded] = useState<boolean>(false);

  const [showRetry, setShowRetry] = useState<boolean>(false);

  const populateSchools = async (): Promise<void> => {
    const pulledSchools: School[] = await getAllSchools().catch(
      (error: CustomError) => {
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

  const handlePopulateSchools = () => {
    populateSchools().catch((error: CustomError) => {
      setShowRetry(true);
      if (error.showBugReportDialog) {
        showBugReportPopup(error);
      }
      showErrorAlert(error);
    });
  };

  useEffect(() => {
    handlePopulateSchools();
  }, []);

  useEffect(() => {
    setComponentLoaded(schoolMap !== null && selectionData !== null);
    console.log(schoolMap !== null && selectionData !== null);
  }, [schoolMap, selectionData]);

  return (
    <View style={{ justifyContent: "center" }}>
      {componentLoaded ? (
        <ModalSelector
          renderItem={(item) => {
            return <></>;
          }}
          frozenSearch={true}
          searchStyle={{
            backgroundColor: "rgba(40,40,40,0.5)",
            paddingHorizontal: 10,
            marginTop: 10,
            marginBottom: 20,
            borderWidth: 0,
          }}
          searchTextStyle={{
            color: COLORS.lightGray,
            fontFamily: CUSTOMFONT_REGULAR,
            fontSize: 15,
          }}
          data={selectionData}
          optionContainerStyle={{
            backgroundColor: "rgba(10,10,10,0.85)",
            marginTop: insets.top + 10,
          }}
          optionTextStyle={{
            color: COLORS.white,
            fontFamily: CUSTOMFONT_SEMIBOLD,
            borderColor: COLORS.gray,
          }}
          cancelTextStyle={{
            color: COLORS.white,
            fontFamily: CUSTOMFONT_SEMIBOLD,
          }}
          cancelStyle={{
            backgroundColor: "rgba(10,10,10,0.85)",
            marginBottom: insets.bottom + 10,
          }}
          optionStyle={{
            borderColor: COLORS.gray
          }}
          onChange={(option) => {
            props.onSelectSchool(schoolMap[option.key]);
          }}
          // Initial Text
          initValue={props.initialText}
          // Text style
          selectTextStyle={props.textStyle}
          // Button
          selectStyle={props.buttonStyle}
          // Text style
          initValueTextStyle={props.initialTextStyle}
          maxLines={props.maxLines}
        />
      ) : showRetry ? (
        <RetryButton
          setShowRetry={setShowRetry}
          retryCallBack={handlePopulateSchools}
          style={{ alignItems: "center", justifyContent: "center" }}
        />
      ) : (
        <ActivityIndicator
          style={{ padding: 8 }}
          color={COLORS.white}
          size="small"
        />
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
  EmptytextHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  EmptyMassage: {
    color: "red",
    fontWeight: "700",
    fontSize: 16,
    fontStyle: "normal",
  },
});

export default SchoolSearchSelector;
