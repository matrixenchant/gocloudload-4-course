import { useApi } from '@/hooks/useApi';

import { createContext, useState } from 'react';

interface IAppContext {
  user: User | null;
  updateUser: (user: User) => void;

  books: Book[];
  booksLoading: boolean;
  booksError: string;

  token: string;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AppContext = createContext<IAppContext>({} as any);

export const AppProvider = ({ children }: any) => {
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '');
  const [user, setUser] = useState<User | null>(null);
  const {
    loading: booksLoading,
    data: books,
    error: booksError,
  } = useApi<Book[]>('books', { default: [] });

  const updateUser = (user: User) => {
    setUser(user);
  };

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
  };

  console.log('APP CONTEXT', token);
  

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,

        token,
        login,
        logout,

        books,
        booksLoading,
        booksError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
