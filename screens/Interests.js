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

// const inTags = ['Basketball', 'Bars']
var outTags = {}

function outDict(dict) {

  var outList = []
  for (const [key, value] of Object.entries(dict)) {
      if (value == true) {
          outList.push(key)
      }
  }
  return outList
 }

 async function exportTags(outList) {
  await fetch('http://localhost:3001/delete_user_interest', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: 'user_1'
        })
    });
    await fetch('http://localhost:3001/export_user_interest', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          id: 'user_1',
          interest_list: outList
      })
  });
  console.log(outList)
 }

/*

*/
// outTags = []
const Interests = ({ navigation, route }) => {

    const [data, setData] = useState([]);
    const [inTags, setInTags] = useState([]);
    const [loading, setLoading] = useState(true);
    // var inTags = [];
    

    // Ensure fetch data runs first before everything else

    const fetchData = async () => {
        const resp = await fetch('http://localhost:3001/interests', {
            method: 'GET',
        });

        const data = await resp.json();
        
        
        

        const resp2 = await fetch('http://localhost:3001/import_interest_list', {
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

        setLoading(false);
    };
        
    
    
    // const resp2 = await fetch('http://localhost:3001/import_interest_list', {
    //     method: 'POST',
    // });




    useEffect(() => {
        fetchData();
    },[]);
    // const data = [
    //         {title: 'Creativity', data: ['Music', 'Crafts', 'Art', 'Dancing', 'Design', 'Makeup', 'Videography', 'Photography', 'Writing']},
    //         {title: 'Entertainment', data: ['Bars', 'Cafes', 'Concerts', 'Festivals', 'Karaoke', 'Museums/Galleries', 'Standup', 'Competitions', 'Theatre']},
    //         {title: 'Hobbies & Activities', data: ['Video Games', 'Sports', 'Nature', 'Anime/Manga', 'Animals', 'Tabletop Games', 'Adventure Sports', 'Music']},
    //         {title: 'Productivity', data: ['RSOs/Clubs', 'Business', 'Design', 'Entrepreneurship']},
    //         {title: 'Athletics', data:['Baseball', 'Basketball', 'Football', 'Golf', 'Gymnastics', 'Tennis', 'Track & Field', 'Wrestling', 'Soccer', 'Softball', 'Cross-Country', 'Volleyball', 'Swimming & Diving']},
    //         {title: 'Science', data:['Computer Engineering/CS', 'Math', 'Technology', 'Physics', 'Chemistry']},
    //         {title: 'Community', data:['Social', 'Fraternities', 'Sororities', 'Greek Life', 'Philanthropy', 'Service']}
    //     ]
        
    
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
              <McText style={{paddingLeft:28, paddingTop:8}} h3 >{heading}</McText>
                <ItemList>
                    <FlatList data={dataset}
                    columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, marginTop: 1, marginHorizontal: -25 }}
                    numColumns={3}
                    style={{
                        paddingLeft:26,
                        paddingRight:8,
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


  return (
    <View style={styles.container}>
      <LinearGradient
                colors = {['#252525', COLORS.black, COLORS.black,'#652070']}
                start = {{x: 0, y: 0}}
                end = {{ x: 1, y: 1}}
                style = {{padding:2, borderRadius: 20 }}>
        <SafeAreaView>
        <SectionHeader>
        <View>
          <TitleSec>
            <SecBackButton>
            <TouchableWithoutFeedback
              onPress={()=>{
              navigation.navigate('Featured')
              }}>
              <McIcon source ={icons.back_arrow} size={24}/>
            </TouchableWithoutFeedback></SecBackButton>
            <McText h1>Interests</McText>
          </TitleSec>
          <McText body2 style={{opacity: 0.2, marginLeft: 4}}>Select the events you enjoy!</McText>
        </View>
      </SectionHeader>
      <ScrollView>
      <SectionInterests>
      
      {makeLists(data)}
      </SectionInterests>
      </ScrollView>
      <SectionDone>
          <TouchableWithoutFeedback onPress={()=>{
                  navigation.navigate('Featured')
                  exportTags(outDict(outTags));
                  }}
                  style={{
                      borderRadius: 8,
                      marginTop:12,
                      marginRight: 8,
                      backgroundColor: COLORS.gray,
                  }}
              >
              <McText h2>DONE</McText>
          </TouchableWithoutFeedback>
      </SectionDone>
      </SafeAreaView>
      </LinearGradient>
    </View>
      
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const SectionHeader = styled.View`
  padding: 16px ${SIZES.padding};
  justify-content: space-between;
  flex-direction: row;
`;
const TitleSec = styled.View`
  marginLeft: -28px;
  alignItems: flex-start;
  flex-direction: row;
`;

const SecBackButton = styled.View`
  padding: 4px;
  alignItems: flex-start;
  flex-direction: row;
`;

const SectionDone = styled.View`
  padding: 16px ${SIZES.padding};
  backgroundColor:${COLORS.gray};
  justify-content: center;
  alignItems: center;
`;


const SectionInterests = styled.View`
  flex-direction: row;
  backgroundColor: transparent;
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