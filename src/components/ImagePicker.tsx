import React, { useState, useEffect, Component } from "react";
import { TouchableOpacity, Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FONTS, SIZES, COLORS, icons, images } from "../constants";
import { McIcon } from "./Styled";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";

type ImagePickerButtonProps = {
  originalImageURI?: string;
  width?: number;
  height?: number;
  setImageURI: React.Dispatch<React.SetStateAction<string>>;
};

const ImagePickerButton = (props: ImagePickerButtonProps) => {
  const [currentImageURI, setCurrentImageURI] = useState<string>(
    props.originalImageURI
  );

  const defaultWidthHeight = SIZES.width < SIZES.height ? SIZES.width - 80 : SIZES.height - 80
  const width = props.width ? props.width : defaultWidthHeight
  const height = props.height ? props.height : defaultWidthHeight

  console.log("Original image URI is " + currentImageURI)

  const pickImage = async () => {
    // // No permissions request is necessary for launching the image library
    // const permissions = 'Permissions.CAMERA_ROLL';
    // const { status } = await Permissions.askAsync(permissions);
    // type imagePickerResult = {
    //     assetId: string,
    //     cancelled: boolean,
    //     fileName: string,
    //     fileSize: number,
    //     height: number,
    //     type: string,
    //     uri: string,
    //     width: number
    // }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 100,
    });

    console.log(result);

    if (!result.cancelled) {
      const { uri } = result as ImageInfo;
      setCurrentImageURI(uri);
      props.setImageURI(uri);
      console.log("Done");
    }
  };

  return (
    <View style={{ flex: 0, alignItems: "center", justifyContent: "center" }}>
      {/* {this.state.image && (
          <Image
            source={{ uri: this.state.image }}
            style={{ width: 300, height: 300 }}
          />
        )} */}
      <TouchableOpacity
        style={{
          height: height,
          width: width,
          backgroundColor: COLORS.black,
          borderRadius: 5,
          marginBottom: 8,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: COLORS.gray,
        }}
        onPress={pickImage}
      >
        {currentImageURI ? (
          <Image
            source={{ uri: currentImageURI }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5,
            }}
          />
        ) : (
          <McIcon
            source={icons.addphoto}
            size={props.width}
            style={{
              margin: 4,
              tintColor: COLORS.purple,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ImagePickerButton;
