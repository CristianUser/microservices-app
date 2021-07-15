/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route, RouteProps } from 'react-router-dom';
import './App.scss';

import Home from './Pages/Home';
import { routes as itemRoutes } from './Pages/Item';
import { routes as sellingRoutes } from './Pages/Selling';

const routes: RouteProps[] = [
  {
    component: Home,
    path: '/',
    exact: true
  },
  ...itemRoutes,
  ...sellingRoutes
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
