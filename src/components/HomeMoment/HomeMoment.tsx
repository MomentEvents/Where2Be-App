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
  ScrollView,
  FlatList
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Constants from 'expo-constants';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get('window');
const screenRatio = height / width;
import React, { useContext, useEffect, useRef, useState } from "react";
import { McText } from "../Styled";
import { COLORS, SCREENS, icons } from '../../constants';
import LoadImage from '../LoadImage/LoadImage';
import { getMomentsHome } from "../../services/MomentService";
import { UserContext } from '../../contexts/UserContext';
import { EventMoment, Moment, MomentHome, User } from "../../constants/types";
import GradientButton from '../Styled/GradientButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { selectUserByID } from '../../redux/users/userSelectors';
import { useNavigation } from '@react-navigation/native';

const HomeMoment = () => {
    const flatListRef = useRef<FlatList>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
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
    // // progress is the animation value of the bars content playing the current state
    // const progress = useRef(new Animated.Value(0)).current;

    // start() is for starting the animatiron bars at the top
    const start = (eventID: string, momentIndex: number) => {
        const progress = (events[eventID].Moments[momentIndex].Finish as any)._value
        console.log("starting eventID: " + eventID + ", momentIndex: " + momentIndex + ", progress: " + progress)
        // checking if the content type is video or not
        if (events[eventID].Moments[momentIndex].Type == 'video') {
            // type video
            if (load) {
                Animated.timing(events[eventID].Moments[momentIndex].Finish, {
                    toValue: 1,
                    duration: 5000 * (1 - progress),
                    useNativeDriver: false,
                }).start(({ finished }) => {
                    if (finished) {
                        next(eventID, momentIndex);
                    }
                });
            }
        } else {
            // type image
            Animated.timing(events[eventID].Moments[momentIndex].Finish, {
                toValue: 1,
                duration: 5000 * (1 - progress),
                useNativeDriver: false,
            }).start(({ finished }) => {
                if (finished) {
                    next(eventID, momentIndex);
                }
            });
        }
    }

    const pauseAnimation = () => {
        events[currentEventID].Moments[currentMomentIndex].Finish.stopAnimation(value => {});
    }
    
    const handleScroll = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newEventIndex = Math.floor(offsetX / width);
        if (newEventIndex >= 0 && newEventIndex < eventIDs.length){
            const newEventID = eventIDs[newEventIndex]
            if (newEventID != currentEventID){
                events[currentEventID].Moments[currentMomentIndex].Finish.setValue(0);
                setCurrentEventID(newEventID);
                for (var i = 0; i < events[newEventID].Moments.length; i++){
                    if ((events[newEventID].Moments[i].Finish as any)._value == 0){
                        start(newEventID, i);
                        return
                    }
                }
                start(newEventID, events[newEventID].Moments.length-1);
            }
        }
    }

    // next() is for changing the content of the current content to +1
    const next = (eventID: string, momentIndex: number) => {
        const eventIndex = eventIDs.indexOf(eventID)
        // check if the next content is not empty
        if (momentIndex < events[eventID].Moments.length - 1) {
            events[eventID].Moments[momentIndex].Finish.setValue(1);
            setCurrentMomentIndex(momentIndex + 1);
            setLoad(false);
        } 
        // else if (eventIndex != eventIDs.length -1) {
        //     const newEventIndex = eventIndex + 1;
        //     events[eventID].Moments[momentIndex].Finish.setValue(0);
        //     setCurrentEventID(eventIDs[newEventIndex]);
        //     setCurrentEventIndex(newEventIndex);
        //     setCurrentMomentIndex(0);
        //     setLoad(false);
        //     if (flatListRef.current) {
        //         flatListRef.current.scrollToIndex({ index: newEventIndex, animated: true });
        //     }
        // } 
        else {
            // the next content is empty
            close(true);
        }
    }

    // previous() is for changing the content of the current content to -1
    const previous = () => {
        events[currentEventID].Moments[currentMomentIndex].Finish.setValue(0);
        // checking if the previous content is not empty
        if (currentMomentIndex > 0) {
            events[currentEventID].Moments[currentMomentIndex - 1].Finish.setValue(0);
            setCurrentMomentIndex(currentMomentIndex - 1);
            setLoad(false);
        } else if (currentEventIndex > 0) {
            const newEventID = eventIDs[currentEventIndex - 1];
            setCurrentEventID(newEventID);
            setCurrentEventIndex(currentEventIndex - 1);
            for (var i = 0; i < events[newEventID].Moments.length; i++){
                if ((events[newEventID].Moments[i].Finish as any)._value == 0){
                    start(newEventID, i);
                    return
                }
            }
            if (flatListRef.current) {
                const offset = 0 - width
                console.log(offset)
                flatListRef.current.scrollToIndex({index: currentEventIndex-1, animated: true});
            }
            setLoad(false);
        } else {
            start(eventIDs[0], 0);
        }
    }

    // closing the modal set the animation progress to 0
    const close = (reset = false) => {
        setShowModal(false);
        setLoad(false);
        if (reset) {
            resetFinishes();
            setCurrentMomentIndex(0);
            setCurrentEventID(null);
            setCurrentEventIndex(null);
        } else {
            events[currentEventID].Moments[currentMomentIndex].Finish.setValue(0);
        }
        setShowModal(false);
    }

    const resetFinishes = (toValue = new Animated.Value(0), exceptLast = false) => {
        let data = events;
        let len =  data[currentEventID].Moments.length;
        if (exceptLast){
            len = len-1;
        }
        for (let i = 0; i < len; i++) {
            data[currentEventID].Moments[i].Finish = toValue;
        }
        setEvents(data);
    }

    const getTimeDifferenceString = (posted_date_time) => {
        const postedDate = new Date(posted_date_time);
        const currentDate = new Date();
        const timeDifferenceInMilliseconds = Number(currentDate) - Number(postedDate);

        if (timeDifferenceInMilliseconds >= 24 * 60 * 60 * 1000) {
            // If the difference is 24 hours or more
            const days = Math.floor(timeDifferenceInMilliseconds / (24 * 60 * 60 * 1000));
            return `${days}d`;
        } else if (timeDifferenceInMilliseconds >= 60 * 60 * 1000) {
            // If the difference is 1 hour or more
            const hours = Math.floor(timeDifferenceInMilliseconds / (60 * 60 * 1000));
            return `${hours}h`;
        } else if (timeDifferenceInMilliseconds >= 60 * 1000) {
            // If the difference is between 1 hour and 1 minute
            const minutes = Math.floor(timeDifferenceInMilliseconds / (60 * 1000));
            return `${minutes}m`;
        } else {
            // If the difference is less than 1 minute
            const seconds = Math.floor(timeDifferenceInMilliseconds / 1000);
            return `${seconds}s`;
        }
    }

    const navigation = useNavigation<any>();
    const goToUploaderProfile = (user_id: string) => {
        events[currentEventID].Moments[currentMomentIndex].Finish.setValue(0);
        setShowModal(false);
        navigation.push(SCREENS.ProfileDetails, { userID: user_id });
    }

    const findMomentIndex = (eventID: string) => {
        let i = 0
        for (const moment of events[eventID].Moments){
            if ((moment.Finish as any)._value < 1) {
                setCurrentMomentIndex(i);
                break;
            }
            i++;
        }
    }

    const MomentPreview = ({ eventID, eventIndex }) => {
        return (
            <TouchableOpacity 
                style={styles.momentPreview}
                onPress={() => {
                    setCurrentEventID(eventID);
                    setCurrentEventIndex(eventIndex);
                    setShowModal(true);
                    findMomentIndex(eventID);
                }}
            >
                    <LoadImage
                        imageSource={events[eventID].EventPicture}
                        imageStyle={styles.profile}
                    />
                    <LoadImage
                        imageSource={events[eventID].HostPicture}
                        imageStyle={styles.smallButtonContainer}
                    />
            </TouchableOpacity>
        )
    }

    const { userToken, isAdmin } = useContext(UserContext);
    const currentUser = useSelector((state: RootState) =>
        selectUserByID(state, userToken.UserID)
    );

    useEffect(() => {
        getMomentsHome(userToken.UserID, userToken.UserAccessToken).then((momentData: MomentHome) => {
            setEventIDs(momentData.EventIDs);
            setEvents(momentData.Events);
        })
    }, []);

    useEffect(() => {
        console.log("currentEventID: " + currentEventID);
        console.log("currentMomentIndex: " + currentMomentIndex);
    }, [currentEventID, currentMomentIndex]);

    return (
        <>
        {
            currentUser && events != null &&
            <ScrollView 
                horizontal
                style={styles.scrollViewContainer}
                showsHorizontalScrollIndicator={false}
            >
                <View style={styles.momentsContainer}>
                    <TouchableOpacity 
                        style={styles.momentPreview}
                        onPress={() => {
                            navigation.push(SCREENS.MomentUpload)
                        }}
                    >
                        <LoadImage
                            imageSource={currentUser.Picture}
                            imageStyle={styles.profile}
                        />
                        <GradientButton style={styles.smallButtonContainer}>
                            <icons.plus height="50%" width="50%"></icons.plus>
                        </GradientButton>
                    </TouchableOpacity>
                    {Object.keys(events).map((event_id, index) => (
                        <MomentPreview key={event_id} eventID={event_id} eventIndex={index} />
                    ))}
                </View>
            </ScrollView>
        }
        { showModal && events &&
            <Modal presentationStyle={'pageSheet'} >
                <FlatList
                    ref={flatListRef}
                    pagingEnabled
                    horizontal
                    decelerationRate={0} // Disable deceleration
                    snapToInterval={width} // Calculate the size for a card including marginLeft and marginRight
                    snapToAlignment='center' // Snap to the center
                    contentInset={{ // iOS ONLY
                        top: 0,
                        left: 0, // Left spacing for the very first card
                        bottom: 0,
                        right: 0 // Right spacing for the very last card
                    }}
                    onScrollBeginDrag={pauseAnimation}
                    // onScrollEndDrag={resumeAnimation}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    data={eventIDs}
                    renderItem={({item, index}) => (
                        <View key={item} style={{ width: width, height: height }}>
                            <View style={styles.backgroundContainer}>
                                {currentMomentIndex == 0 || events[currentEventID].Moments[currentMomentIndex].Type == 'video' ? (
                                    <Video
                                        // source={{ uri: events[currentEventID].Moments[currentMomentIndex].MomentPicture }}
                                        source={require('./video.mp4')}
                                        resizeMode={ResizeMode.COVER}
                                        shouldPlay={true}
                                        onReadyForDisplay={() => start(currentEventID, currentMomentIndex)}
                                        onLoad={x => {
                                            setLoad(true);
                                            start(currentEventID, currentMomentIndex);
                                        }}
                                        // onPlaybackStatusUpdate={AVPlaybackStatusSuccess => {
                                        //     console.log(AVPlaybackStatusSuccess);
                                        //     setLoad(AVPlaybackStatusSuccess.isLoaded);
                                        //     setEnd(5000);
                                        // }}
                                        style={{ height: height, width: width }}
                                    /> ) : (
                                    <LoadImage
                                        imageKey={events[currentEventID].Moments[currentMomentIndex].MomentID}
                                        imageStyle={{ width: width, height: height, resizeMode: 'cover' }}
                                        imageSource={events[currentEventID].Moments[currentMomentIndex].MomentPicture}
                                        onLoadEndFunc={() => {
                                            events[currentEventID].Moments[currentMomentIndex].Finish.setValue(0);
                                            start(currentEventID, currentMomentIndex);
                                        }}
                                        imageBlurRadius={events[currentEventID].Visible? 0 : 15}
                                    />
                                )}
                            </View>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
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

                                <View style={{ flexDirection: 'row', paddingTop: 10, paddingHorizontal: 10 }} >
                                    {events[currentEventID].Moments.map((index, key) => {
                                        return (
                                            <View
                                                key={key}
                                                style={{
                                                    height: 2,
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                    backgroundColor: 'rgba(117, 117, 117, 0.5)',
                                                    marginHorizontal: 2,
                                                }}
                                            >
                                                <Animated.View
                                                    style={{
                                                        flex: events[currentEventID].Moments[key].Finish,
                                                        height: 2,
                                                        backgroundColor: 'rgba(255, 255, 255, 1)',
                                                    }}
                                                />
                                            </View>
                                        );
                                    })}
                                </View>
                        
                                <View style={{ height: 50, width: '100%', flexDirection: 'row', paddingHorizontal: 15 }}>
                                    <TouchableOpacity 
                                        style={{ flexDirection: 'row', alignItems: 'center', maxWidth: '75%'}}
                                        onPress={() => goToUploaderProfile(events[currentEventID].Moments[currentMomentIndex].UploaderID)}
                                    >
                                        <LoadImage
                                            imageStyle={styles.uploaderProfilePic}
                                            imageSource={events[currentEventID].Moments[currentMomentIndex].UploaderPicture}
                                        />
                                        <McText
                                            h4
                                            numberOfLines={1}
                                            style={{ letterSpacing: 1, color: COLORS.white, maxWidth: '85%' }}
                                        >
                                            {events[currentEventID].Moments[currentMomentIndex].UploaderDisplayName} 
                                        </McText>
                                    </TouchableOpacity>
                                    <View style={{ justifyContent: 'center', height: 50, paddingLeft: 10 }}>
                                        <McText
                                            body4
                                            numberOfLines={1}
                                            style={{ letterSpacing: 1, color: COLORS.white }}
                                        >
                                            {getTimeDifferenceString(events[currentEventID].Moments[currentMomentIndex].PostedDateTime)}
                                        </McText>
                                    </View>
                                    <TouchableOpacity 
                                        onPress={() => close()} 
                                        style={{ justifyContent: 'center', height: 50, marginLeft: 'auto' }}
                                    >
                                        <Ionicons name="ios-close" size={28} color="white" />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TouchableWithoutFeedback onPress={() => previous()}>
                                        <View style={{ flex: 1 }} />
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => next(currentEventID, currentMomentIndex)}>
                                        <View style={{ flex: 1 }} />
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </View>
                    )}
                />
            </Modal>
        }
        </>
    )
}

export default HomeMoment

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
        borderRadius: 40,
        borderWidth: 3,
        borderColor: 'white',
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profile: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    uploaderProfilePic: {
        height: 35,
        width: 35,
        borderRadius: 30,
        marginRight: 10,
        borderWidth: 0.2,
        borderColor: COLORS.gray,
        justifyContent: "center",
        alignItems: "center",
    },
    smallButtonContainer: {
        position: "absolute",
        bottom: -10,
        right: -10,
        height: 35,
        width: 35,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
})