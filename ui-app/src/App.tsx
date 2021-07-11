/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route, RouteProps } from 'react-router-dom';
import './App.scss';

import Home from './Pages/Home';
import ItemPage from './Pages/Item/Item';
import ItemBrandPage from './Pages/Item/ItemBrand';
import ItemBrandsListPage from './Pages/Item/ItemBrandList';
import ItemGroupPage from './Pages/Item/ItemGroup';
import ItemGroupsListPage from './Pages/Item/ItemGroupsList';
import ItemPricePage from './Pages/Item/ItemPrice';
import ItemPricesListPage from './Pages/Item/ItemPricesList';
import ItemsList from './Pages/Item/ItemsList';
import SaleOrderPage from './Pages/Sale/Order';
import SaleOrdersPage from './Pages/Sale/Orders';

const routes: RouteProps[] = [
  {
    component: Home,
    path: '/',
    exact: true
  },
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

const App: FC = () => {
  return (
    <Router>
      <Switch>
        {routes.map((route, i) => (
          <Route {...route} key={`r_${i}`} />
        ))}
      </Switch>
    </Router>
  );
};

export default App;
