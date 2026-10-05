import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIsLoading,
  selectOrders
} from '../../services/selectors/feedSelectors';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const orders = useSelector(selectOrders);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const isLoading = useSelector(selectIsLoading);

  if (!orders.length || isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
