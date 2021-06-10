import React, { FC } from 'react';
import { Button } from 'antd';
import HomeLayout from '../Layouts/Home';
import logo from '../Assets/logo.svg';

const HomePage: FC = () =>{
    return (
      <HomeLayout>
          <div className="App">
            <header className="App-header">
                <p>This is the homepage content</p>
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <Button type="primary">Button</Button>
                <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
                >
                Learn React
                </a>
            </header>
            </div>
      </HomeLayout>
    );
  }
  
  export default HomePage;