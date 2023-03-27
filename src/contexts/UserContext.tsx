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

import React, { useState, useEffect, createContext } from "react";
import { User, School, Token } from "../constants";
import {
  checkIfUserAccessTokenIsAdmin,
  getServerStatus,
  logout,
  validateTokenExpirationAndUpdate,
} from "../services/AuthService";
import { getSchoolByUserId } from "../services/SchoolService";
import { getUserByUserAccessToken } from "../services/UserService";
import { displayError, formatError } from "../helpers/helpers";
import Constants from "expo-constants";
import { appVersion, appVersionText } from "../constants/texts";

type UserContextType = {
  userToken: Token;
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  currentSchool: School;
  setCurrentSchool: React.Dispatch<React.SetStateAction<School>>;
  isUserContextLoaded: boolean;
  isLoggedIn: boolean;
  setContextVarsBasedOnToken: (token: Token) => Promise<void>;
  syncUserContextWithToken: (token: Token) => Promise<void>;
  isAdmin: boolean;
  pullTokenFromServer: () => void;
  serverError: boolean;
};
export const UserContext = createContext<UserContextType>({
  userToken: null,
  currentUser: null,
  setCurrentUser: null,
  currentSchool: null,
  setCurrentSchool: null,
  isUserContextLoaded: null,
  isLoggedIn: null,
  setContextVarsBasedOnToken: null,
  syncUserContextWithToken: null,
  isAdmin: null,
  pullTokenFromServer: null,
  serverError: false,
});

export const UserProvider = ({ children }) => {
  const [userToken, setUserToken] = useState<Token>(null);
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [currentSchool, setCurrentSchool] = useState<School>(null);
  const [isUserContextLoaded, setIsUserContextLoaded] =
    useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [serverError, setServerError] = useState<boolean>(false);

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
    // when userToken, currentUser, or currentSchool
    // becomes null, it throws an error in the main app.
    // So, syncUserContextWithToken() should be called outside
    setIsLoggedIn(
      userToken !== null && currentUser !== null && currentSchool !== null
    );
    if (userToken && currentUser && currentSchool) {
      setIsLoggedIn(true);
      // DO PUSH NOTIFICATION CHECK HERE
    } else {
      setIsLoggedIn(false);
    }
  }, [userToken, currentUser, currentSchool]);

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
      setCurrentUser(null);
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
      setCurrentUser(null);
      setCurrentSchool(null);
      logout();
      throw error;
    });
    setUserToken(token);
    setCurrentUser(pulledUser);
    setCurrentSchool(pulledSchool);
    setIsLoggedIn(true);
    console.log("Finished setting context variables");
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
