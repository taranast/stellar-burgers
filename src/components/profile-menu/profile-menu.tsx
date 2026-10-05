import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Preloader, ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { logoutUser } from '../../services/slices/userSlice';
import { selectIsLoading } from '../../services/selectors/userSelectors';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
