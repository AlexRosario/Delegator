import { useContext, ReactNode, createContext, useState } from 'react';
import { User } from '../types';

export type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const defaultUser: User = {
  id: '',
  username: '',
  email: '',
  zipcode: ''
};
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuthInfo = () => {
  return useContext(AuthContext);
};
