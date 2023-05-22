import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import React, { Dispatch, SetStateAction } from 'react';
import { COLORS } from "../constants";
import { Ionicons } from '@expo/vector-icons'; 

type RetryButtonProps = {
    setShowRetry: Dispatch<SetStateAction<boolean>>,
    retryCallBack: () => void,
    style?: ViewStyle,
    color?: string  // default #FFFFFF
};

const RetryButton = (props: RetryButtonProps) => {
    return(
        <View style={props.style}>
            <TouchableOpacity onPress={() => {
                props.setShowRetry(false);
                props.retryCallBack();
            }}>
              <Ionicons name="reload" size={24} color={props.color? props.color : "#FFFFFF"} />
            </TouchableOpacity>
        </View>
    )
}

export default RetryButton;

const styles = StyleSheet.create({

})