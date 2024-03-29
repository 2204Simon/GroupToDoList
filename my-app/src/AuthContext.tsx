// AuthContext.tsx
import React from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
};

export const AuthContext = React.createContext<AuthContextType>({
  isLoggedIn: false,
  setLoggedIn: () => {},
});