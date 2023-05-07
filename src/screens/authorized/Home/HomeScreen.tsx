import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import EventViewer from "../../../components/EventViewer/EventViewer";
import GradientButton from "../../../components/Styled/GradientButton";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { COLORS, SCREENS, User, Event, icons } from "../../../constants";
import { useNavigation } from "@react-navigation/native";
import HomeEvent from "../../../components/HomeEvent/HomeEvent";

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const createdEvent1: Event = {
    EventID: "hLT3hvPW_HCDJal4giA-uD_Ojo_Jt7pW9rDwGVWOyIk",
    Title: "Meditation by WPEs",
    Description:
      "Come unwind and destress at The Zone on Friday 4/7 from 11 am - 12 pm during a Meditation Workshop led by UCSD Student Well-Being Peer Educators.",
    Picture:
      "https://moment-events.s3.us-east-2.amazonaws.com/app-uploads/images/events/event-id/hLT3hvPW_HCDJal4giA-uD_Ojo_Jt7pW9rDwGVWOyIk/VxfPse8J9uprAnI6eUad5K0OQft3ub3hn13swMCKI1s.png",
    Location: "The Zone (next to Jamba Juice, in Price Center Plaza)",
    StartDateTime: new Date("2023-05-07T22:00:00Z"),
    EndDateTime: new Date("2023-05-07T23:00:00Z"),
    Visibility: "Public",
    NumJoins: 1,
    NumShoutouts: 0,
    UserJoin: false,
    UserShoutout: false,
  };

  const createdEvent2: Event = {
    EventID: "a-4n_x7HBXXYVSbtPNT9OMGMXSd6OA-6sk9CGOOWAoQ",
    Title: "Meditation by WPEs",
    Description:
      "We will go over some general tips for resumes, then at 7pm, multiple officers will host one-on-one casual resume review sessions. Come out to prep those resumes!",
    Picture:
      "https://moment-events.s3.us-east-2.amazonaws.com/app-uploads/images/events/event-id/a-4n_x7HBXXYVSbtPNT9OMGMXSd6OA-6sk9CGOOWAoQ/XjwPk9GNWIz8_LOG7ybgTj7Y2It46d5lTsM_wByCPok.png",
    Location: "The Zone (next to Jamba Juice, in Price Center Plaza)",
    StartDateTime: new Date("2023-05-07T22:00:00Z"),
    EndDateTime: new Date("2023-05-07T23:00:00Z"),
    Visibility: "Public",
    NumJoins: 1,
    NumShoutouts: 0,
    UserJoin: false,
    UserShoutout: false,
  };
  const createdEvent3: Event = {
    EventID: "8CZGpSyaHcA0MzcAICkdpRFpEd-nTJ1OaYLrH9P2LKU",
    Title: "Hands of the Past and Future",
    Description:
      "Come unwind and destress at The Zone on Friday 4/7 from 11 am - 12 pm during a Meditation Workshop led by UCSD Student Well-Being Peer Educators.",
    Picture:
      "https://moment-events.s3.us-east-2.amazonaws.com/app-uploads/images/events/event-id/8CZGpSyaHcA0MzcAICkdpRFpEd-nTJ1OaYLrH9P2LKU/k88Djh72_HsO5DEIywN4WSDm6TaV-hophZP7_mjS7u8.png",
    Location: "The Zone (next to Jamba Juice, in Price Center Plaza)",
    StartDateTime: new Date("2023-05-07T22:00:00Z"),
    EndDateTime: new Date("2023-05-07T23:00:00Z"),
    Visibility: "Public",
    NumJoins: 1,
    NumShoutouts: 0,
    UserJoin: false,
    UserShoutout: false,
  };
  const createdEvent4: Event = {
    EventID: "skU5LsIl2eoWfA1wJDlwZ3dSHRZnDs38xcOWrnGTi20",
    Title: "Polymer Clay Earrings",
    Description:
      "Come unwind and destress at The Zone on Friday 4/7 from 11 am - 12 pm during a Meditation Workshop led by UCSD Student Well-Being Peer Educators.",
    Picture:
      "https://moment-events.s3.us-east-2.amazonaws.com/app-uploads/images/events/event-id/skU5LsIl2eoWfA1wJDlwZ3dSHRZnDs38xcOWrnGTi20/QzaK-pXuAr9-zLktxzu7eN5vrJMOkPvORbaL5YUpQdE.png",
    Location: "The Zone (next to Jamba Juice, in Price Center Plaza)",
    StartDateTime: new Date("2023-05-07T22:00:00Z"),
    EndDateTime: new Date("2023-05-07T23:00:00Z"),
    Visibility: "Public",
    NumJoins: 1,
    NumShoutouts: 0,
    UserJoin: false,
    UserShoutout: false,
  };

  const createdEvent5: Event = {
    EventID: "dCkxQqOiZsFbRNGVlfxct1QWnLI9QTr22tLk5-2vz3w",
    Title: "Graduate School Student Panel",
    Description:
      "everyone Are you interested in applying to graduate school? Confused between a Masters, a Ph.D., or a BS/MS? Come hear from students from across different engineering disciplines about their experiences applying to graduate schools and how they made themselves stand out!",
    Picture:
      "https://moment-events.s3.us-east-2.amazonaws.com/app-uploads/images/events/event-id/dCkxQqOiZsFbRNGVlfxct1QWnLI9QTr22tLk5-2vz3w/4J1zJZcG12PD89B0PkP3fcNcMNypgMaHMFcpOEQNCyg.png",
    Location: "CSE Building",
    StartDateTime: new Date("2023-05-10T01:00:00Z"),
    EndDateTime: new Date("2023-05-10T02:00:00Z"),
    Visibility: "Public",
    NumJoins: 1,
    NumShoutouts: 0,
    UserJoin: false,
    UserShoutout: false,
  };

  const host1: User = {
    UserID: "fnDiI3UbQl1kaLLLwuOnq3fTro-KP6pgMMuHcQnt89c",
    DisplayName: "The Zone @ UCSD",
    Username: "thezoneucsd",
    Picture:
      "https://moment-events.s3.us-east-2.amazonaws.com/app-uploads/images/users/user-id/fnDiI3UbQl1kaLLLwuOnq3fTro-KP6pgMMuHcQnt89c/OQpIe21QcJ2JN5K6gXvvB2lzw81TJDAVRXtz3kv4leE.png",
  };

  const host2: User = {
    UserID: "063SJucuuBZg3MycOWxildtrZjgy9OrMZUJe2Epc2cs",
    DisplayName: "HKN Kappa Psi",
    Username: "hknkappapsi",
    Picture:
      "https://moment-events.s3.us-east-2.amazonaws.com/app-uploads/images/users/user-id/063SJucuuBZg3MycOWxildtrZjgy9OrMZUJe2Epc2cs/Y_5aqNo-JbP9MDBRfsN6yIDkmILLrcHEgkQTM7UmZcw.png",
  };

  const host3: User ={
    UserID: "tS-gfTkigELjlqacL_SxI4XcHiejQFJPcBfrYTED3n0",
    DisplayName: "ECE USC Discord",
    Username: "eceuscdiscord",
    Picture: "https://moment-events.s3.us-east-2.amazonaws.com/app-uploads/images/users/user-id/tS-gfTkigELjlqacL_SxI4XcHiejQFJPcBfrYTED3n0/P0R9GMDBeSYz2Sxo-0iBCt5gBDpLz1bCYSjHTTnsAaI.png"
  }
  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader title={"Home"} />
      <ScrollView
      showsVerticalScrollIndicator={false}
        contentContainerStyle={{ backgroundColor: COLORS.black }}
      >
        <HomeEvent event={createdEvent5} user={host3} />

        <HomeEvent event={createdEvent1} user={host1} />
        <HomeEvent event={createdEvent2} user={host2} />

        <HomeEvent event={createdEvent3} user={host1} />

        <HomeEvent event={createdEvent4} user={host1} />
      </ScrollView>
      <TouchableOpacity
        style={styles.hoverButtonContainer}
        onPressOut={() => {
          navigation.navigate(SCREENS.CreateEvent);
        }}
      >
        <GradientButton style={styles.hoverButtonIconContainer}>
          <icons.plus height="50%" width="50%"></icons.plus>
        </GradientButton>
      </TouchableOpacity>
    </MobileSafeView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.trueBlack,
  },
  hoverButtonContainer: {
    flex: 1,
    position: "absolute",
    right: 30,
    bottom: 30,
    borderRadius: 10,
  },
  hoverButtonIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 60,
    width: 60,
    borderRadius: 90,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
