import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/selectors/userSelectors';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { getCookie } from '../../utils/cookie';
import { fetchUser, setAuthChecked } from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const from = location.state?.from || { pathname: '/' };
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthChecked) {
      const accessToken = getCookie('accessToken');
      if (accessToken) {
        dispatch(fetchUser());
      } else {
        dispatch(setAuthChecked());
      }
    }
  }, [dispatch, isAuthChecked]);
  if (!isAuthChecked) {
    return <Preloader />;
  }
  if (onlyUnAuth && user) {
    return <Navigate replace to={from} state={location} />;
  }
  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }
  return children;
};
