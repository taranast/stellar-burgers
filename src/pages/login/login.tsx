import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import {
  selectError,
  selectIsLoading
} from '../../services/selectors/userSelectors';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const loginData = {
      email,
      password
    };
    dispatch(loginUser(loginData));
  };

  const error = useSelector(selectError);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
