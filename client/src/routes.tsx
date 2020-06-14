import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/Home';
import News from './pages/News';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={ Home } />
      <Route path="/news" component={ News } />
    </BrowserRouter>
  );
}

export default Routes;