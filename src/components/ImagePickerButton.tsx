import React, { useState, useEffect, Component } from "react";
import { TouchableOpacity, Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FONTS, SIZES, COLORS, icons, images } from "../constants";
import { McIcon } from "./Styled";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import * as Permissions from 'expo-permissions';

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

    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      console.error('Camera roll permission not granted');
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 100,
      base64: true,
    });

    console.log(result);

    if (!result.cancelled) {
      const { uri, base64 } = result as ImageInfo;
      setCurrentImageURI(uri);
      props.setImageURI(uri);
      props.setImageBase64(base64)
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
        <View style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", borderRadius: 5 }}>
          <icons.imagepickeraddimage
            height={Math.min(height / 3, width / 3)}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImagePickerButton;
