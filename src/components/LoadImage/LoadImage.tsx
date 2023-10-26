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
    imageKey?: string;
    onLoadEndFunc?: ()=>void;
    imageBlurRadius?: number;
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
        if (props.onLoadEndFunc) {
            props.onLoadEndFunc();
        }
    }

    return (
        <>
            <Image
                key={props.imageKey}
                style={props.imageStyle}
                source={{uri: props.imageSource}}
                onLoad={handleImageLoad}
                onLoadEnd={handleOnLoadEnd}
                blurRadius={props.imageBlurRadius || 0}
            />
            {!isImageLoaded && (
                <Animated.View style={[props.imageStyle, {position: 'absolute', backgroundColor: COLORS.gray, opacity}]} />
            )}
        </>
    );
};

export default LoadImage;

const styles = StyleSheet.create({});
