import React, { useEffect } from 'react';

import updateData from './utils/updateData';

import Routes from './routes';

import "./Main.css";

function App() {
  useEffect(() => {
    updateData();
  }, []);

  return <Routes />;
}

export default App;
