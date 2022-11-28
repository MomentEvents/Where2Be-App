import React, { useState, useEffect, Component } from "react";
import { TouchableOpacity, Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { dummyData, FONTS, SIZES, COLORS, icons, images } from "../constants";
import { McText, McIcon, McAvatar } from "../components";
class ImagePickerComponent extends Component {
  constructor(props) {
    console.log(props.img)
    /*
     * Props:
     *
     * setDate state function
     * style passed in
     * mode passed in as a string
     *
     * */
    super(props);
    this.state = {
      image: this.props.img,
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
      <View style={{ flex: 0, alignItems: "center", justifyContent: "center" }}>
        {/* {this.state.image && (
          <Image
            source={{ uri: this.state.image }}
            style={{ width: 300, height: 300 }}
          />
        )} */}
        <TouchableOpacity
          style={{
            height: SIZES.height / 4,
            width: SIZES.width * 0.75,
            backgroundColor: COLORS.black,
            borderRadius: 10,
            marginBottom: 8,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: COLORS.gray,
            width: SIZES.width*0.75,
            height: SIZES.width*0.75
          }}
          onPress={this.pickImage}
        >
          {this.state.image ? (
            <Image
              source={{ uri: this.state.image }}
              style={{ width: SIZES.width*0.75, height: SIZES.width*0.75, borderRadius: 10 }}
            />
          ) : (
            <McIcon
              source={icons.addphoto}
              size={60}
              style={{
                margin: 4,
                tintColor: COLORS.purple,
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

export default ImagePickerComponent;
