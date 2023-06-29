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
  clientAddUserJoin: (eventID: string) => void;
  clientAddUserShoutout: (eventID: string) => void;
  clientRemoveUserJoin: (eventID: string) => void;
  clientRemoveUserShoutout: (eventID: string) => void;

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
});
export const EventProvider = ({ children }) => {
  const [eventIDToEvent, updateEventIDToEvent] = useReducer(setEventMap, {});
  const [eventIDToInterests, updateEventIDToInterests] = useReducer(
    setInterestsMap,
    {}
  );
  const {userToken} = useContext(UserContext)

  function setEventMap(
    map: { [key: string]: Event },
    action: { id: string; event: Event }
  ) {
    map[action.id] = {...map[action.id], ...action.event};
    map = { ...map };
    return map;
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
    addUserJoinEvent(
      userToken.UserAccessToken,
      userToken.UserID,
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
    ).catch((error: Error) => {
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
    removeUserJoinEvent(
      userToken.UserAccessToken,
      userToken.UserID,
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
    ).catch((error: Error) => {
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
        clientAddUserJoin,
        clientAddUserShoutout,
        clientRemoveUserJoin,
        clientRemoveUserShoutout,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
