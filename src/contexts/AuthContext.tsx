import { createContext, useContext } from "react";
import { UserContext } from "./UserContext";
import { displayError, formatError } from "../helpers/helpers";
import { login, signup, logout } from "../services/AuthService";

type AuthContextType = {
  userLogin: (usercred: string, password: string) => Promise<void>;
  userSignup: (
    username: string,
    displayName: string,
    password: string,
    schoolID: string
  ) => Promise<void>;
  userLogout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  userLogin: null,
  userSignup: null,
  userLogout: null,
});

export const AuthProvider = ({ children }) => {
  const { setContextVarsBasedOnToken } = useContext(UserContext);

  const userLogin = async (usercred: string, password: string) => {
    await setContextVarsBasedOnToken(
      await login(usercred, password).catch((error: Error) => {
        throw error;
      })
    ).catch((error: Error) => {
      throw error;
    });
  };

  const userSignup = async (
    username: string,
    displayName: string,
    password: string,
    schoolID: string
  ) => {
    await setContextVarsBasedOnToken(
      await signup(username, displayName, password, schoolID).catch(
        (error) => {
          throw error;
        }
      )
    ).catch((error) => {
      throw error;
    });
  };

  const userLogout = async () => {
    await logout();
    setContextVarsBasedOnToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userLogin,
        userSignup,
        userLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
