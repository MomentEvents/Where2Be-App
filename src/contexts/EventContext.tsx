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
  selfHostedPastEventIDs: string[];
  selfHostedFutureEventIDs: string[];
  selfJoinedPastEventIDs: string[];
  selfJoinedFutureEventIDs: string[];
  handleUpdateEventList(
    eventIDs: string[],
    doAdd: boolean,
    isFuture: boolean,
    operation: "PushToEnd" | "Clear",
    eventType: "Joined" | "Hosted"
  ): void;
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
  selfHostedPastEventIDs: null,
  selfHostedFutureEventIDs: null,
  selfJoinedPastEventIDs: null,
  selfJoinedFutureEventIDs: null,
  handleUpdateEventList: null,
});
export const EventProvider = ({ children }) => {
  const [eventIDToEvent, updateEventIDToEvent] = useReducer(setEventMap, {});
  const [eventIDToInterests, updateEventIDToInterests] = useReducer(
    setInterestsMap,
    {}
  );
  const { userToken } = useContext(UserContext);

  const [selfHostedPastEventIDs, setSelfHostedPastEventIDs] =
    useState<string[]>();
  const [selfHostedFutureEventIDs, setSelfHostedFutureEventIDs] =
    useState<string[]>();
  const [selfJoinedPastEventIDs, setSelfJoinedPastEventIDs] =
    useState<string[]>();
  const [selfJoinedFutureEventIDs, setSelfJoinedFutureEventIDs] =
    useState<string[]>();

  function handleUpdateEventList(
    eventIDs: string[],
    doAdd: boolean,
    isFuture: boolean,
    operation: "PushToEnd" | "Clear",
    eventType: "Joined" | "Hosted"
  ) {
    // This whole function could probably be written better but this works for now

    // If you wanna rewrite this you're the goat

    if (operation === "Clear") {
      if (eventType === "Joined" && isFuture) {
        setSelfJoinedFutureEventIDs(undefined);
      } else if (eventType === "Joined" && !isFuture) {
        setSelfJoinedPastEventIDs(undefined);
      } else if (eventType === "Hosted" && isFuture) {
        setSelfHostedFutureEventIDs(undefined);
      } else if (eventType === "Hosted" && !isFuture) {
        setSelfHostedPastEventIDs(undefined);
      }
      return;
    }

    if (operation === "PushToEnd") {
      if (eventType === "Joined") {
        if (isFuture) {
          if (selfJoinedFutureEventIDs) {
            setSelfJoinedFutureEventIDs((previousList) => {
              return previousList.concat(eventIDs);
            });
          } else {
            setSelfJoinedFutureEventIDs(eventIDs);
          }
        } else {
          // is past
          if (selfJoinedPastEventIDs) {
            setSelfJoinedPastEventIDs((previousList) => {
              return previousList.concat(eventIDs);
            });
          } else {
            setSelfJoinedPastEventIDs(eventIDs);
          }
        }
      } else if (eventType === "Hosted") {
        if (isFuture) {
          if (selfHostedFutureEventIDs) {
            setSelfHostedFutureEventIDs((previousList) => {
              return previousList.concat(eventIDs);
            });
          } else {
            setSelfHostedFutureEventIDs(eventIDs);
          }
        } else {
          // is past
          if (selfHostedPastEventIDs) {
            setSelfHostedPastEventIDs((previousList) => {
              return previousList.concat(eventIDs);
            });
          } else {
            setSelfHostedPastEventIDs(eventIDs);
          }
        }
      }
      return;
    }

    if (eventIDs.length !== 1) {
      console.warn(
        "handleUpdateJoinedEventList improper use",
        "eventIDs length when pushToEnd is false must be 1"
      );
      return;
    }

    const eventID = eventIDs[0];

    if (!doAdd) {
      if (eventType === "Joined") {
        if (isFuture && selfJoinedFutureEventIDs) {
          const filteredArray = selfJoinedFutureEventIDs.filter(
            (item) => item !== eventID
          );
          setSelfJoinedFutureEventIDs(filteredArray);
        } else if (!isFuture && selfJoinedPastEventIDs) {
          // is past
          const filteredArray = selfJoinedPastEventIDs.filter(
            (item) => item !== eventID
          );
          setSelfJoinedPastEventIDs(filteredArray);
        }
      } else if (eventType === "Hosted") {
        if (isFuture && selfHostedFutureEventIDs) {
          const filteredArray = selfHostedFutureEventIDs.filter(
            (item) => item !== eventID
          );
          setSelfHostedFutureEventIDs(filteredArray);
        } else if (!isFuture && selfHostedPastEventIDs) {
          // is past
          const filteredArray = selfHostedPastEventIDs.filter(
            (item) => item !== eventID
          );
          setSelfHostedPastEventIDs(filteredArray);
        }
      }
      return;
    }

    if (!eventIDToEvent[eventID]) {
      // Unknown error. Just put event into beginning of list
      if (eventType === "Joined" && isFuture && selfJoinedFutureEventIDs) {
        selfJoinedFutureEventIDs.unshift(eventID);
      } else if (
        eventType === "Joined" &&
        !isFuture &&
        selfJoinedPastEventIDs
      ) {
        selfJoinedPastEventIDs.unshift(eventID);
      } else if (
        eventType === "Hosted" &&
        isFuture &&
        selfHostedFutureEventIDs
      ) {
        selfHostedFutureEventIDs.unshift(eventID);
      } else if (
        eventType === "Hosted" &&
        !isFuture &&
        selfHostedPastEventIDs
      ) {
        selfHostedPastEventIDs.unshift(eventID);
      }
      return;
    }

    let eventIDList = null;

    if (eventType === "Joined" && isFuture) {
      eventIDList = selfJoinedFutureEventIDs;
    } else if (eventType === "Joined" && !isFuture) {
      eventIDList = selfJoinedPastEventIDs;
    } else if (eventType === "Hosted" && isFuture) {
      eventIDList = selfHostedFutureEventIDs;
    } else if (eventType === "Hosted" && !isFuture) {
      eventIDList = selfHostedPastEventIDs;
    }

    if (!eventIDList) {
      return;
    }

    try {
      let didInsert = false;
      for (var i = 0; i < eventIDList.length - 1; i++) {
        if (
          isFuture &&
          eventIDToEvent[eventIDList[i]].StartDateTime <=
            eventIDToEvent[eventID].StartDateTime &&
          eventIDToEvent[eventIDList[i + 1]].StartDateTime >
            eventIDToEvent[eventID].StartDateTime
        ) {
          eventIDList.splice(i + 1, 0, eventID);
          didInsert = true;
          break;
        } else if (
          !isFuture &&
          eventIDToEvent[eventIDList[i]].StartDateTime >
            eventIDToEvent[eventID].StartDateTime &&
          eventIDToEvent[eventIDList[i + 1]].StartDateTime <=
            eventIDToEvent[eventID].StartDateTime
        ) {
          eventIDList.splice(i + 1, 0, eventID);
          didInsert = true;
          break;
        }
      }
      if (!didInsert) {
        eventIDList.push(eventID);
        didInsert = true;
      }
      if (eventType === "Joined" && isFuture) {
        setSelfJoinedFutureEventIDs(eventIDList);
      } else if (eventType === "Joined" && !isFuture) {
        setSelfJoinedPastEventIDs(eventIDList);
      } else if (eventType === "Hosted" && isFuture) {
        setSelfHostedFutureEventIDs(eventIDList);
      } else if (eventType === "Hosted" && !isFuture) {
        setSelfHostedPastEventIDs(eventIDList);
      }
    } catch (e) {
      console.warn("UNABLE TO ADD EVENTID TO SELF LIST\n\n" + e);
    }
  }

  function setEventMap(
    map: { [key: string]: Event },
    action: { id: string; event: Event }
  ) {
    map[action.id] = { ...map[action.id], ...action.event };
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
    ).catch((error: CustomError) => {
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
    removeUserJoinEvent(
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
        selfHostedPastEventIDs,
        selfHostedFutureEventIDs,
        selfJoinedPastEventIDs,
        selfJoinedFutureEventIDs,
        handleUpdateEventList
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
