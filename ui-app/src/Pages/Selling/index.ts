/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import { RouteProps } from 'react-router-dom';

import SaleOrderPage from './Order';

export const routes: RouteProps[] = [
  {
    component: SaleOrderPage,
    path: '/order/:id',
    exact: true
  }
];

export default {
  SaleOrderPage
};
