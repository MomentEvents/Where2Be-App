import { createContext, useContext, useRef, useState } from "react";
import { UserContext } from "./UserContext";
import { login, signup, logout } from "../services/AuthService";
import { getPushNotificationToken, unregisterPushNotificationToken } from "../services/NotificationService";
import { SignupValues, Token } from "../constants/types";

type AuthContextType = {
  userLogin: (usercred: string, password: string) => Promise<Token>;
  userSignup: (
    username: string,
    displayName: string,
    password: string,
    email: string
  ) => Promise<Token>;
  userLogout: (doUnregisterPushToken: boolean) => Promise<void>;
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
    Name: undefined,
    Email: undefined,
    Username: undefined,
    Password: undefined,
  });

  const userLogin = async (usercred: string, password: string) => {
    const token: Token = await login(usercred, password);
    await setContextVarsBasedOnToken(token)

    return token
  };

  const userSignup = async (
    username: string,
    displayName: string,
    password: string,
    email: string
  ) => {
    const token: Token = await signup(username, displayName, password, email)
    await setContextVarsBasedOnToken(token)
    setSignupValues({
      Name: undefined,
      Email: undefined,
      Username: undefined,
      Password: undefined,
    });

    return token
  };

  const userLogout = async (doUnregisterPushToken: boolean) => {
    if(doUnregisterPushToken){
      const token = await getPushNotificationToken()
      await unregisterPushNotificationToken(userToken.UserAccessToken, userToken.UserID, token)
    }
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
