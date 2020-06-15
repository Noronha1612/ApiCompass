import React, { useState, useEffect } from 'react';
import {FiArrowLeft, FiArrowRight} from 'react-icons/fi';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ApiContainer from '../../components/ApiContainer';

import Logo from '../../assets/logo.png';

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
  api_country: string;
}

const Home = () => {
  const [ apiList, setApiList ] = useState<ApiItem[]>([]);
  const [ page, setPage ] = useState(1);

  const [amountPages, setAmountPages] = useState<number[]>([]);

  useEffect(() => {
    async function getApiList() {
      const responseData = await api.get<ApiItem[]>(`/apis/list/?page=${page}`);

      setApiList(responseData.data);
    }

    getApiList();
  }, [ page ]);

  useEffect(() => {
    async function getAmountApis() {
      const response = await api.get<{ amount_apis: number }>('/apis/list/length');

      const pagesArray = [];

      let counter = Math.ceil(response.data.amount_apis / 10);

      while( counter !== 0 ) {
        pagesArray.push(counter);
        counter--;
      }

      pagesArray.sort();
      
      setAmountPages([...pagesArray]);
    }

    getAmountApis();
  }, []);

  function handleChangePage(p: number ) {
    if (page !== p) setPage(p);
  }

  function handleChangePageByArrow(back: boolean) {
    if ( back ) {
      if ( amountPages.includes(page - 1) ) setPage(page - 1);
    }
    else {
      if ( amountPages.includes(page + 1) ) setPage(page + 1);
    }
  }

  return (
    <>
      <Header />
      <div className="blue-section">
        <img src={Logo} alt="logo"/>

        <div className="text-box">
          <h1>Welcome!</h1>
          <h3>The API Compass aims to facilitate the search of public APIs arround the world. feel free to register an API that hasn't been registered yet!</h3>
        </div>
      </div>

      <section className="search-filtered-section">

        { apiList.map(api => (
          <ApiContainer 
            id={api.id}
            name={api.apiName} 
            description={api.description} 
            mainUrl={api.mainUrl} 
            documentationUrl={api.documentationUrl} 
            user_id={ api.user_api_id }
            views={ api.views }
            likes={ api.likes }
            api_country={ api.api_country }
          />
        ))}


      </section>

      <div className="select-page">
        <FiArrowLeft size={22} color="#353b48" style={{ cursor: "pointer" }} onClick={() => handleChangePageByArrow(true)} />
        {amountPages.map(p => (
          <button key={p} className={ p === page ? "selected" : "" } onClick={() => handleChangePage(p)}>{p}</button>
        ))}
        <FiArrowRight size={22} color="#353b48" style={{ cursor: "pointer" }} onClick={() => handleChangePageByArrow(false)} />
      </div>

      <Footer />
    </>
  )
}

export default Home;
