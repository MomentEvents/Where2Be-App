import React, {useState, useEffect, useCallback} from 'react';
// import { Text, View, StyleSheet } from 'react-native';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Platform, TouchableOpacity } from 'react-native';
import { McIcon, McText } from '../components';
import { dummyData, FONTS, SIZES, COLORS, icons } from '../constants';
import styled from 'styled-components';
import { LinearGradient } from 'expo-linear-gradient'

const OrganizationDetail = ({ navigation, route }) => {

    const [selectedEvent, setSelectedEvent] = useState(null);
    // var inTags = [];
    

    // Ensure fetch data runs first before everything else

    async function get_events(ID_1) 
    {
        // console.log(ID_1);
        // if (ID_1 !== undefined)
        // {
        //     console.log(ID_1);
        //     const resp = await fetch('http://10.0.2.2:3000/organization_events', {
        //         method: 'POST',
        //         headers: {
        //             Accept: 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             id: ID_1
        //         })
        //     });

        //     const data = await resp.json();
        //     console.log(data);
        // }
        return(
            <McText h3 style={{
                opacity: 0.8,
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginTop: -1, 
                }}>
                    Name
            </McText>
        );
    }
        
    // const resp2 = await fetch('http://localhost:3001/import_interest_list', {
    //     method: 'POST',
    // });

    useEffect(()=>{
        let {selectedEvent} = route.params;
        setSelectedEvent(selectedEvent);
    },[])
  return (
    <View style={styles.container}>
        <LinearGradient
            colors = {['#252525', COLORS.black,COLORS.black,'#003060']}
            start = {{x: 0, y: 0}}
            end = {{ x: 1, y: 1}}
            style = {{padding:2, borderRadius: 20 }}>
            <ScrollView 
            contentContainerStyle={{
                backgroundColor: 'transparent'
            }}
            style={{
                backgroundColor: 'transparent',
                //temp fix for padding
                paddingBottom: 300,
            }}
            >
                {/*ImageBackground*/}
                <ImageBackground
                resizeMode='cover'
                source={{uri:selectedEvent?.image}}
                style = {{
                    width: '100%',
                    height: 
                    SIZES.height < 700? SIZES.height * 0.4 : SIZES.height * 0.5,
                }}
                ></ImageBackground>
                </ScrollView>
        <View>
            <SectionImageHeader>
                <TouchableOpacity 
                    onPress={() =>{
                    navigation.goBack();
                    }}
                    style={{
                    width: 56,
                    height: 40,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 13,
                    }}>
                    <McIcon source={icons.back_arrow} size={24}/>
                </TouchableOpacity>
            </SectionImageHeader> 
        </View>
        
        <Text style={{ color: '#fff', fontSize: 30 }}>OrganddddddddizationHIDetail</Text>
        <McText h3 style={{
            opacity: 0.8,
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginTop: -1, 
            }}>
                {selectedEvent?.userID}
                
        </McText>
        </LinearGradient>
        {/* {get_events(selectedEvent?.userID)} */}
    </View>
  );
};

const SectionImageHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-left: 30px;
  margin-right: 30px;
  
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrganizationDetail;
