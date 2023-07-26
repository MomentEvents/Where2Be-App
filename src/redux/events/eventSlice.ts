import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event, Interest } from "../../constants";

interface EventState {
  eventIDToEvent: { [key: string]: Event };
  eventIDToInterests: { [key: string]: Interest[] };
}

const initialState: EventState = {
  eventIDToEvent: {},
  eventIDToInterests: {},
};

type EventNumericFields = "NumJoins" | "NumShoutouts";

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEventMap: (
      state,
      action: PayloadAction<{ id: string; event: Event }>
    ) => {
      state.eventIDToEvent[action.payload.id] = action.payload.event;
    },
    updateEventMap: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Event> }>
    ) => {
      const eventToUpdate = state.eventIDToEvent[action.payload.id];
      state.eventIDToEvent[action.payload.id] = {
        ...eventToUpdate,
        ...action.payload.changes,
      };
    },
    updateEventNumericField: (
      state,
      action: PayloadAction<{
        id: string;
        field: EventNumericFields;
        delta: number;
      }>
    ) => {
      const eventToUpdate = state.eventIDToEvent[action.payload.id];
      if (eventToUpdate && action.payload.field in eventToUpdate) {
        eventToUpdate[action.payload.field] =
          (eventToUpdate[action.payload.field] || 0) + action.payload.delta;
      }
    },
    updateUserJoinEvent: (
      state,
      action: PayloadAction<{ eventID: string; doJoin: boolean }>
    ) => {
      const event = state.eventIDToEvent[action.payload.eventID];

      if (action.payload.doJoin) {
        event.UserJoin = true;
        event.NumJoins = event.NumJoins + 1;
      } else {
        event.UserJoin = false;
        event.NumJoins = event.NumJoins - 1;
      }
    },
    updateUserShoutoutEvent: (
      state,
      action: PayloadAction<{
        eventID: string;
        doShoutout: boolean;
      }>
    ) => {
      const event = state.eventIDToEvent[action.payload.eventID];

      if (action.payload.doShoutout) {
        event.UserShoutout = true;
        event.NumShoutouts = event.NumShoutouts + 1;
      } else {
        event.UserShoutout = false;
        event.NumShoutouts = event.NumShoutouts - 1;
      }
    },
    setEventInterestsMap: (
      state,
      action: PayloadAction<{ id: string; interests: Interest[] }>
    ) => {
      state.eventIDToInterests[action.payload.id] = action.payload.interests;
    },
    updateEventInterestsMap: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Interest[]> }>
    ) => {
      const interestsToUpdate = state.eventIDToInterests[action.payload.id];
      state.eventIDToInterests[action.payload.id] = {
        ...interestsToUpdate,
        ...action.payload.changes,
      };
    },
  },
});

export const {
  setEventMap,
  updateEventMap,
  updateEventNumericField,
  updateUserJoinEvent,
  updateUserShoutoutEvent,
  setEventInterestsMap,
  updateEventInterestsMap,
} = eventSlice.actions;

export default eventSlice.reducer;