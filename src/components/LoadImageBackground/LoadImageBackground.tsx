import React, { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  StyleProp,
  ImageStyle,
  ImageBackground,
  ImageResizeMode,
} from "react-native";
import { COLORS } from "../../constants";

type LoadImageProps = {
    children;
    imageStyle: StyleProp<ImageStyle>;
    imageSource: string;
    resizeMode?: ImageResizeMode;
};

const LoadImageBackground = (props: LoadImageProps) => {
    const opacity = useState(new Animated.Value(0.4))[0];

    useEffect(() => {
        const fadeInAnimation = Animated.timing(opacity, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
        });
      
        const fadeOutAnimation = Animated.timing(opacity, {
            toValue: 0.4,
            duration: 1000,
            useNativeDriver: true,
        });
      
        const sequence = Animated.sequence([
            fadeInAnimation,
            fadeOutAnimation,
        ]);
      
        const loopedAnimation = Animated.loop(sequence);
      
        loopedAnimation.start();
    }, []);


    const [isImageLoaded, setImageLoaded] = useState(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    return (
        <ImageBackground
            style={props.imageStyle}
            source={{uri: props.imageSource}}
            onLoad={handleImageLoad}
            resizeMode={props.resizeMode}
        >
            {!isImageLoaded && (
                <Animated.View style={[props.imageStyle, {position: 'absolute', backgroundColor: COLORS.gray, opacity, height: '100%'}]} />
            )}
            {props.children}
        </ImageBackground>
    );
};

export default LoadImageBackground;

const styles = StyleSheet.create({});