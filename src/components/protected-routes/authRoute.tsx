import { Navigate } from 'react-router-dom';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/selectors/userSelectors';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { getCookie } from '../../utils/cookie';
import { fetchUser, setAuthChecked } from '../../services/slices/userSlice';

export const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
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
  return user ? <Navigate to='/profile' replace /> : children;
};
