/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route, RouteProps } from 'react-router-dom';
import './App.scss';

import Home from './Pages/Home';
import ItemsList from './Pages/ItemsList';
import ItemPage from './Pages/Item';
import ItemGroupsListPage from './Pages/ItemGroupsList';
import ItemGroupPage from './Pages/ItemGroup';
import ItemPricesListPage from './Pages/ItemPricesList';
import ItemPricePage from './Pages/ItemPrice';

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
