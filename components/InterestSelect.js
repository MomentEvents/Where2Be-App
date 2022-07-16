import React, { useState, Component } from 'react';
import { 
    SectionList,
    TouchableOpacity, 
    Text, 
    View, 
    StyleSheet, 
    SafeAreaView, 
    TextInput, 
    FlatList, 
    ImageBackground, 
    TouchableWithoutFeedback
 } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';


import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';
import events from '../constants/events.json'
import { McText} from '../components'
import { ScrollView } from 'react-native-gesture-handler';



export default class InterestSelector extends Component {
    state={
        toggle:this.checkList(this.props.list, this.props.text)
    }

    checkList(list, text){
        if (list.includes(text)) {
            return true
        }
    }

    _onPress(){
        const newState = !this.state.toggle
        this.setState({toggle:newState})
    }

    render() {
        this.checkList(this.props.list, this.props.text)
        const {toggle} = this.state
        const colorVal = toggle?COLORS.gray:COLORS.input
        const inList = toggle?false:true
        
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                        onPress={()=>{
                            this._onPress();
                            this.props.out[this.props.text] = inList
                        }}
                        style={{
                        width: this.props.wide *8 + 20,
                        height: 32,
                        borderRadius: 10,
                        marginTop:12,
                        marginRight: 8,
                        backgroundColor: colorVal,
                        justifyContent: 'center',
                        alignItems: 'center'
                        }}
                        >
                            <McText h5 style={{opacity: 0.5, letterSpacing: 0.5}}>{this.props.text}</McText>
                        </TouchableOpacity>
            </SafeAreaView>
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
  