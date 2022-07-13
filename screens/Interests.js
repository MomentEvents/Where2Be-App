import React, { useState, useEffect } from 'react';
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

const inTags = ['Basketball', 'Bars']
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

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
    const resp = await fetch('http://localhost:3001/interests', {
        method: 'GET',
        });

        const data = await resp.json();
        
        setData(data);
        setLoading(false);
    };

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
        // const newData = data.map(dt=>dt.item)
        // console.log(newData)
        // var title = data[0]['title']
        // var datas = data[0]['data']
        // for (var ii = 0; ii < data.length; ii++) {
        //     var title = data[ii]['title']
        //     var datas = data[ii]['data']
        //     console.log(title, datas)
        // console.log(title,datas)
        // console.log('hello')
        return (
            <View>
            {data.map((daata) => 
            <View>
                {renderList(daata['title'], daata['data'])}
                {console.log(daata)}
            </View>

            )}
            </View>
        //     <View>
        //         {renderList(title, datas)}
        //     </View>
        )
    }

    const renderList = (heading, dataset) => {
        return (
          <SafeAreaView>
              <McText h3>{heading}</McText>
              
                <ItemList>
                    <FlatList data={dataset}
                    columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, marginTop: 1, marginHorizontal: -25 }}
                    numColumns={3}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item, index})=>(
                        <InterestSelector text={item} wide={item.length} list={inTags} out={outTags}/>
                        )}
                        keyExtractor={(item) => `basicListEntry-${item}`}
                        />
                </ItemList>
          </SafeAreaView>
        )
      }


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
      <ScrollView>{makeLists(data)}</ScrollView>
          
            <SectionDone>
                <TouchableWithoutFeedback onPress={()=>{
                        navigation.navigate('Featured')
                        var ex = outDict(outTags)
                        console.log(ex)
                        }}
                        style={{
                            borderRadius: 8,
                            marginTop:12,
                            marginRight: 8,
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
  padding: 16px ${SIZES.padding};
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