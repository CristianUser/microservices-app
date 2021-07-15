/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, RouteProps } from 'react-router-dom';
import './App.scss';
import FormPageRenderer from './Components/FormRenderer';
import ListPageRenderer from './Components/ListRenderer';

import Home from './Pages/Home';
import ItemBrandPage from './Pages/Item/ItemBrand';
import ItemBrandsListPage from './Pages/Item/ItemBrandList';
import ItemGroupPage from './Pages/Item/ItemGroup';
import ItemGroupsListPage from './Pages/Item/ItemGroupsList';
import ItemPricePage from './Pages/Item/ItemPrice';
import ItemPricesListPage from './Pages/Item/ItemPricesList';
import SaleOrderPage from './Pages/Sale/Order';
import SaleOrdersPage from './Pages/Sale/Orders';
import FormClient from './Services/FormClient';
import { JsonPage } from './Utils/interfaces';

const formClient = new FormClient();

const routes: RouteProps[] = [
  {
    component: Home,
    path: '/',
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
  const [pages, setPages] = useState<(JsonPage & any)[]>([]);

  useEffect(() => {
    formClient.getPages().then(setPages);
  }, []);

  return (
    <Router>
      <Switch>
        {routes.map((route, i) => (
          <Route {...route} key={`r_${i}`} />
        ))}
        {pages.map((page) => (
          <Route path={page.routePath} exact>
            {page.type === 'form' ? (
              <FormPageRenderer {...page.props} />
            ) : (
              <ListPageRenderer {...page.props} />
            )}
          </Route>
        ))}
      </Switch>
    </Router>
  );
};

export default App;
