import React, { useState } from 'react';
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
import { McText, McIcon, McAvatar} from '../components'
import { ScrollView } from 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native-web';
import InterestSelector from '../components/InterestSelect';


const inTags = ['Basketball', 'Bars', 'Thrift Stores']
var outTags = {}

for (var i = 0; i < inTags.length; i++) {
    outTags[inTags[i]] = true
}

function outDict(dict) {
    var outList = []
    for (const [key, value] of Object.entries(dict)) {
        if (value == true) {
            outList.push(key)
        }
    }
    return outList
 }

/*

*/
// outTags = []
const Interests = ({ navigation, route }) => {

  return (
    <SafeAreaView style={styles.container}>
        <SectionHeader>
        <View>
        <TouchableWithoutFeedback
        onPress={()=>{
          navigation.navigate('Featured')
        }}>
          <McIcon source ={icons.back_arrow}/>
        </TouchableWithoutFeedback>
          <McText h1>Interests</McText>
          <McText body2 style={{opacity: 0.2}}>Select the events you enjoy!</McText>
        </View>
      </SectionHeader>
      <ScrollView>
      <SectionInterests>
        <SectionList sections={[
                {title: 'Sports', data: ['Basketball', 'Football', 'Tennis', 'Badminton', 'Gymnastics', 'Swimming']},
                {title: 'Nightlife', data: ['Bars', 'Nightclubs', 'Concerts', 'Speakeasy']},
                {title: 'School', data: ['RSOs', 'Frats', 'Sorority', 'Group Study']},
                {title: 'Shopping', data: ['Malls', 'Designer', 'Decoration', 'Thrift Stores']},
                {title: 'Recreation', data:['Parks', 'Movies', 'Live Music', 'Theme Parks', 'Theater']},
                {title: 'Food', data:['Wine Tasting', 'Cafe', 'BBQ', 'Cocktails', 'Grilling', 'Neighborhood Party', 'Seafood', 'Michelin']}
            ]}
            renderItem={({item, index}) => {
                return null;
            }}
            renderSectionHeader={({section}) => (
                <View>
                <McText h3>{section.title}</McText>
                <ItemList>
                    <FlatList data={section.data}
                    columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, marginTop: 1, marginHorizontal: -25 }}
                    numColumns={3}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item, index})=>(
                        <InterestSelector text={item} wide={item.length} list={inTags} out={outTags}/>
                        )}
                        keyExtractor={(item) => `basicListEntry-${item.data}`}
                        />
                    </ItemList>
            </View>
            )}
            keyExtractor={(item) => `basicListEtry-${item.title}`}
            />
            </SectionInterests>
            </ScrollView>
            <SectionDone>
                <TouchableWithoutFeedback onPress={()=>{
                        navigation.navigate('Featured')
                        var ex = outDict(outTags)
                        console.log(ex)
                        }}
                        style={{
                            borderRadius: 10,
                            marginTop:12,
                            marginRight: 10,
                            backgroundColor: COLORS.gray,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                    <McText h2>DONE</McText>
                </TouchableWithoutFeedback>
            </SectionDone>
      </SafeAreaView>
      
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    // justifyContent: 'top',
    // alignItems: 'center',
  },
  buttonInactive: {
      
  }
});

const SectionHeader = styled.View`
  padding: 16px ${SIZES.padding};
  justify-content: space-between;
  flex-direction: row;
`;

const SectionDone = styled.View`
  padding: 20px ${SIZES.padding};
  backgroundColor:${COLORS.gray};
  justify-content: center;
  flex-direction: row;
`;


const SectionInterests = styled.View`

  padding: 5px ${SIZES.padding};
  justify-content: space-between;
  flex-direction: row;
`;

const ItemList = styled.View`
padding: 5px ${SIZES.padding};
marginBottom: 5px;
flex-direction: column;
justifyContent: center;

`

// const SectionList = styled.View`
//   padding: 16px ${SIZES.padding};
//   justify-content: space-between;
//   flex-direction: row;
// `;



export default Interests;


