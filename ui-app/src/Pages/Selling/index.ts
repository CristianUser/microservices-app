/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import { RouteProps } from 'react-router-dom';

import CustomerPage from './Customer';
import CustomersPage from './Customers';
import SaleOrderPage from './Order';
import SaleOrdersPage from './Orders';

export const routes: RouteProps[] = [
  {
    component: CustomerPage,
    path: '/customer/:id',
    exact: true
  },
  {
    component: CustomersPage,
    path: '/customers',
    exact: true
  },
  {
    component: SaleOrdersPage,
    path: '/orders',
    exact: true
  },
  {
    component: SaleOrderPage,
    path: '/order/:id',
    exact: true
  }
];

export default {
  SaleOrderPage,
  SaleOrdersPage
};
