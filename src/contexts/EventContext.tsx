import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Event, Interest, Token } from "../constants";
import {
  addUserJoinEvent,
  addUserShoutoutEvent,
  removeUserJoinEvent,
  removeUserShoutoutEvent,
} from "../services/UserService";
import { UserContext } from "./UserContext";
import { CustomError } from "../constants/error";
import { showBugReportPopup } from "../helpers/helpers";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  updateEventMap,
  updateUserJoinEvent,
  updateUserShoutoutEvent,
} from "../redux/events/eventSlice";
import { AlertContext } from "./AlertContext";
import { updateUserMap } from "../redux/users/userSlice";

type EventContextType = {
  clientAddUserJoin: (eventID: string, shouldDisplayErrors?: boolean, currentToken?: Token) => void;
  clientAddUserShoutout: (eventID: string, currentToken?: Token) => void;
  clientRemoveUserJoin: (eventID: string, currentToken?: Token) => void;
  clientRemoveUserShoutout: (eventID: string, currentToken?: Token) => void;
  didJoinedEventsChangeRef: React.MutableRefObject<boolean>;
  didHostedEventsChangeRef: React.MutableRefObject<boolean>;
  newPostedEventHomePageRef: React.MutableRefObject<Event>;
};

export const EventContext = createContext<EventContextType>({
  clientAddUserJoin: null,
  clientAddUserShoutout: null,
  clientRemoveUserJoin: null,
  clientRemoveUserShoutout: null,
  didJoinedEventsChangeRef: null,
  didHostedEventsChangeRef: null,
  newPostedEventHomePageRef: null,
});

