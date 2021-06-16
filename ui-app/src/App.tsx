import React, { FC } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps
} from 'react-router-dom';
import './App.scss';

import Home from './Pages/Home';
import ProductList from './Pages/ProductList';

const routes: RouteProps[] = [
  {
    component: Home,
    path: '/',
    exact: true
  },
  {
    component: ProductList,
    path: '/product-list',
    exact: true
  }
]

const App: FC = () =>{
  return (
    <Router>
        <Switch>
          {routes.map(route => <Route {...route}/>)}
        </Switch>
    </Router>
  );
}

export default App;
