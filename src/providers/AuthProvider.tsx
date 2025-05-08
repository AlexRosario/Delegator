import {
  useContext,
  ReactNode,
  createContext,
  useState,
  useEffect
} from 'react';
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

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        setUser(JSON.parse(userString));
      } catch (e) {
        console.error('Invalid user JSON in localStorage', e);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthInfo = () => {
  return useContext(AuthContext);
};
