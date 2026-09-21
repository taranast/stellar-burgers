import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructorItems,
  selectOrderData,
  selectOrderRequest
} from '../../services/selectors/mainSelectors';
import {
  cleanConstructor,
  cleanOrder,
  sendOrder
} from '../../services/slices/mainSlice';
import { selectUser } from '../../services/selectors/userSelectors';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderData);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }
    const ingredientIds = [];
    ingredientIds.push(constructorItems.bun._id);
    ingredientIds.push(...constructorItems.ingredients.map((x) => x._id));
    ingredientIds.push(constructorItems.bun._id);
    dispatch(sendOrder(ingredientIds));
  };
  const closeOrderModal = () => {
    if (orderModalData) {
      dispatch(cleanConstructor());
    }
    dispatch(cleanOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
