// authUtils.js

import axios from "axios";
import { NavigateFunction } from "react-router-dom";

interface AuthState {
    user: string;
  }
  

export const checkAndLoginUser = async (setAuth : React.Dispatch<React.SetStateAction<AuthState>>, navigate : NavigateFunction) => {
    try {
      const response = await axios.get('http://localhost:3000/protected', {
        withCredentials: true,
      });
  
      if (response.data.success) {
        const username = response.data.username;
        setAuth({ user: username });
        navigate('/');
      }
    } catch (error) {
      console.error("Error checking and logging in:", error);
    }
  };
  