/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import { RouteProps } from 'react-router-dom';

import SaleOrderPage from './Order';
import PosEditorPage from './PosEditor';
import PosSessionPage from './PosSession';

export const routes: RouteProps[] = [
  {
    component: SaleOrderPage,
    path: '/order/:id',
    exact: true
  },
  {
    component: PosEditorPage,
    path: '/pos-layout/:id',
    exact: true
  },
  {
    component: PosSessionPage,
    path: '/pos-session/:id',
    exact: true
  }
];

export default {
  SaleOrderPage
};
