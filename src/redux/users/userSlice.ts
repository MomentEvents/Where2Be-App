import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../constants";

interface UserState {
  userIDToUser: { [key: string]: User };
}

const initialState: UserState = {
  userIDToUser: {},
};

type NumericFields = "NumFollowers" | "NumFollowing" | "NumEvents";

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserMap: (state, action: PayloadAction<{ id: string; user: User }>) => {
      state.userIDToUser[action.payload.id] = action.payload.user;
    },
    updateUserMap: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<User> }>
    ) => {
      const userToUpdate = state.userIDToUser[action.payload.id];
      state.userIDToUser[action.payload.id] = {
        ...userToUpdate,
        ...action.payload.changes,
      };
    },
    updateUserNumericField: (
      state,
      action: PayloadAction<{ id: string; field: NumericFields; delta: number }>
    ) => {
      const userToUpdate = state.userIDToUser[action.payload.id];
      if (userToUpdate && action.payload.field in userToUpdate) {
        userToUpdate[action.payload.field] =
          (userToUpdate[action.payload.field] || 0) + action.payload.delta;
      }
    },
    updateUserFollowUser: (
      state,
      action: PayloadAction<{ fromID: string; toID: string; doFollow: boolean }>
    ) => {
      const fromUser = state.userIDToUser[action.payload.fromID];
      const toUser = state.userIDToUser[action.payload.toID];

      if(!fromUser || !toUser){
        return
      }
      if (action.payload.doFollow) {
        fromUser.NumFollowing = fromUser.NumFollowing + 1;
        toUser.UserFollow = true;
        toUser.NumFollowers = toUser.NumFollowers + 1;
      } else {
        fromUser.NumFollowing = fromUser.NumFollowing - 1;
        toUser.UserFollow = false;
        toUser.NumFollowers = toUser.NumFollowers - 1;
      }
    },
  },
});

export const {
  setUserMap,
  updateUserMap,
  updateUserFollowUser,
  updateUserNumericField,
} = userSlice.actions;

export default userSlice.reducer;
