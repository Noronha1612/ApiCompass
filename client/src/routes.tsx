import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import News from './pages/News';
import Contact from './pages/Contact';
import Register_api from './pages/Register_api';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Search from './pages/Search';
import ForgotPasswordEmail from './pages/ForgotPassword/UserEmail';
import ForgotPasswordCode from './pages/ForgotPassword/AuthCode';
import ChangePassword from './pages/ForgotPassword/ChangePassword';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={ Home } />
        <Route path="/news" component={ News } />
        <Route path="/contact" component={ Contact } />
        <Route path="/registerapi" component={ Register_api } />
        <Route path="/user/login" component={ Login } />
        <Route path="/user/register" component={ Register } />
        <Route path="/user/profile" component={ Profile } />
        <Route path="/search" component={ Search } />
        <Route path="/user/forgotpassword" component={ ForgotPasswordEmail } />
        <Route path="/user/confirmCode" component={ ForgotPasswordCode } />
        <Route path="/user/changePassword" component={ ChangePassword } />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;