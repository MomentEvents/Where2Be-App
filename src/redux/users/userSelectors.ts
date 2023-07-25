import { RootState } from '../store';

export const selectUserByID = (state: RootState, userId: string) => state.user.userIDToUser[userId];