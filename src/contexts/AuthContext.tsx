import { createContext, useContext, useRef, useState } from "react";
import { UserContext } from "./UserContext";
import { displayError } from "../helpers/helpers";
import { login, signup, logout } from "../services/AuthService";
import { getPushNotificationToken, unregisterPushNotificationToken } from "../services/NotificationService";
import { SignupValues } from "../constants/types";

type AuthContextType = {
  userLogin: (usercred: string, password: string) => Promise<void>;
  userSignup: (
    username: string,
    displayName: string,
    password: string,
    schoolID: string,
    email: string
  ) => Promise<void>;
  userLogout: () => Promise<void>;
  signupValues: SignupValues;
  setSignupValues: React.Dispatch<React.SetStateAction<SignupValues>>
};

export const AuthContext = createContext<AuthContextType>({
  userLogin: null,
  userSignup: null,
  userLogout: null,
  signupValues: null,
  setSignupValues: null,
});

export const AuthProvider = ({ children }) => {
  const { setContextVarsBasedOnToken, userToken } = useContext(UserContext);

  const [signupValues, setSignupValues] = useState<SignupValues>({
    SchoolID: undefined,
    Name: undefined,
    Email: undefined,
    Username: undefined,
    Password: undefined,
  });

  const userLogin = async (usercred: string, password: string) => {
    await setContextVarsBasedOnToken(
      await login(usercred, password).catch((error: Error) => {
        throw error;
      })
    ).catch((error: Error) => {
      displayError(error);
      return null;
    });
  };

  const userSignup = async (
    username: string,
    displayName: string,
    password: string,
    schoolID: string,
    email: string
  ) => {
    await setContextVarsBasedOnToken(
      await signup(username, displayName, password, schoolID, email).catch(
        (error: Error) => {
          throw error;
        }
      )
    ).catch((error: Error) => {
      displayError(error);
      return null;
    });
    setSignupValues({
      SchoolID: undefined,
      Name: undefined,
      Email: undefined,
      Username: undefined,
      Password: undefined,
    });
  };

  const userLogout = async () => {
    const token = await getPushNotificationToken()
    await unregisterPushNotificationToken(userToken.UserAccessToken, userToken.UserID, token)
    await logout();
    await setContextVarsBasedOnToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userLogin,
        userSignup,
        userLogout,
        signupValues,
        setSignupValues
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
