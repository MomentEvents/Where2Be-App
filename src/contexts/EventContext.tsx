import React, { createContext, useReducer } from "react";
import { Event, Interest } from "../constants";
import { min } from "moment";

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
};

export const EventContext = createContext<EventContextType>({
  eventIDToEvent: null,
  updateEventIDToEvent: null,

  eventIDToInterests: null,
  updateEventIDToInterests: null,
});
export const EventProvider = ({ children }) => {
  const [eventIDToEvent, updateEventIDToEvent] = useReducer(setEventMap, {});
  const [eventIDToInterests, updateEventIDToInterests] = useReducer(
    setInterestsMap,
    {}
  );

  function setEventMap(
    map: { [key: string]: Event },
    action: { id: string; event: Event }
  ) {
    map[action.id] = action.event;
    map = { ...map };
    return map;
  }

  function setDidJoinMap(
    map: { [key: string]: boolean },
    action: { id: string; didJoin: boolean }
  ) {
    map[action.id] = action.didJoin;
    map = { ...map };
    return map;
  }

  function setJoinsMap(
    map: { [key: string]: number },
    action: { id: string; joins: number }
  ) {
    map[action.id] = action.joins;
    map = { ...map };
    return map;
  }

  function setDidShoutoutMap(
    map: { [key: string]: boolean },
    action: { id: string; didShoutout: boolean }
  ) {
    map[action.id] = action.didShoutout;
    map = { ...map };
    return map;
  }

  function setShoutoutsMap(
    map: { [key: string]: number },
    action: { id: string; shoutouts: number }
  ) {
    map[action.id] = action.shoutouts;
    map = { ...map };
    return map;
  }

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
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
