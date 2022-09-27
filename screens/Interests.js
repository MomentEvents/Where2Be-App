import React, { useState, useEffect, useContext } from 'react';
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
import { AuthContext } from '../AuthContext';

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

//  async function exportTags(outList) {
//   console.log('starting export');
//   await fetch('http://10.0.2.2:8080/delete_user_interest', {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           UserId: UserId
//         })
//     });
//     await fetch('http://10.0.2.2:8080/export_user_interest', {
//       method: 'POST',
//       headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         UserId: UserId,
//           interest_list: outList
//       })
//   });
//   console.log(outList)
//  }

/*

*/
// outTags = []
const Interests = ({ navigation, route }) => {

    const [data, setData] = useState([]);
    const [inTags, setInTags] = useState([]);
    const [loading, setLoading] = useState(true);
    // var inTags = [];
    const {UserId} = useContext(AuthContext)

    // Ensure fetch data runs first before everything else

    const fetchData = async () => {
        const resp = await fetch('http://10.0.2.2:8080/interests', {
            method: 'GET',
        });
        const data = await resp.json();
        const resp2 = await fetch('http://10.0.2.2:8080/import_interest_list', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              UserId: UserId
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
        
    const exportTags = async (outList) =>{
      await fetch('http://10.0.2.2:8080/delete_user_interest', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              UserId: UserId
            })
        });
        await fetch('http://10.0.2.2:8080/export_user_interest', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            UserId: UserId,
              interest_list: outList
          })
      });
      console.log(outList)
     }
    
    // const resp2 = await fetch('http://3.136.67.161:8080//import_interest_list', {
    //     method: 'POST',
    // });




    useEffect(() => {
        fetchData();
    },[]);
        
    const makeLists = (data) => {
        return (
            <View>
            {data.map((daata) => 
            // <View>
            //     {renderList(daata['title'], daata['data'])}
            // </View>
            <View>
              <McText style={{paddingLeft:20, paddingTop:8}} h3 >{daata['title']}</McText>
                <ItemList>
                    <FlatList data={daata['data']}
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

            )}
            </View>
        )
    }


  return (
    <View style={styles.container}>
      
      <SafeAreaView>
        <SectionHeader>
          <View>
            <TitleSec>
              <SecBackButton>
              <TouchableWithoutFeedback
                onPress={()=>{
                  navigation.goBack();
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
          <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 80,
            borderWidth: 1,
            borderColor: COLORS.gray,
            backgroundColor: COLORS.input,
            justifyContent: 'center',
            alignItems: 'center'
            }}
          onPress={()=>{
                      navigation.navigate('Featured');
                      exportTags(outDict(outTags));
                      }}
                  >
                  <McIcon source={icons.check} size={44} style={{
                    tintColor: COLORS.white,
                  }}/>
          </TouchableOpacity>
        </SectionDone>
      
      </SafeAreaView>
    </View>
      
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
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
  alignItems: flex-start;
  flex-direction: row;
`;

const SecBackButton = styled.View`
  padding: 4px;
  alignItems: flex-start;
  flex-direction: row;
`;

const SectionDone = styled.View`
  flex: 1;
  position: absolute;
  bottom: 0;
  right: 1;
  backgroundColor: transparent;
  margin: 32px;
`;


const SectionInterests = styled.View`
  flex-direction: row;
  backgroundColor: transparent;
`;

const ItemList = styled.View`
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