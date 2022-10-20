// This component allows the user to be able to choose a date or a time.
// You click on the rectangle, and it 

import React, { useState, Component } from 'react';
import DateTimePicker from "@react-native-community/datetimepicker";

/**************************
 * Props:
 * 
 * SetDate
 * 
 */

export default class DateTimeComponent extends Component {
    render() {
        return (
            <Modal animationType="fade" transparent={true} visible={showDatePicker}>
                <View style={{ ...backgroundColorStyle, flex: 1}}>
                <DateTimePicker
                    value={date}
                    mode={"date"}
                    display={Platform.OS == "ios" ? "inline" : "spinner"}
                    is24Hour={true}
                    onChange={onDateChange}
                />
                <TouchableOpacity
                    style={{margin: 20, ...styles.button, ...styles.buttonClose}}
                    onPress={closeDatePicker}>
                    <Text style={{padding: 5, ...styles.textStyle}}>Close</Text>
                </TouchableOpacity>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 0,
      backgroundColor: 'transparent',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }
  });
  