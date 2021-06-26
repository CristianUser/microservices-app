import React, { FC } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps
} from 'react-router-dom';
import './App.scss';

import Home from './Pages/Home';
import ItemsList from './Pages/ItemsList';
import ItemPage from './Pages/Item';

const routes: RouteProps[] = [
  {
    component: Home,
    path: '/',
    exact: true,
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
  }
]

const App: FC = () =>{
  return (
    <Router>
        <Switch>
          {routes.map((route, i) => <Route {...route} key={i}/>)}
        </Switch>
    </Router>
  );
}

export default App;
