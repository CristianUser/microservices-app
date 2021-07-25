/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import { RouteProps } from 'react-router-dom';

import SaleOrderPage from './Order';
import PosEditorPage from './PosEditor';

export const routes: RouteProps[] = [
  {
    component: SaleOrderPage,
    path: '/order/:id',
    exact: true
  },
  {
    component: PosEditorPage,
    path: '/pos-editor',
    exact: true
  }
];

export default {
  SaleOrderPage
};
