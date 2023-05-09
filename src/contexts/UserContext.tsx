/**************************************
 * UserContext.tsx
 *
 * This file contains the variables used for the current user,
 * their user access token, and their School for ease of access.
 * It also checks if the user is logged in.
 *
 * To log in, sign up, or log out a user, use the functions in the
 * AuthContext.
 */

import React, { useState, useEffect, createContext, useReducer } from "react";
import { User, School, Token } from "../constants";
import {
  checkIfUserAccessTokenIsAdmin,
  getServerStatus,
  logout,
  validateTokenExpirationAndUpdate,
} from "../services/AuthService";
import { getSchoolByUserId } from "../services/SchoolService";
import {
  addUserJoinEvent,
  addUserShoutoutEvent,
  followUser,
  getUserByUserAccessToken,
  removeUserJoinEvent,
  removeUserShoutoutEvent,
  unfollowUser,
} from "../services/UserService";
import { displayError } from "../helpers/helpers";
import { appVersion } from "../constants/texts";
import {
  getPushNotificationToken,
  registerPushNotificationToken,
} from "../services/NotificationService";

type UserContextType = {
  userToken: Token;
  currentUserID: string;
  setCurrentUserID: React.Dispatch<React.SetStateAction<string>>;
  currentSchool: School;
  setCurrentSchool: React.Dispatch<React.SetStateAction<School>>;
  isUserContextLoaded: boolean;
  isLoggedIn: boolean;
  setContextVarsBasedOnToken: (token: Token) => Promise<void>;
  syncUserContextWithToken: (token: Token) => Promise<void>;
  isAdmin: boolean;
  pullTokenFromServer: () => void;
  serverError: boolean;
  userIDToUser: {[key: string]: User};
  updateUserIDToUser: React.Dispatch<{
    id: string;
    user: User;
  }>;
  clientFollowUser: (userID: string) => Promise<void>;
  clientUnfollowUser: (userID: string) => Promise<void>;
  
};
export const UserContext = createContext<UserContextType>({
  userToken: null,
  currentSchool: null,
  setCurrentSchool: null,
  isUserContextLoaded: null,
  isLoggedIn: null,
  setContextVarsBasedOnToken: null,
  syncUserContextWithToken: null,
  isAdmin: null,
  pullTokenFromServer: null,
  serverError: false,
  currentUserID: null,
  setCurrentUserID: null,
  userIDToUser: null,
  updateUserIDToUser: null,
  clientFollowUser: null,
  clientUnfollowUser: null,
});

