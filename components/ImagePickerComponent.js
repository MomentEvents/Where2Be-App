import React, { useState, useEffect, Component } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
class ImagePickerComponent extends Component{
  constructor(props) {
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
      image: undefined
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
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({image: result.uri})
      this.props.setImg(result.uri)
    }
  };

  render() {
    return (
      <View style={{ flex: 0, alignItems: 'center', justifyContent: 'center' }}>
        {this.state.image && <Image source={{ uri: this.state.image }} style={{ width: 300, height: 300 }} />}
        <Button title="Pick an image from camera roll" onPress={this.pickImage} />
      </View>
    );
  }
}

export default ImagePickerComponent;