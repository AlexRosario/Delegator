import { useContext, ReactNode, createContext, useState } from 'react';

import { User } from '../types.tsx';

export type AuthContextType = {
	user: User;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : {};


	return (
		<AuthContext.Provider value={ user}>
			{children}
		</AuthContext.Provider>
	);
};
export const useAuthInfo = () => {
	return useContext(AuthContext);
};