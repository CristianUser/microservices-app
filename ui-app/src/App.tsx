import React, { FC } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps
} from 'react-router-dom';
import Home from './Pages/Home';
import './App.css';

const routes: RouteProps[] = [
  {
    component: Home,
    path: '/',
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
