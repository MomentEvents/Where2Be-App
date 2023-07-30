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
import {
  updateEventMap,
  updateUserJoinEvent,
  updateUserShoutoutEvent,
} from "../redux/events/eventSlice";
import { AlertContext } from "./AlertContext";
import { updateUserMap } from "../redux/users/userSlice";

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

  const { showErrorAlert } = useContext(AlertContext);

  const didJoinedEventsChangeRef = useRef(false);
  const didHostedEventsChangeRef = useRef(false);
  const newPostedEventHomePageRef = useRef(null);

  const { userToken } = useContext(UserContext);

  const dispatch = useDispatch<AppDispatch>();

  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());



  const clientAddUserJoin = (eventID: string) => {
    clearTimeout(timeoutsRef.current.get(eventID));
  
    const initialState = !didJoinedEventsChangeRef.current; // save the initial state
  
    dispatch(
      updateUserJoinEvent({
        eventID: eventID,
        doJoin: true,
      })
    );
  
    timeoutsRef.current.set(
      eventID,
      setTimeout(() => {
        if (didJoinedEventsChangeRef.current !== initialState) {
          // state has changed, call removeUserJoin
          clientRemoveUserJoin(eventID);
        }
      }, 500)
    );
  };
  
  const clientRemoveUserJoin = (eventID: string) => {
    clearTimeout(timeoutsRef.current.get(eventID));
  
    const initialState = didJoinedEventsChangeRef.current; // save the initial state
  
    dispatch(
      updateUserJoinEvent({
        eventID: eventID,
        doJoin: false,
      })
    );
  
    timeoutsRef.current.set(
      eventID,
      setTimeout(() => {
        if (didJoinedEventsChangeRef.current !== initialState) {
          // state has changed, call addUserJoin
          clientAddUserJoin(eventID);
        }
      }, 500)
    );
  };

  const clientAddUserShoutout = (eventID: string) => {
    dispatch(
      updateUserShoutoutEvent({
        eventID: eventID,
        doShoutout: true,
      })
    );
    addUserShoutoutEvent(userToken.UserAccessToken, userToken.UserID, eventID)
      .then(() => {
        dispatch(
          updateEventMap({ id: eventID, changes: { UserShoutout: true } })
        );
      })
      .catch((error: CustomError) => {
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


  const clientRemoveUserShoutout = (eventID: string) => {
    dispatch(
      updateUserShoutoutEvent({
        eventID: eventID,
        doShoutout: false,
      })
    );
    removeUserShoutoutEvent(
      userToken.UserAccessToken,
      userToken.UserID,
      eventID
    )
      .then(() => {
        dispatch(
          updateEventMap({ id: eventID, changes: { UserShoutout: false } })
        );
      })
      .catch((error: CustomError) => {
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
