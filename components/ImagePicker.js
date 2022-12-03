import React, { useState, useEffect, Component } from "react";
import { TouchableOpacity, Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { dummyData, FONTS, SIZES, COLORS, icons, images } from "../constants";
import { McText, McIcon, McAvatar } from ".";
import { relativeTimeThreshold } from "moment";
class ImagePickerComponent extends Component {

  constructor(props) {
    console.log(props.img)
    super(props);
    this.thisHeight = props.height ? props.height : SIZES.width*0.75;
    this.thisWidth = props.width ? props.width : SIZES.width*0.75;
    console.log("Image picker height is " + this.thisHeight + ". props.height is " + props.height)
    console.log("Image picker height is " + this.thisWidth + ". props.width is " + props.width)
    this.state = {
      image: this.props.image,
    };
  }

  pickImage = async () => {
    // // No permissions request is necessary for launching the image library
    // const permissions = 'Permissions.CAMERA_ROLL';
    // const { status } = await Permissions.askAsync(permissions);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 100,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.props.setImg(result.uri);
    }
  };

  render() {
    return (
      <View style={{ flex: 0, justifyContent: "center", alignItems: "center",}}>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.black,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: COLORS.gray,
            width: this.thisWidth,
            height: this.thisHeight,
          }}

          onPress={this.pickImage}
        >
          {this.state.image ? (
            <Image
              source={{ uri: this.state.image }}
              style={{ width: this.thisWidth, height: this.thisHeight, borderRadius: 10, 
                borderColor: COLORS.gray, borderWidth: .5 }}
            />
          ) : (
            <icons.imagepickeraddimage height={Math.min(this.thisHeight / 3, this.thisWidth / 3)}/>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

export default ImagePickerComponent;
