import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';
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

  function handleChangePage(p: number) {
    if (page !== p) setPage(p);
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

      <div className="search-filtered">

        {apiList.map(api => (
          <div key={api.id}>API ID: {api.id}</div>
        ))}

        {amountPages.map(page => (
          <button key={page} onClick={() => handleChangePage(page)}>{page}</button>
        ))}

      </div>
    </>
  )
}

export default Home;
