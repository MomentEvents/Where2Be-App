import React, {
  createContext,
  useContext,
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

type EventContextType = {
  eventIDToEvent: { [key: string]: Event };
  updateEventIDToEvent: React.Dispatch<{
    id: string;
    event: Event;
  }>;
  eventIDToInterests: { [key: string]: Interest[] };
  updateEventIDToInterests: React.Dispatch<{
    id: string;
    interests: Interest[];
  }>;
  clientAddUserJoin: (eventID: string) => void;
  clientAddUserShoutout: (eventID: string) => void;
  clientRemoveUserJoin: (eventID: string) => void;
  clientRemoveUserShoutout: (eventID: string) => void;
  didJoinedEventsChangeRef: React.MutableRefObject<boolean>;
  didHostedEventsChangeRef: React.MutableRefObject<boolean>;
  newPostedEventHomePageRef: React.MutableRefObject<Event>;
};

export const EventContext = createContext<EventContextType>({
  eventIDToEvent: null,
  updateEventIDToEvent: null,
  eventIDToInterests: null,
  updateEventIDToInterests: null,
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
  const [eventIDToEvent, updateEventIDToEvent] = useReducer(setEventMap, {});
  const [eventIDToInterests, updateEventIDToInterests] = useReducer(
    setInterestsMap,
    {}
  );

  const didJoinedEventsChangeRef = useRef(false);
  const didHostedEventsChangeRef = useRef(false);
  const newPostedEventHomePageRef = useRef(null);

  const { userToken } = useContext(UserContext);

  function setEventMap(
    map: { [key: string]: Event },
    action: { id: string; event: Event }
  ) {
    return {
      ...map,
      [action.id]: { ...map[action.id], ...action.event }
    };
  }

  const clientAddUserJoin = (eventID: string) => {
    updateEventIDToEvent({
      id: eventID,
      event: {
        ...eventIDToEvent[eventID],
        UserJoin: true,
        NumJoins: eventIDToEvent[eventID].NumJoins + 1,
      },
    });
    addUserJoinEvent(userToken.UserAccessToken, userToken.UserID, eventID)
      .then(() => {
        didJoinedEventsChangeRef.current = true;
      })
      .catch((error: CustomError) => {
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        }
        updateEventIDToEvent({
          id: eventID,
          event: {
            ...eventIDToEvent[eventID],
            UserJoin: false,
            NumJoins: eventIDToEvent[eventID].NumJoins - 1,
          },
        });
      });
  };

  const clientAddUserShoutout = (eventID: string) => {
    updateEventIDToEvent({
      id: eventID,
      event: {
        ...eventIDToEvent[eventID],
        UserShoutout: true,
        NumShoutouts: eventIDToEvent[eventID].NumShoutouts + 1,
      },
    });
    addUserShoutoutEvent(
      userToken.UserAccessToken,
      userToken.UserID,
      eventID
    ).catch((error: CustomError) => {
      if (error.showBugReportDialog) {
        showBugReportPopup(error);
      }
      updateEventIDToEvent({
        id: eventID,
        event: {
          ...eventIDToEvent[eventID],
          UserShoutout: false,
          NumShoutouts: eventIDToEvent[eventID].NumShoutouts - 1,
        },
      });
    });
  };

  const clientRemoveUserJoin = (eventID: string) => {
    updateEventIDToEvent({
      id: eventID,
      event: {
        ...eventIDToEvent[eventID],
        UserJoin: false,
        NumJoins: eventIDToEvent[eventID].NumJoins - 1,
      },
    });
    removeUserJoinEvent(userToken.UserAccessToken, userToken.UserID, eventID)
      .then(() => {
        // We'll still keep the user's personal calendar the same in case the user is on the calendar screen and wants to keep it on the calendar
        // didJoinedEventsChangeRef.current = true;
      })
      .catch((error: CustomError) => {
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        }
        updateEventIDToEvent({
          id: eventID,
          event: {
            ...eventIDToEvent[eventID],
            UserJoin: false,
            NumJoins: eventIDToEvent[eventID].NumJoins + 1,
          },
        });
      });
  };

  const clientRemoveUserShoutout = (eventID: string) => {
    updateEventIDToEvent({
      id: eventID,
      event: {
        ...eventIDToEvent[eventID],
        UserShoutout: false,
        NumShoutouts: eventIDToEvent[eventID].NumShoutouts - 1,
      },
    });
    removeUserShoutoutEvent(
      userToken.UserAccessToken,
      userToken.UserID,
      eventID
    ).catch((error: CustomError) => {
      if (error.showBugReportDialog) {
        showBugReportPopup(error);
      }
      updateEventIDToEvent({
        id: eventID,
        event: {
          ...eventIDToEvent[eventID],
          UserShoutout: false,
          NumShoutouts: eventIDToEvent[eventID].NumShoutouts + 1,
        },
      });
    });
  };

  function setInterestsMap(
    map: { [key: string]: Interest[] },
    action: { id: string; interests: Interest[] }
  ) {
    return {
      ...map,
      [action.id]: action.interests
    };
  }

  return (
    <EventContext.Provider
      value={{
        eventIDToEvent,
        updateEventIDToEvent,
        eventIDToInterests,
        updateEventIDToInterests,
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
