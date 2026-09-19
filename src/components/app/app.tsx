import { ConstructorPage, Feed, NotFound404 } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/mainSlice';
import {
  selectError,
  selectIngredients,
  selectIsLoading
} from '../../services/selectors/mainSelectors';

const App = () => {
  const isIngredientsLoading = useSelector(selectIsLoading);
  const ingredients = useSelector(selectIngredients);
  const error = useSelector(selectError);
  const navigate = useNavigate();
  const onClose = () => {
    navigate(-1);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : ingredients.length > 0 ? (
        <Routes>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='*' element={<NotFound404 />} />
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={onClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={onClose}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет игредиентов
        </div>
      )}
    </div>
  );
};

export default App;
