import { createContext, useContext } from "react"
import { UserContext } from "./UserContext"
import { displayError } from "../helpers/helpers"
import { login, signup, logout } from "../services/AuthService"

type AuthContextType = {
    userLogin: (usercred: string, password: string) => Promise<void>
    userSignup: (username: string, displayName: string, email: string, password: string,
        schoolID: string) => Promise<void>
    userLogout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
    userLogin: null,
    userSignup: null,
    userLogout: null
})

export const AuthProvider = ({ children }) => {
    const {setContextVarsBasedOnToken} = useContext(UserContext)
    const userLogin = async (usercred: string, password: string) => {
        setContextVarsBasedOnToken(
            await login(usercred, password).catch((error: Error) => {
              displayError(error);
              return null;
            })
          ).catch((error: Error) => {
            displayError(error);
            return null;
          });
    }

    const userSignup = async (username: string, displayName: string, email: string, password: string,
        schoolID: string) => {
        setContextVarsBasedOnToken(
            await signup(username, displayName, email, password, schoolID).catch((error) => {
              displayError(error);
              return null;
            })
          ).catch((error) => {
            displayError(error);
            return null;
          });
    }

    const userLogout = async () => {
        logout();
        setContextVarsBasedOnToken(null);
    }

    return ( 
        <AuthContext.Provider value={{
          userLogin,
          userSignup,
          userLogout
        }}>
            {children}
        </AuthContext.Provider>

    )
}