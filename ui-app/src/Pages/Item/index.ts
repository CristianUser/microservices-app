import { RouteProps } from 'react-router-dom';

import ItemPage from './Item';
import ItemBrandPage from './ItemBrand';
import ItemBrandsListPage from './ItemBrandList';
import ItemGroupPage from './ItemGroup';
import ItemGroupsListPage from './ItemGroupsList';
import ItemPricePage from './ItemPrice';
import ItemPricesListPage from './ItemPricesList';
import ItemsList from './ItemsList';

export const routes: RouteProps[] = [
  {
    component: ItemsList,
    path: '/items-list',
    exact: true
  },
  {
    component: ItemPage,
    path: '/item/:id',
    exact: true
  },
  {
    component: ItemGroupsListPage,
    path: '/item-groups',
    exact: true
  },
  {
    component: ItemGroupPage,
    path: '/item-group/:id',
    exact: true
  },
  {
    component: ItemPricesListPage,
    path: '/item-prices',
    exact: true
  },
  {
    component: ItemPricePage,
    path: '/item-price/:id',
    exact: true
  },
  {
    component: ItemBrandsListPage,
    path: '/item-brands',
    exact: true
  },
  {
    component: ItemBrandPage,
    path: '/item-brand/:id',
    exact: true
  }
];

export default {};
