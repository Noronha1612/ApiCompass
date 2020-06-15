import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import News from './pages/News';
import Support from './pages/Support';
import Register_api from './pages/Register_api';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Search from './pages/Search';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={ Home } />
        <Route path="/news" component={ News } />
        <Route path="/support" component={ Support } />
        <Route path="/registerapi" component={ Register_api } />
        <Route path="/user/login" component={ Login } />
        <Route path="/user/register" component={ Register } />
        <Route path="/user/profile" component={ Profile } />
        <Route path="/search" component={ Search } />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;