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
  ScrollView
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get('window');
const screenRatio = height / width;
import React, { useContext, useEffect, useRef, useState } from "react";
import { McText } from "../Styled";
import { COLORS } from '../../constants';
import LoadImage from '../LoadImage/LoadImage';
import { getMomentsHome } from "../../services/MomentService";
import { UserContext } from '../../contexts/UserContext';
import { EventMoment, Moment, MomentHome } from "../../constants/types";
import moment from 'moment';

const MomentsHomeList = () => {
    const [eventIDs, setEventIDs] = useState<string[]>(null);
    const [currentEventID, setCurrentEventID] = useState<string>(null);
    const [currentEventIndex, setCurrentEventIndex] = useState<number>(null);
    const [events, setEvents] = useState<Record<string, EventMoment>>(null);


    // for get the duration
    const [end, setEnd] = useState(0);
    // current is for get the current content is now playing
    const [currentMomentIndex, setCurrentMomentIndex] = useState(0);
    // if load true then start the animation of the bars at the top
    const [load, setLoad] = useState(false);
    // progress is the animation value of the bars content playing the current state
    const progress = useRef(new Animated.Value(0)).current;

    // start() is for starting the animation bars at the top
    function start() {
        // checking if the content type is video or not
        if (events[currentEventID].Moments[currentMomentIndex].Type == 'video') {
            // type video
            if (load) {
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
        start();
    }

    // next() is for changing the content of the current content to +1
    function next() {
        // check if the next content is not empty
        if (currentMomentIndex !== events[currentEventID].Moments.length - 1) {
            let data = events;
            data[currentEventID].Moments[currentMomentIndex].Finish = 1;
            setEvents(data);
            setCurrentMomentIndex(currentMomentIndex + 1);
            progress.setValue(0);
            setLoad(false);
        } else if (currentEventIndex < eventIDs.length -1) {
            setCurrentEventID(eventIDs[currentEventIndex+1]);
            setCurrentEventIndex(currentEventIndex+1);
            setCurrentMomentIndex(0);
            progress.setValue(0);
            setLoad(false);
        } else {
            // the next content is empty
            close(true);
        }
    }

    // previous() is for changing the content of the current content to -1
    function previous() {
        // checking if the previous content is not empty
        if (currentMomentIndex - 1 >= 0) {
            let data = events;
            data[currentEventID].Moments[currentMomentIndex].Finish = 0;
            setEvents(data);
            setCurrentMomentIndex(currentMomentIndex - 1);
            progress.setValue(0);
            setLoad(false);
        } else {
            // the previous content is empty
            close();
        }
    }

    // closing the modal set the animation progress to 0
    function close(reset = false) {
        progress.setValue(0);
        setLoad(false);
        setCurrentEventID(null);
        setCurrentEventIndex(null);
        if (reset || currentMomentIndex >= events[currentEventID].Moments.length - 1) {
            setCurrentMomentIndex(0);
        } else {
            setCurrentMomentIndex(currentMomentIndex+1);
        }
    }

    const MomentPreview = ({ eventID, eventIndex }) => {
        console.log(eventIndex)
        console.log(eventID)
        return (
            <TouchableOpacity 
                style={styles.momentPreview}
                onPress={() => {
                    setCurrentEventID(eventID);
                    setCurrentEventIndex(eventIndex);
                }}
            >
                <LoadImage
                    imageSource={events[eventID].HostPicture}
                    imageStyle={styles.profile}
                />
            </TouchableOpacity>
        )
    }
    const { userToken, isAdmin } = useContext(UserContext);

    useEffect(() => {
        getMomentsHome(userToken.UserID, userToken.UserAccessToken).then((momentData: MomentHome) => {
            setEventIDs(momentData.EventIDs)
            setEvents(momentData.Events)
        })
    }, []);

    return (
        <>
        {
            events != null &&
            <ScrollView 
                horizontal
                style={styles.scrollViewContainer}
                showsHorizontalScrollIndicator={false}
            >
                <View style={styles.momentsContainer}>
                    {Object.keys(events).map((event_id, index) => (
                        <MomentPreview eventID={event_id} eventIndex={index} />
                    ))}
                </View>
            </ScrollView>
        }
        { currentEventID != null &&
            <Modal presentationStyle={'pageSheet'} >
                <View style={styles.backgroundContainer}>
                    {/* check the content type is video or an image */}
                    {events[currentEventID].Moments[currentMomentIndex].Type == 'video' ? (
                        <Video
                            source={{ uri: events[currentEventID].Moments[currentMomentIndex].MomentPicture }}
                            // rate={1.0}
                            // volume={1.0}
                            resizeMode={ResizeMode.COVER}
                            // shouldPlay={true}
                            // positionMillis={0}
                            // paused={false}
                            onReadyForDisplay={() => play()}
                            onLoad={x => {
                                setLoad(true);
                                start();
                            }}
                            // onPlaybackStatusUpdate={AVPlaybackStatus => {
                            //     console.log(AVPlaybackStatus);
                            //     setLoad(AVPlaybackStatus.isLoaded);
                            //     // setEnd(AVPlaybackStatus.durationMillis || 10000);
                            //     setEnd(5000);
                            // }}
                            style={{ height: height, width: width }}
                        /> ) : (
                            // <LoadImage
                            //     imageStyle={{ width: width, height: height, resizeMode: 'cover' }}
                            //     imageSource={events[currentEventID].moments[currentMomentIndex].momentPicture}
                            //     onLoadEnd={() => {
                            //         progress.setValue(0);
                            //         play();
                            //     }}
                            // />
                            <Image
                                onLoadEnd={() => {
                                    progress.setValue(0);
                                    play();
                                }}
                                source={{ uri: events[currentEventID].Moments[currentMomentIndex].MomentPicture }}
                                style={{ width: width, height: height, resizeMode: 'cover' }}
                            />
                        )
                    }
                </View>
                <View
                    style={{ flexDirection: 'column', flex: 1 }}>
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
                    <View style={{ flexDirection: 'row', paddingTop: 10, paddingHorizontal: 10 }} >
                        {events[currentEventID].Moments.map((index, key) => {
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
                                        flex: currentMomentIndex == key ? progress : events[currentEventID].Moments[key].Finish,
                                        height: 2,
                                        backgroundColor: 'rgba(255, 255, 255, 1)',
                                    }}
                                />
                            </View>
                            );
                        })}
                    </View>
                    {/* END OF ANIMATION BARS */}
            
                    <View style={{ height: 50, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
                        {/* THE AVATAR AND USERNAME  */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <LoadImage
                                imageStyle={styles.hostProfilePic}
                                imageSource={events[currentEventID].HostPicture}
                            />
                            <McText
                                h4
                                numberOfLines={1}
                                style={{ letterSpacing: 1, color: COLORS.white }}
                            >
                                {events[currentEventID].HostDisplayName}
                            </McText>
                        </View>
                        {/* END OF THE AVATAR AND USERNAME */}
                        {/* THE CLOSE BUTTON */}
                        <TouchableOpacity onPress={() => close()} >
                            <View style={{ alignItems: 'center', justifyContent: 'center', height: 50, paddingHorizontal: 15 }}>
                                <Ionicons name="ios-close" size={28} color="white" />
                            </View>
                        </TouchableOpacity>
                        {/* END OF CLOSE BUTTON */}
                    </View>
                    {/* HERE IS THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableWithoutFeedback onPress={() => previous()}>
                            <View style={{ flex: 1 }} />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => next()}>
                            <View style={{ flex: 1 }} />
                        </TouchableWithoutFeedback>
                    </View>
                    {/* END OF THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
                </View>
            </Modal>
        }
        </>
    )
}

export default MomentsHomeList

const styles = StyleSheet.create({
    scrollViewContainer: {
        marginTop: 10,
        paddingBottom: 30,
    },
    momentsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    momentPreview: {
        width: 80,
        height: 80,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: 'white',
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profile: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    hostProfilePic: {
        height: 35,
        width: 35,
        borderRadius: 30,
        marginRight: 10,
        borderWidth: 0.2,
        borderColor: COLORS.gray,
        justifyContent: "center",
        alignItems: "center",
    },
})