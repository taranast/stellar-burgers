import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/selectors/userSelectors';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';

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
