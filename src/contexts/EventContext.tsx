import React, { createContext, useReducer } from "react";
import { Event } from "../constants";
import { min } from "moment";

type EventContextType = {
  eventIDToEvent: { [key: string]: Event };
  updateEventIDToEvent: React.Dispatch<{
    id: string;
    event: Event;
  }>;
  eventIDToDidJoin: { [key: string]: boolean };
  updateEventIDToDidJoin: React.Dispatch<{
    id: string;
    didJoin: boolean;
  }>;
  eventIDToJoins:{ [key: string]: number };
  updateEventIDToJoins: React.Dispatch<{
    id: string;
    joins: number;
  }>;
  eventIDToDidShoutout: { [key: string]: boolean };
  updateEventIDToDidShoutout: React.Dispatch<{
    id: string;
    didShoutout: boolean;
  }>;
  eventIDToShoutouts: { [key: string]: number };
  updateEventIDToShoutouts: React.Dispatch<{
    id: string;
    shoutouts: number;
  }>;
};

export const EventContext = createContext<EventContextType>({
    eventIDToEvent: null,
    updateEventIDToEvent: null,
    eventIDToDidJoin: null,
    updateEventIDToDidJoin: null,
    eventIDToJoins: null,
    updateEventIDToJoins: null,
    eventIDToDidShoutout: null,
    updateEventIDToDidShoutout: null,
    eventIDToShoutouts: null,
    updateEventIDToShoutouts: null
});
export const EventProvider = ({ children }) => {
  const [eventIDToEvent, updateEventIDToEvent] = useReducer(setEventMap, {});
  const [eventIDToJoins, updateEventIDToJoins] = useReducer(setJoinsMap, {});
  const [eventIDToDidJoin, updateEventIDToDidJoin] = useReducer(setDidJoinMap, {});
  const [eventIDToShoutouts, updateEventIDToShoutouts] = useReducer(setShoutoutsMap, {})
  const [eventIDToDidShoutout, updateEventIDToDidShoutout] = useReducer(
    setDidShoutoutMap,
    {}
  );

  function setEventMap(
    map: { [key: string]: Event },
    action: {id: string, 
      event: Event }
  ) {
    map[action.id] = action.event;
    return map;
  }

  function setDidJoinMap(
    map: { [key: string]: boolean },
    action: { id: string; didJoin: boolean }
  ) {
    map[action.id] = action.didJoin;
    return map;
  }

  function setJoinsMap(
    map: { [key: string]: number },
    action: { id: string; joins: number }
  ) {
    map[action.id] = action.joins;
    return map;
  }

  function setDidShoutoutMap(
    map: { [key: string]: boolean },
    action: { id: string; didShoutout: boolean }
  ) {
    map[action.id] = action.didShoutout;
    return map;
  }

  function setShoutoutsMap(
    map: { [key: string]: number },
    action: { id: string; shoutouts: number }
  ) {
    map[action.id] = action.shoutouts;
    return map;
  }

  return <EventContext.Provider value={{
    eventIDToEvent,
    updateEventIDToEvent,
    eventIDToDidJoin,
    updateEventIDToDidJoin,
    eventIDToJoins,
    updateEventIDToJoins,
    eventIDToDidShoutout,
    updateEventIDToDidShoutout,
    eventIDToShoutouts,
    updateEventIDToShoutouts,
  }}>{children}</EventContext.Provider>;
};