export const UserProvider = ({ children }) => {
  const [userToken, setUserToken] = useState<Token>(null);
  const [currentUserID, setCurrentUserID] = useState<string>(null);
  const [currentSchool, setCurrentSchool] = useState<School>(null);
  const [isUserContextLoaded, setIsUserContextLoaded] =
    useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [serverError, setServerError] = useState<boolean>(false);

  const [userIDToUser, updateUserIDToUser] = useReducer(setUserMap, {});

  function setUserMap(
    map: { [key: string]: User },
    action: { id: string; user: User }
  ) {
    map[action.id] = action.user;
    map = { ...map };
    return map;
  }

  const clientFollowUser = async (userID: string): Promise<void> => {
    updateUserIDToUser({
      id: userID,
      user: {
        ...userIDToUser[currentUserID],
        NumFollowing: userIDToUser[userID].NumFollowing - 1,
      },
    });
    updateUserIDToUser({
      id: userID,
      user: {
        ...userIDToUser[userID],
        UserFollow: false,
        NumFollowers: userIDToUser[userID].NumFollowers - 1,
      },
    });

    unfollowUser(userToken.UserAccessToken, currentUserID, userID).catch((error: Error) => {
      displayError(error);
      updateUserIDToUser({
        id: userID,
        user: {
          ...userIDToUser[currentUserID],
          NumFollowing: userIDToUser[userID].NumFollowing + 1,
        },
      });
      updateUserIDToUser({
        id: userID,
        user: {
          ...userIDToUser[userID],
          UserFollow: true,
          NumFollowers: userIDToUser[userID].NumFollowers + 1,
        },
      });
    })
  };

  const clientUnfollowUser = async (userID: string): Promise<void> => {
    updateUserIDToUser({
      id: userID,
      user: {
        ...userIDToUser[currentUserID],
        NumFollowing: userIDToUser[userID].NumFollowing + 1,
      },
    });
    updateUserIDToUser({
      id: userID,
      user: {
        ...userIDToUser[userID],
        UserFollow: true,
        NumFollowers: userIDToUser[userID].NumFollowers + 1,
      },
    });

    followUser(userToken.UserAccessToken, currentUserID, userID).catch((error: Error) => {
      displayError(error);
      updateUserIDToUser({
        id: userID,
        user: {
          ...userIDToUser[currentUserID],
          NumFollowing: userIDToUser[userID].NumFollowing - 1,
        },
      });
      updateUserIDToUser({
        id: userID,
        user: {
          ...userIDToUser[userID],
          UserFollow: false,
          NumFollowers: userIDToUser[userID].NumFollowers - 1,
        },
      });
    })
  };

  const fillUserData = async () => {
    await setContextVarsBasedOnToken(
      await validateTokenExpirationAndUpdate().catch((error: Error) => {
        setServerError(true);
        displayError(error);
        return null;
      })
    ).catch((error: Error) => {
      setServerError(true);
      displayError(error);
    });
    setIsUserContextLoaded(true);
  };

  const pullTokenFromServer = () => {
    setServerError(false);
    getServerStatus(appVersion)
      .then(() => {
        fillUserData();
      })
      .catch((error: Error) => {
        setServerError(true);
        displayError(error);
      });
  };

  useEffect(() => {
    pullTokenFromServer();
  }, []);

  useEffect(() => {
    // This runs for user login.
    // This doesn't work when user log out, because
    // when userToken, currentUserID, or currentSchool
    // becomes null, it throws an error in the main app.
    // So, syncUserContextWithToken() should be called outside
    if (userToken && currentUserID && currentSchool) {
      getPushNotificationToken().then((token: string) => {
        registerPushNotificationToken(
          userToken.UserAccessToken,
          currentUserID,
          token
        )
          .then(() =>
            console.log("Registered push notification token " + token)
          )
          .catch((error: Error) => {
            displayError(error);
          });
      });
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userToken, currentUserID, currentSchool]);

  // This should be done every now and then to see if the token
  // Is valid. SHOULD ONLY BE RUN WHEN isLoggedIn IS TRUE
  const syncUserContextWithToken = async (): Promise<void> => {
    if (!isLoggedIn) {
      await setContextVarsBasedOnToken(null);
      return;
    }

    const currentTime = Date.now();
    if (
      userToken === null ||
      (userToken !== null && userToken.Expiration.getTime() >= currentTime)
    ) {
      // No token to be found or token has not expired yet
      return;
    }

    // Token has expired.
    const returnedToken: Token = await validateTokenExpirationAndUpdate().catch(
      (error: Error) => {
        displayError(error);
        return null;
      }
    );

    setContextVarsBasedOnToken(returnedToken);
  };

  const setContextVarsBasedOnToken = async (token: Token): Promise<void> => {
    if (token === null) {
      setIsLoggedIn(false);
      setUserToken(null);
      setCurrentUserID(null);
      setCurrentSchool(null);
      logout();
      return;
    }

    checkIfUserAccessTokenIsAdmin(token.UserAccessToken)
      .then((pulledIsAdmin: boolean) => {
        setIsAdmin(pulledIsAdmin);
      })
      .catch((error: Error) => {
        displayError(error);
      });

    const pulledUser: User = await getUserByUserAccessToken(
      token.UserAccessToken
    ).catch((error: Error) => {
      throw error;
    });

    const pulledSchool: School = await getSchoolByUserId(
      pulledUser.UserID
    ).catch((error: Error) => {
      setIsLoggedIn(false);
      setUserToken(null);
      setCurrentUserID(null);
      setCurrentSchool(null);
      logout();
      throw error;
    });
    setUserToken(token);
    updateUserIDToUser({ id: pulledUser.UserID, user: pulledUser });
    setCurrentUserID(pulledUser.UserID);
    setCurrentSchool(pulledSchool);
    setIsLoggedIn(true);
    console.log("Finished setting context variables");
  };

  return (
    <UserContext.Provider
      value={{
        userToken,
        currentSchool,
        setCurrentSchool,
        isUserContextLoaded,
        isLoggedIn,
        setContextVarsBasedOnToken,
        syncUserContextWithToken,
        isAdmin,
        pullTokenFromServer,
        serverError,
        currentUserID,
        setCurrentUserID,
        userIDToUser,
        updateUserIDToUser,
        clientFollowUser,
        clientUnfollowUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
