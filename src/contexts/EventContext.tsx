import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Event, Interest } from "../constants";
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
import { updateUserJoinEvent, updateUserShoutoutEvent } from "../redux/events/eventSlice";
import { AlertContext } from "./AlertContext";

type EventContextType = {
  clientAddUserJoin: (eventID: string) => void;
  clientAddUserShoutout: (eventID: string) => void;
  clientRemoveUserJoin: (eventID: string) => void;
  clientRemoveUserShoutout: (eventID: string) => void;
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

  const {showErrorAlert} = useContext(AlertContext)

  const didJoinedEventsChangeRef = useRef(false);
  const didHostedEventsChangeRef = useRef(false);
  const newPostedEventHomePageRef = useRef(null);

  const { userToken } = useContext(UserContext);

  const dispatch = useDispatch<AppDispatch>();

  const clientAddUserJoin = (eventID: string) => {
    dispatch(updateUserJoinEvent({
      eventID: eventID,
      doJoin: true
    }))
    addUserJoinEvent(userToken.UserAccessToken, userToken.UserID, eventID)
      .then(() => {
        didJoinedEventsChangeRef.current = true;
      })
      .catch((error: CustomError) => {
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        }
        showErrorAlert(error)
        dispatch(updateUserJoinEvent({
          eventID: eventID,
          doJoin: false
        }))
      });
  };

  const clientAddUserShoutout = (eventID: string) => {
    dispatch(updateUserShoutoutEvent({
      eventID: eventID,
      doShoutout: true
    }))
    addUserShoutoutEvent(
      userToken.UserAccessToken,
      userToken.UserID,
      eventID
    ).catch((error: CustomError) => {
      if (error.showBugReportDialog) {
        showBugReportPopup(error);
      }
      showErrorAlert(error)
      dispatch(updateUserShoutoutEvent({
        eventID: eventID,
        doShoutout: false
      }))
    });
  };

  const clientRemoveUserJoin = (eventID: string) => {
    dispatch(updateUserJoinEvent({
      eventID: eventID,
      doJoin: false
    }))
    removeUserJoinEvent(userToken.UserAccessToken, userToken.UserID, eventID)
      .then(() => {
        // We'll still keep the user's personal calendar the same in case the user is on the calendar screen and wants to keep it on the calendar
        // didJoinedEventsChangeRef.current = true;
      })
      .catch((error: CustomError) => {
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        }
        showErrorAlert(error)
        dispatch(updateUserJoinEvent({
          eventID: eventID,
          doJoin: true
        }))
      });
  };

  const clientRemoveUserShoutout = (eventID: string) => {
    dispatch(updateUserShoutoutEvent({
      eventID: eventID,
      doShoutout: false
    }))
    removeUserShoutoutEvent(
      userToken.UserAccessToken,
      userToken.UserID,
      eventID
    ).catch((error: CustomError) => {
      if (error.showBugReportDialog) {
        showBugReportPopup(error);
      }
      showErrorAlert(error)
      dispatch(updateUserShoutoutEvent({
        eventID: eventID,
        doShoutout: true
      }))
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
        newPostedEventHomePageRef
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