export const EventProvider = ({ children }) => {
  const newPostedEventIDRef = useRef<string>();

  const { showTextAlert, showErrorAlert } = useContext(AlertContext);

  const didJoinedEventsChangeRef = useRef(false);
  const didHostedEventsChangeRef = useRef(false);
  const newPostedEventHomePageRef = useRef(null);

  const { userToken } = useContext(UserContext);

  const dispatch = useDispatch<AppDispatch>();

  const lastJoinedActionEventIDToTime = useRef<{ [key: string]: Date }>({});
  const lastUnjoinedActionEventIDToTime = useRef<{ [key: string]: Date }>({});
  const lastShoutedOutActionEventIDToTime = useRef<{ [key: string]: Date }>({});
  const lastUnshoutedOutActionEventIDToTime = useRef<{ [key: string]: Date }>(
    {}
  );

  const rateLimitInSeconds = 1;

  const checkLastAction = (
    type: "join" | "unjoin" | "shoutout" | "unshoutout",
    eventID: string
  ): boolean => {
    const rightNow = new Date();
    let checkDate: Date;

    if (type === "join") {
      checkDate = lastJoinedActionEventIDToTime.current[eventID];
    } else if (type === "unjoin") {
      checkDate = lastUnjoinedActionEventIDToTime.current[eventID];
    } else if (type === "shoutout") {
      checkDate = lastShoutedOutActionEventIDToTime.current[eventID];
    } else {
      //unshoutout
      checkDate = lastUnshoutedOutActionEventIDToTime.current[eventID];
    }

    if (!checkDate) {
      // action performed for the first time
      if (type === "join") {
        lastJoinedActionEventIDToTime.current[eventID] = rightNow;
      } else if (type === "unjoin") {
        lastUnjoinedActionEventIDToTime.current[eventID] = rightNow;
      } else if (type === "shoutout") {
        lastShoutedOutActionEventIDToTime.current[eventID] = rightNow;
      } else {
        //unshoutout
        lastUnshoutedOutActionEventIDToTime.current[eventID] = rightNow;
      }
      return true;
    }

    console.log(rightNow.getTime());
    console.log(checkDate.getTime());

    console.log(rightNow.getTime() - checkDate.getTime());
    console.log(rateLimitInSeconds * 1000);

    if(rightNow.getTime() - checkDate.getTime() > rateLimitInSeconds * 1000){
      if (type === "join") {
        lastJoinedActionEventIDToTime.current[eventID] = rightNow;
      } else if (type === "unjoin") {
        lastUnjoinedActionEventIDToTime.current[eventID] = rightNow;
      } else if (type === "shoutout") {
        lastShoutedOutActionEventIDToTime.current[eventID] = rightNow;
      } else {
        //unshoutout
        lastUnshoutedOutActionEventIDToTime.current[eventID] = rightNow;
      }
      return true
    }

    return false
  };

  const clientAddUserJoin = (eventID: string, shouldDisplayErrors?: boolean, currentToken?: Token) => {
    if(!currentToken && !userToken){
      return
    }
    if (!checkLastAction("join", eventID)) {
      return;
    }
    dispatch(
      updateUserJoinEvent({
        eventID: eventID,
        doJoin: true,
      })
    );
    addUserJoinEvent(currentToken ? currentToken.UserAccessToken : userToken.UserAccessToken, currentToken ? currentToken.UserID : userToken.UserID, eventID)
      .then(() => {
        didJoinedEventsChangeRef.current = true;
      })
      .catch((error: CustomError) => {
        if(shouldDisplayErrors){
          //hotfix when ticketing joins because exiting out of the app immediately causes errors even though request went through
          if (error.showBugReportDialog) {
            showBugReportPopup(error);
          }
          showErrorAlert(error);
          dispatch(
            updateUserJoinEvent({
              eventID: eventID,
              doJoin: false,
            })
          );
        }
        else{
          console.log("THROWING ERROR")
        }
      });
  };

  const clientAddUserShoutout = (eventID: string, currentToken?: Token) => {
    if(!currentToken && !userToken){
      return
    }
    if (!checkLastAction("shoutout", eventID)) {
      return;
    }
    dispatch(
      updateUserShoutoutEvent({
        eventID: eventID,
        doShoutout: true,
      })
    );
    addUserShoutoutEvent(
      currentToken ? currentToken.UserAccessToken : userToken.UserAccessToken,
      currentToken ? currentToken.UserID : userToken.UserID,
      eventID
    ).catch((error: CustomError) => {
      if (error.showBugReportDialog) {
        showBugReportPopup(error);
      }
      showErrorAlert(error);
      dispatch(
        updateUserShoutoutEvent({
          eventID: eventID,
          doShoutout: false,
        })
      );
    });
  };

  const clientRemoveUserJoin = (eventID: string, currentToken?: Token) => {
    if(!currentToken && !userToken){
      return
    }
    if (!checkLastAction("unjoin", eventID)) {
      return;
    }

    dispatch(
      updateUserJoinEvent({
        eventID: eventID,
        doJoin: false,
      })
    );
    removeUserJoinEvent(
      currentToken ? currentToken.UserAccessToken : userToken.UserAccessToken,
      currentToken ? currentToken.UserID : userToken.UserID,
      eventID
    ).catch((error: CustomError) => {
      if (error.showBugReportDialog) {
        showBugReportPopup(error);
      }
      showErrorAlert(error);
      dispatch(
        updateUserJoinEvent({
          eventID: eventID,
          doJoin: true,
        })
      );
    });
  };

  const clientRemoveUserShoutout = (eventID: string, currentToken?: Token) => {
    if(!currentToken && !userToken){
      return
    }
    if (!checkLastAction("unshoutout", eventID)) {
      return;
    }

    dispatch(
      updateUserShoutoutEvent({
        eventID: eventID,
        doShoutout: false,
      })
    );
    removeUserShoutoutEvent(
      currentToken ? currentToken.UserAccessToken : userToken.UserAccessToken,
      currentToken ? currentToken.UserID : userToken.UserID,
      eventID
    ).catch((error: CustomError) => {
      if (error.showBugReportDialog) {
        showBugReportPopup(error);
      }
      showErrorAlert(error);
      dispatch(
        updateUserShoutoutEvent({
          eventID: eventID,
          doShoutout: true,
        })
      );
    });
  };

  return (
    <EventContext.Provider
      value={{
        clientAddUserJoin,
        clientAddUserShoutout,
        clientRemoveUserJoin,
        clientRemoveUserShoutout,
        didJoinedEventsChangeRef,
        didHostedEventsChangeRef,
        newPostedEventHomePageRef,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
