import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient'
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
    TouchableWithoutFeedback,
    DevSettings
 } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';


import { dummyData, FONTS, SIZES, COLORS, icons, images} from '../constants';
import events from '../constants/events.json'
import { McText, McIcon, McAvatar} from '../components'
import { ScrollView } from 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native-web';
import InterestSelector from '../components/InterestSelect'

const Item  = ({data}) => {
    <View>
        <Text>{data.title}</Text>
        {console.log(data.title, "title")}
    </View>
}


export default function NewInterest ( ) {
    const[data, setData] = useState([])
    console.log(data[0])
    

    const makeLists = (data) => {
        return (
            <View>
            {data.map((daata) => 
            <SafeAreaView>
                {renderList(daata['title'], daata['data'])}
            </SafeAreaView>

            )}
            </View>
        )
    }

    const renderList = (heading, dataset) => {

        return (
          <View>
              <McText style={{paddingLeft:20, paddingTop:8}} h3 >{heading}</McText>
                <ItemList>
                    <FlatList data={dataset}
                    columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, marginTop: 1, marginHorizontal: 25 }}
                    numColumns={3}
                    style={{
                        paddingLeft:10,
                        paddingRight:10,
                        backgroundColor: 'transparent',
                    }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item, index})=>(
                        <InterestSelector text={item} wide={item.length} list={inTags} out={outTags}/>
                        )}
                        keyExtractor={(item) => `basicListEntry-${item}`}
                        />
                </ItemList>
          </View>
        )
      }


    const fetchData = async () => {
        const resp = await fetch('http://mighty-chamber-83878.herokuapp.com/interests', {
            method: 'GET',
        });

        const data = await resp.json();
        // console.log(data)
        
        const resp2 = await fetch('http://mighty-chamber-83878.herokuapp.com/import_interest_list', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: 'user_1'
            })
        });
        const inTags = await resp2.json();

        
        

        for (var i = 0; i < inTags.length; i++) {
            outTags[inTags[i]] = true
        }

        setInTags(inTags);
        setData(data);

    };

    useEffect(()=>{
        fetchData()
    }, [])
    //  console.log(data)



    const renderItem = ({item})  => {
        <Item data={item}/>
        console.log(data)
 }
    return (
        <View>
            <Text>hello</Text>
            <ScrollView><Text>{makeLists(data)}</Text></ScrollView>
          
        </View>
    )
}

