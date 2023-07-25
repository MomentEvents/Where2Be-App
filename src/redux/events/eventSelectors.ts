import { RootState } from '../store';

export const selectEventByID = (state: RootState, eventId: string) => state.event.eventIDToEvent[eventId];
export const selectEventInterestsByID = (state: RootState, eventId: string) => state.event.eventIDToInterests[eventId];