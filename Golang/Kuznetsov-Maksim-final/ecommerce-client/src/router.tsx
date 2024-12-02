import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { LoaderIcon } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/Auth';
import RegisterPage from './pages/Register';
import HomePage from './pages/shop/Home';
import Orders from './pages/shop/Orders';
import AuthStore from './stores/auth.store';
import UserStore from './stores/user.store';

const AppRouter = () => {
  const isAuth = AuthStore.isAuth;
  const role = UserStore.user?.role;

  useEffect(() => {
    AuthStore.init();
  }, []);

  if (AuthStore.authLoading) return <LoaderIcon />;

  if (!isAuth)
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<Navigate to={'/auth'} />} />
      </Routes>
    );

  switch (role) {
    case 'admin1':
      return (
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="*" element={<Navigate to={'/'} />} />
        </Routes>
      );

    // user
    default:
      return (
        <Routes>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/orders" element={<Orders />}></Route>
          <Route path="*" element={<Navigate to={'/home'} />} />
        </Routes>
      );
  }
};

export default observer(AppRouter);
