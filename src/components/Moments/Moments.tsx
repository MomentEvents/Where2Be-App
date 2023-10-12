import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Modal,
  Animated,
  StatusBar,
  Button,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { Video } from 'expo-av';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get('window');
const screenRatio = height / width;
import { useNavigation } from "@react-navigation/native";

const Moments = () => {
    const navigation = useNavigation<any>();
  // THE CONTENT
  const [content, setContent] = useState([
    {
      content:
        'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/1.jpg?alt=media&token=63304587-513b-436d-a228-a6dc0680a16a',
      type: 'image',
      finish: 0,
    },
    {
      content:
        'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/2.mp4?alt=media&token=fcd41460-a441-4841-98da-d8f9a714dd4d',
      type: 'video',
      finish: 0,
    },
    {
      content:
        'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/3.jpg?alt=media&token=326c1809-adc2-4a23-b9c3-8995df7fcccd',
      type: 'image',
      finish: 0,
    },
    {
      content:
        'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/4.jpg?alt=media&token=e9c5bead-4d9f-40d9-b9fa-c6bc12dd6134',
      type: 'image',
      finish: 0,
    },
    {
      content:
        'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/5.jpg?alt=media&token=7dcb6c3a-8080-4448-bb2c-c9594e70e572',
      type: 'image',
      finish: 0,
    },
    {
      content:
        'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/6.jpg?alt=media&token=1121dc71-927d-4517-9a53-23ede1e1b386',
      type: 'image',
      finish: 0,
    },
    {
      content:
        'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/7.jpg?alt=media&token=7e92782a-cd84-43b6-aba6-6fe6269eded6',
      type: 'image',
      finish: 0,
    },
    {
      content:
        'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/8.mp4?alt=media&token=5b6af212-045b-4195-9d65-d1cab613bd7f',
      type: 'video',
      finish: 0,
    },
    {
      content:
        'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/9.jpg?alt=media&token=0a382e94-6f3f-4d4e-932f-e3c3f085ebc3',
      type: 'image',
      finish: 0,
    },
  ]);

  // for get the duration
  const [end, setEnd] = useState(0);
  // current is for get the current content is now playing
  const [current, setCurrent] = useState(0);
  // if load true then start the animation of the bars at the top
  const [load, setLoad] = useState(false);
  // progress is the animation value of the bars content playing the current state
  const progress = useRef(new Animated.Value(0)).current;

  // start() is for starting the animation bars at the top
  function start(n) {
    // checking if the content type is video or not
    if (content[current].type == 'video') {
      // type video
      if (load) {
        Animated.timing(progress, {
          toValue: 1,
          duration: n,
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (finished) {
            next();
          }
        });
      }
    } else {
      // type image
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          next();
        }
      });
    }
  }

  // handle playing the animation
  function play() {
    start(end);
  }

  // next() is for changing the content of the current content to +1
  function next() {
    // check if the next content is not empty
    if (current !== content.length - 1) {
      let data = [...content];
      data[current].finish = 1;
      setContent(data);
      setCurrent(current + 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      // the next content is empty
      close();
    }
  }

  // previous() is for changing the content of the current content to -1
  function previous() {
    // checking if the previous content is not empty
    if (current - 1 >= 0) {
      let data = [...content];
      data[current].finish = 0;
      setContent(data);
      setCurrent(current - 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      // the previous content is empty
      close();
    }
  }

  // closing the modal set the animation progress to 0
  function close() {
    progress.setValue(0);
    setLoad(false);
    console.log('close icon pressed');
  }

  return (
    <View style={styles.containerModal}>
    <StatusBar backgroundColor="black" barStyle="light-content" />
      <View style={styles.backgroundContainer}>
        {/* check the content type is video or an image */}
        {content[current].type == 'video' ? (
        //   <Video
        //     source={{
        //       uri: content[current].content,
        //     }}
        //     rate={1.0}
        //     volume={1.0}
        //     resizeMode="cover"
        //     shouldPlay={true}
        //     positionMillis={0}
        //     onReadyForDisplay={play()}
        //     onPlaybackStatusUpdate={AVPlaybackStatus => {
        //       console.log(AVPlaybackStatus);
        //       setLoad(AVPlaybackStatus.isLoaded);
        //       setEnd(AVPlaybackStatus.durationMillis);
        //     }}
        //     style={{ height: height, width: width }}
        //   />
        <></>
        ) : (
          <Image
            onLoadEnd={() => {
              progress.setValue(0);
              play();
            }}
            source={{
              uri: content[current].content,
            }}
            style={{ width: width, height: height, resizeMode: 'cover' }}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
        }}>
        <LinearGradient
          colors={['rgba(0,0,0,1)', 'transparent']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 100,
          }}
        />
        {/* ANIMATION BARS */}
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 10,
            paddingHorizontal: 10,
          }}>
          {content.map((index, key) => {
            return (
              // THE BACKGROUND
              <View
                key={key}
                style={{
                  height: 2,
                  flex: 1,
                  flexDirection: 'row',
                  backgroundColor: 'rgba(117, 117, 117, 0.5)',
                  marginHorizontal: 2,
                }}>
                {/* THE ANIMATION OF THE BAR*/}
                <Animated.View
                  style={{
                    flex: current == key ? progress : content[key].finish,
                    height: 2,
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  }}
                />
              </View>
            );
          })}
        </View>
        {/* END OF ANIMATION BARS */}

        <View
          style={{
            height: 50,
            flexDirection: 'row',

            justifyContent: 'space-between',
            paddingHorizontal: 15,
          }}>
          {/* THE AVATAR AND USERNAME  */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ height: 30, width: 30, borderRadius: 25 }}
              source={{
                uri:
                  'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/ylKTg2Mg_400x400.jpg?alt=media&token=fb4661aa-3a62-4af7-9051-86e5485ea36f',
              }}
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: 'white',
                paddingLeft: 10,
              }}>
              kikidding
            </Text>
          </View>
          {/* END OF THE AVATAR AND USERNAME */}
          {/* THE CLOSE BUTTON */}
          <TouchableOpacity
            onPress={() => {
              close();
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',

                height: 50,
                paddingHorizontal: 15,
              }}>
              <Ionicons name="ios-close" size={28} color="white" />
            </View>
          </TouchableOpacity>
          {/* END OF CLOSE BUTTON */}
        </View>
        {/* HERE IS THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableWithoutFeedback onPress={() => previous()}>
            <View style={{ flex: 1, backgroundColor: 'white' }} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => next()}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </View>
        {/* END OF THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
      </View>
    </View>
  );
}

export default Moments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    position: 'absolute',

    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
