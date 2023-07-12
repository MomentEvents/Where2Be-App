import { Component, useEffect, useState } from "react";
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
import { displayError, showBugReportPopup } from "../../helpers/helpers";
import {
  CUSTOMFONT_BOLD,
  CUSTOMFONT_REGULAR,
  SIZES,
} from "../../constants/theme";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { LinearGradient } from "expo-linear-gradient";
import RetryButton from "../../components/RetryButton";
import { CustomError } from "../../constants/error";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SchoolSelectorProps = {
  onSelectSchool: (school: School) => void;
  textStyle: any;
  buttonStyle: any;
  initialText: string;
  maxHeight?: number;
  maxLines?: number;
};

type SchoolSelectorState = {
  selectionData: [{ key: string; label: string }];
  textInputValue: string;
};

const SchoolSearchSelector = (props: SchoolSelectorProps) => {
  const insets = useSafeAreaInsets();

  const [selectionData, setSelectionData] =
    useState<[{ key?: string; label?: string }]>(null);
  const [textInputValue, setTextInputValue] = useState<string>("");
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
      if(error.showBugReportDialog){
        showBugReportPopup(error)
      }
      else if (error.shouldDisplay) {
        displayError(error);
      }
    });
  };

  useEffect(() => {
    handlePopulateSchools();
  }, []);

  useEffect(() => {
    setComponentLoaded(schoolMap !== null && selectionData !== null);
    console.log(schoolMap !== null && selectionData !== null);
  }, [schoolMap, selectionData]);

  if (props.maxHeight) {
    return (
      <View style={{ height: props.maxHeight }}>
        {componentLoaded ? (
          <ModalSelector
            renderItem={(item) => {
              return <></>;
            }}
            frozenSearch={true}
            searchStyle={{
              backgroundColor: "rgba(90,90,90,0.5)",
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
              backgroundColor: "rgba(60,60,60,0.9)",
              marginTop: insets.top + 10,
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
              backgroundColor: "rgba(60,60,60,0.9)",
              marginBottom: insets.bottom + 10,
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
            initValueTextStyle={props.textStyle}
            maxLines={props.maxLines}
          />
        ) : // LOAD THIS
        showRetry ? (
          <RetryButton
            setShowRetry={setShowRetry}
            retryCallBack={handlePopulateSchools}
            style={{ alignItems: "center", justifyContent: "center" }}
          />
        ) : (
          <ActivityIndicator color={COLORS.white} size="small" />
        )}
      </View>
    );
  }
  return (
    <View style={{ justifyContent: "center" }}>
      {componentLoaded ? (
        <ModalSelector
          renderItem={(item) => {
            return <></>;
          }}
          frozenSearch={true}
          searchStyle={{
            backgroundColor: "rgba(90,90,90,0.5)",
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
            backgroundColor: "rgba(60,60,60,0.9)",
            marginTop: insets.top + 10,
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
            backgroundColor: "rgba(60,60,60,0.9)",
            marginBottom: insets.bottom + 10,
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
          initValueTextStyle={props.textStyle}
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
});

export default SchoolSearchSelector;
