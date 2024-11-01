import { User } from '@/types/users.types';
import { createContext, useState } from 'react';

interface IAppContext {
  user: User | null;
  updateUser: (user: User) => void;
}

export const AppContext = createContext<IAppContext>({ user: null, updateUser: () => {} });

export const AppProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (user: User) => {
    setUser(user);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
