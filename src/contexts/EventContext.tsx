import React, { createContext, useContext, useReducer } from "react";
import { Event, Interest } from "../constants";
import { min } from "moment";
import { displayError } from "../helpers/helpers";
import { addUserJoinEvent, addUserShoutoutEvent, removeUserJoinEvent, removeUserShoutoutEvent } from "../services/UserService";
import { UserContext } from "./UserContext";

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
  addUserJoin: (eventID: string) => void;
  addUserShoutout: (eventID: string) => void;
  removeUserJoin: (eventID: string) => void;
  removeUserShoutout: (eventID: string) => void;

};

export const EventContext = createContext<EventContextType>({
  eventIDToEvent: null,
  updateEventIDToEvent: null,
  eventIDToInterests: null,
  updateEventIDToInterests: null,
  addUserJoin: null,
  addUserShoutout: null,
  removeUserJoin: null,
  removeUserShoutout: null,
});
export const EventProvider = ({ children }) => {
  const [eventIDToEvent, updateEventIDToEvent] = useReducer(setEventMap, {});
  const [eventIDToInterests, updateEventIDToInterests] = useReducer(
    setInterestsMap,
    {}
  );
  const {userToken, currentUserID} = useContext(UserContext)

  function setEventMap(
    map: { [key: string]: Event },
    action: { id: string; event: Event }
  ) {
    map[action.id] = action.event;
    map = { ...map };
    return map;
  }

  const addUserJoin = (eventID: string) => {
    updateEventIDToEvent({
      id: eventID,
      event: {
        ...eventIDToEvent[eventID],
        UserJoin: true,
        NumJoins: eventIDToEvent[eventID].NumJoins + 1,
      },
    });
    addUserJoinEvent(
      userToken.UserAccessToken,
      currentUserID,
      eventID
    ).catch((error: Error) => {
      updateEventIDToEvent({
        id: eventID,
        event: {
          ...eventIDToEvent[eventID],
          UserJoin: false,
          NumJoins: eventIDToEvent[eventID].NumJoins - 1,
        },
      });
      displayError(error);
    });
  };

  const addUserShoutout = (eventID: string) => {
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
      currentUserID,
      eventID
    ).catch((error: Error) => {
      updateEventIDToEvent({
        id: eventID,
        event: {
          ...eventIDToEvent[eventID],
          UserShoutout: false,
          NumShoutouts: eventIDToEvent[eventID].NumShoutouts - 1,
        },
      });
      displayError(error);
    });
  };

  const removeUserJoin = (eventID: string) => {
    updateEventIDToEvent({
      id: eventID,
      event: {
        ...eventIDToEvent[eventID],
        UserJoin: false,
        NumJoins: eventIDToEvent[eventID].NumJoins - 1,
      },
    });
    removeUserJoinEvent(
      userToken.UserAccessToken,
      currentUserID,
      eventID
    ).catch((error: Error) => {
      updateEventIDToEvent({
        id: eventID,
        event: {
          ...eventIDToEvent[eventID],
          UserJoin: false,
          NumJoins: eventIDToEvent[eventID].NumJoins + 1,
        },
      });
      displayError(error);
    });
  };

  const removeUserShoutout = (eventID: string) => {
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
      currentUserID,
      eventID
    ).catch((error: Error) => {
      updateEventIDToEvent({
        id: eventID,
        event: {
          ...eventIDToEvent[eventID],
          UserShoutout: false,
          NumShoutouts: eventIDToEvent[eventID].NumShoutouts + 1,
        },
      });
      displayError(error);
    });
  };

  function setInterestsMap(
    map: { [key: string]: Interest[] },
    action: { id: string; interests: Interest[] }
  ) {
    map[action.id] = action.interests;
    map = { ...map };
    return map;
  }

  return (
    <EventContext.Provider
      value={{
        eventIDToEvent,
        updateEventIDToEvent,
        eventIDToInterests,
        updateEventIDToInterests,
        addUserJoin,
        addUserShoutout,
        removeUserJoin,
        removeUserShoutout,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
