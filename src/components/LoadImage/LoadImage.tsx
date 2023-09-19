import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
  Image,
  ActivityIndicator,
  StyleProp,
  IimageStyle
} from "react-native";
import { User, Event, COLORS, SCREENS, SIZES } from "../../constants";

type LoadImageProps = {
    imageStyle: StyleProp<IimageStyle>;
    imageSource: string;
};

const LoadImage = (props: LoadImageProps) => {
  const [isImageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
        <Image
            style={props.imageStyle}
            source={{uri: props.imageSource}}
            onLoad={handleImageLoad}
        />
        {!isImageLoaded && (
            <ActivityIndicator size="small" color={COLORS.white} style={[props.imageStyle, {position: 'absolute'}]}/>
        )}
    </>
  );
};

export default LoadImage;

const styles = StyleSheet.create({});
