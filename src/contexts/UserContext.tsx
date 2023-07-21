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
  getStoredToken,
  updateFirstInstall,
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
import { displayError, showBugReportPopup } from "../helpers/helpers";
import { appVersion } from "../constants/texts";
import {
  getPushNotificationToken,
  registerPushNotificationToken,
} from "../services/NotificationService";
import { CustomError } from "../constants/error";

type UserContextType = {
  userToken: Token;
  currentSchool: School;
  setCurrentSchool: React.Dispatch<React.SetStateAction<School>>;
  isUserContextLoaded: boolean;
  isLoggedIn: boolean;
  setContextVarsBasedOnToken: (token: Token) => Promise<void>;
  syncUserContextWithToken: (token: Token) => Promise<void>;
  isAdmin: boolean;
  pullTokenFromServer: () => void;
  serverError: boolean;
  userIDToUser: { [key: string]: User };
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
  userIDToUser: null,
  updateUserIDToUser: null,
  clientFollowUser: null,
  clientUnfollowUser: null,
});

export const UserProvider = ({ children }) => {
  const [userToken, setUserToken] = useState<Token>(null);
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
    return {
      ...map,
      [action.id]: action.user
    };
  }

  const clientUnfollowUser = async (userID: string): Promise<void> => {
    console.log("Follow user hit");
    updateUserIDToUser({
      id: userToken.UserID,
      user: {
        ...userIDToUser[userToken.UserID],
        NumFollowing: userIDToUser[userToken.UserID].NumFollowing - 1,
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

    unfollowUser(userToken.UserAccessToken, userToken.UserID, userID).catch(
      (error: CustomError) => {
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        }
        updateUserIDToUser({
          id: userToken.UserID,
          user: {
            ...userIDToUser[userToken.UserID],
            NumFollowing: userIDToUser[userToken.UserID].NumFollowing + 1,
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
      }
    );
  };

  const clientFollowUser = async (userID: string): Promise<void> => {
    console.log("Unfollow user hit");

    updateUserIDToUser({
      id: userToken.UserID,
      user: {
        ...userIDToUser[userToken.UserID],
        NumFollowing: userIDToUser[userToken.UserID].NumFollowing + 1,
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

    followUser(userToken.UserAccessToken, userToken.UserID, userID).catch(
      (error: CustomError) => {
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        }
        updateUserIDToUser({
          id: userToken.UserID,
          user: {
            ...userIDToUser[userToken.UserID],
            NumFollowing: userIDToUser[userToken.UserID].NumFollowing - 1,
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
      }
    );
  };

  const fillUserData = async () => {
    await setContextVarsBasedOnToken(
      await getStoredToken().catch((error: Error) => {
        setServerError(true);
        displayError(error);
        return null;
      })
    ).catch((error: CustomError) => {
      logout();
      setServerError(true);
      if (error.showBugReportDialog) {
        showBugReportPopup(error);
      } else {
        displayError(error);
      }
    });
    updateFirstInstall(false);
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
    // when userToken  or currentSchool
    // becomes null, it throws an error in the main app.
    // So, syncUserContextWithToken() should be called outside
    if (
      userToken &&
      userToken.UserAccessToken &&
      userToken.UserID &&
      currentSchool
    ) {
      getPushNotificationToken().then((token: string) => {
        if (!token) {
          return;
        }
        registerPushNotificationToken(
          userToken.UserAccessToken,
          userToken.UserID,
          token
        )
          .then(() =>
            console.log("Registered push notification token " + token)
          )
          .catch((error: CustomError) => {
            if (error.showBugReportDialog) {
              showBugReportPopup(error);
            } else {
              displayError(error);
            }
          });
      });
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userToken, currentSchool]);

  // This should be done every now and then to see if the token
  // Is valid. SHOULD ONLY BE RUN WHEN isLoggedIn IS TRUE
  const syncUserContextWithToken = async (): Promise<void> => {
    if (!isLoggedIn) {
      await setContextVarsBasedOnToken(null);
      return;
    }

    // Token has expired.
    const returnedToken: Token = await getStoredToken().catch(
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
      token.UserAccessToken,
      token.UserID
    ).catch((error: CustomError) => {
      throw error;
    });

    const pulledSchool: School = await getSchoolByUserId(
      pulledUser.UserID
    ).catch((error: CustomError) => {
      throw error;
    });
    setUserToken(token);
    updateUserIDToUser({ id: pulledUser.UserID, user: pulledUser });
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
