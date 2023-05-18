import {
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import React, { Dispatch, SetStateAction } from 'react';
import { COLORS } from "../constants";
import { Ionicons } from '@expo/vector-icons'; 

type RetryButtonProps = {
    setShowRetry: Dispatch<SetStateAction<boolean>>,
    retryCallBack: () => void,
    backgroundColor: string,
    extraStyle: {},
};

const RetryButton = (props: RetryButtonProps) => {
    return(
        <View style={[{backgroundColor: props.backgroundColor, alignItems: 'center', justifyContent: 'center'}, props.extraStyle]}>
            <TouchableOpacity onPress={() => {
                props.setShowRetry(false);
                props.retryCallBack();
            }}>
              <Ionicons name="reload" size={24} color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default RetryButton;

const styles = StyleSheet.create({

})