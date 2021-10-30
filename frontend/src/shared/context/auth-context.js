import { createContext } from 'react';
//createContext is used to create a context 
export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  login: () => {},
  logout: () => {}
});
