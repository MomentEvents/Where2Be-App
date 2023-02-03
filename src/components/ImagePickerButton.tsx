import React, { useState, useEffect, Component } from "react";
import { TouchableOpacity, Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FONTS, SIZES, COLORS, icons, images } from "../constants";
import { McIcon } from "./Styled";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { PermissionsAndroid } from "react-native";
import * as DocumentPicker from "expo-document-picker";

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
    var didPick = false;
    var imgUri: string = undefined;
    var imgBase64: string = undefined;

    if (Platform.OS === "android") {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: "image/*",
        });
        if (result.type === "success") {
          const response = await fetch(result.uri);
          const blob = await response.blob();
          const reader = new FileReader();
          const dataURL = await new Promise((resolve) => {
            reader.onload = function() {
              resolve(reader.result);
            };
            reader.readAsDataURL(blob);
          });
          const base64 = dataURL.toString().split(',')[1];
          
          didPick = true;
          imgUri = result.uri;
          imgBase64 = base64;
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 100,
        base64: true,
      });
      if (!result.cancelled) {
        const { uri, base64 } = result as ImageInfo;
        didPick = true;
        imgUri = uri;
        imgBase64 = base64;
      }
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
        backgroundColor: COLORS.black,
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
        <Image
          source={{ uri: currentImageURI }}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 4,
            ...props.style,
          }}
        />
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
