import React from 'react';

import Header from '../../components/Header';
import Logo from '../../assets/logo.png';

import "./styles.css";

const Home = () => {
  return (
    <>
      <Header />
      <div className="blue-section">
        <img src={Logo} alt="logo"/>

        <div className="text-box">
          <h1>Welcome!</h1>
          <h3>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</h3>
        </div>
      </div>
    </>
  )
}

export default Home;
