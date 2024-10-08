import React, { useState, useEffect, Component } from "react";
import {
  TouchableOpacity,
  Button,
  Image,
  View,
  Platform,
  Alert,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FONTS, SIZES, COLORS, icons } from "../constants";
import { PermissionsAndroid } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

type ImagePickerButtonProps = {
  originalImageURI?: string;
  width?: number;
  height?: number;
  setImageURI: React.Dispatch<React.SetStateAction<string>>;
  setImageBase64: React.Dispatch<React.SetStateAction<string>>;
  style?: any;
};

const ImagePickerButton = (props: ImagePickerButtonProps) => {
  const [currentImageURI, setCurrentImageURI] = useState<string>(
    props.originalImageURI
  );

  const defaultWidthHeight =
    SIZES.width < SIZES.height ? SIZES.width - 80 : SIZES.height - 80;
  const width = props.width ? props.width : defaultWidthHeight;
  const height = props.height ? props.height : defaultWidthHeight;

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission error", "Where2Be does not have access to your photos. Please enable them in settings.", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Go to Settings",
          onPress: () => Linking.openURL("app-settings:"),
        },
      ]);
      return;
    }
    var didPick = false;
    var imgUri: string = undefined;
    var imgBase64: string = undefined;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    });

    if (!result.canceled) {
      const { uri, base64 } = result.assets[0];
      didPick = true;
      imgUri = uri;
      imgBase64 = base64;
    }

    if (didPick) {
      setCurrentImageURI(imgUri);
      console.log(imgUri);
      props.setImageURI(imgUri);
      console.log(imgBase64);
      props.setImageBase64(imgBase64);
    }
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: COLORS.trueBlack,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLORS.gray,
        width: width,
        height: height,
        ...props.style,
      }}
      onPress={pickImage}
    >
      {currentImageURI ? (
        <>
          <Image
            source={{ uri: currentImageURI }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 4,
              ...props.style,
            }}
          />
          {/* Pen Icon */}
          <View
            style={{
              backgroundColor: COLORS.gray2,
              padding: 10,
              borderRadius: SIZES.height,
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              bottom: -10,
              right: -10,
            }}
          >
            <FontAwesome5 name="pen" size={15} color="white" />
          </View>
        </>
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
          }}
        >
          <icons.imagepickeraddimage height={Math.min(height / 3, width / 3)} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImagePickerButton;
