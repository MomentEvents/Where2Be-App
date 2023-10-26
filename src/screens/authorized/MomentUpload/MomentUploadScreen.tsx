import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Image,
    Modal,
    Animated,
    StatusBar,
    Button,
    TouchableOpacity,
    BackHandler,
    ScrollView,
    FlatList,
    Linking,
    Alert
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Constants from 'expo-constants';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get('window');
const screenRatio = height / width;
import React, { useContext, useEffect, useRef, useState } from "react";
import { McText } from "../../../components/Styled";
import { COLORS, SCREENS, icons } from '../../../constants';
import LoadImage from '../../../components/LoadImage/LoadImage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

const MomentUploadScreen = () => {
    const navigation = useNavigation<any>();
    const goBack = () => {
        navigation.goBack();
    }

    const camera = useRef<Camera>(null)
    const { hasPermission, requestPermission } = useCameraPermission();

    const checkPermission = async() => {
        if (!hasPermission) {
            const permissionGranted = await requestPermission();
            if (!permissionGranted){
                Alert.alert("Permission error", "Where2Be does not have access to your camera. Please enable it in settings.", [
                    {
                      text: "Cancel",
                      onPress: () => goBack(),
                      style: "cancel",
                    },
                    {
                      text: "Go to Settings",
                      onPress: () => Linking.openSettings(),
                    },
                ]);
                return;
            }
        }
    }

    // const [device, setDevice] = useState(null);
    // const setCameraDevice = () => {
    //     const d = setDevice(useCameraDevice('back'));
    //     setDevice(d);
    // }
    const device = useCameraDevice('back');

    useEffect(() => {
        checkPermission();
        // setCameraDevice();
    }, []);

    // const isFocused = useIsFocused()
    // const isActive = isFocused


    // if (device == null) {
    //     console.log("device null");
    //     return (<Text>Camera not available</Text>);
    // }

    const takePhoto = async() => {
        if (camera.current != null){
            const photo = await camera.current.takePhoto();
            setImageSource(photo.path);
            setShowCamera(false);
            console.log(photo.path);
        }
    }

    const [showCamera, setShowCamera] = useState(true);
    const [imageSource, setImageSource] = useState('');

    return (
        <View style={{width: '100%', height: '100%', backgroundColor: 'black'}}>
            {device && showCamera? ( 
                <Camera
                    ref={camera}
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={showCamera}
                    photo={true}
                />) : (
                    imageSource && 
                    <LoadImage 
                        imageSource={`file://${imageSource}`}
                        imageStyle={{width: '100%'}}
                    />
                )
            }
            <TouchableOpacity
                style={{ paddingLeft: 30, paddingTop: 50 }}
                onPress={goBack}
            >
                <Feather name="arrow-left" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={takePhoto}
                style={{width: '100%', height: 100}}
            >
                
            </TouchableOpacity>
        </View>
        
    )


}

export default MomentUploadScreen

const styles = StyleSheet.create({

})