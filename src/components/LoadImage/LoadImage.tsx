import React, { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Image,
  StyleProp,
  ImageStyle
} from "react-native";
import { COLORS } from "../../constants";

type LoadImageProps = {
    imageStyle: StyleProp<ImageStyle>;
    imageSource: string;
    onLoadEnd?: ()=>void;
};

const LoadImage = (props: LoadImageProps) => {
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

    const handleOnLoadEnd = () => {
        props.onLoadEnd;
    }

    return (
        <>
            <Image
                style={props.imageStyle}
                source={{uri: props.imageSource}}
                onLoad={handleImageLoad}
                onLoadEnd={handleOnLoadEnd}
            />
            {!isImageLoaded && (
                <Animated.View style={[props.imageStyle, {position: 'absolute', backgroundColor: COLORS.gray, opacity}]} />
            )}
        </>
    );
};

export default LoadImage;

const styles = StyleSheet.create({});
