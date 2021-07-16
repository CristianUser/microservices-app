/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, RouteProps } from 'react-router-dom';
import './App.scss';
import FormPageRenderer from './Components/FormRenderer';
import ListPageRenderer from './Components/ListRenderer';

import Home from './Pages/Home';
import { routes as sellingRoutes } from './Pages/Selling';
import FormClient from './Services/FormClient';
import { JsonPage } from './Utils/interfaces';

const formClient = new FormClient();

const routes: RouteProps[] = [
  {
    component: Home,
    path: '/',
    exact: true
  },
  ...sellingRoutes
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
          <Route path={page.routePath} key={page.routePath} exact>
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
