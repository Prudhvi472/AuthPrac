import {ReactNode, createContext , useContext, useState } from "react";

interface AuthState {
    user: string;
    password: string;
  }
  
  interface AuthContextValue {
    auth: AuthState;
    setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  }
  

const AuthContext = createContext<AuthContextValue | undefined>(undefined);


export const AuthProvider = ({children} : { children: ReactNode }) =>{
    const [auth,setAuth] = useState<AuthState>({
        user : '',
        password : ''
    })
    return (
        <AuthContext.Provider value={{auth , setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
  
    return context as AuthContextValue; // Assert that context is of type AuthContextValue
  };


export default AuthContext;