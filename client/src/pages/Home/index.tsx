import React, { useState, useEffect, ChangeEvent } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import axios from 'axios';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ApiContainer from '../../components/ApiContainer';

import Logo from '../../assets/logo.png';
import BgDecoration from '../../assets/bg-decoration.png';

import api from '../../services/api';

import "./styles.css";

interface ApiItem {
  id: number;
  apiName: string;
  description: string;
  mainUrl: string;
  documentationUrl: string | null;
  user_api_id: string;
  views: number;
  likes: number;
  apiCountry: string;
}

interface SelectPageProps {
  page: number;
  amountPages: number[];
  handleChangePageByArrow: (bacK: boolean) => void;
  handleChangePage: (page: number) => void;
}

interface Coutries {
  name: string;
}

const SelectPage: React.FC<SelectPageProps> = ({ page, amountPages, handleChangePage, handleChangePageByArrow }) => {
  return (
    <div className="select-page">
      <FiArrowLeft size={22} color="#353b48" style={{ cursor: "pointer" }} onClick={() => handleChangePageByArrow(true)} />
      {amountPages.map(p => (
        <button key={p} className={ p === page ? "selected" : "" } onClick={() => handleChangePage(p)}>{p}</button>
      ))}
      <FiArrowRight size={22} color="#353b48" style={{ cursor: "pointer" }} onClick={() => handleChangePageByArrow(false)} />
    </div>
  )
}

const Home = () => {
  return (
    <>
      <Header />
      <div className="blue-section">

        <div className="content">
          <img src={Logo} alt="logo" className="logo-home" />

          <div className="text-box">
            <h1>Welcome!</h1>
            <h3>The API Compass aims to facilitate the search of public APIs arround the world. feel free to register an API that hasn't been registered yet!</h3>
          </div>

          <div className="background">
            <img src={BgDecoration} alt="background-decoration" className="bg-decoration" />
          </div>
        </div>
      </div>

      <div className="main-homepage">
        <section className="select-api" >
          
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Home;
