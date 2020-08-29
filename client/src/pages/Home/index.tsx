import React, { useState, useEffect, ChangeEvent } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { FaPaypal } from 'react-icons/fa';
import jwt from 'jsonwebtoken';
import axios from 'axios';

import Select, { ValueType } from 'react-select';
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
  user_api_id: string;
  views: number;
  likes: number;
  apiCountry: string;
}

interface SelectPageProps {
  page: number;
  amountPages: number[];
  handleChangePage: (page: number) => void;
}

interface Countries {
  name: string;
}

interface SelectComponentProps {
  value: string;
  label: string;
}

const SelectPage: React.FC<SelectPageProps> = ({ page, amountPages, handleChangePage }) => {
  function getPagesArray(amountPages: number[], page: number) {
    if ( page === 1 || page === 2 ) return amountPages.slice(0, 5);
    else if ( page === amountPages.length || page === amountPages.length - 1 ) return amountPages.slice(amountPages.length - 5, amountPages.length);
    else return amountPages.slice( page - 3, page + 2 )
  }

  const pagesArray = getPagesArray(amountPages, page);

  return (
    <>
      <div className="select-page">
        <FiArrowLeft size={22} color="#353b48" style={{ cursor: "pointer" }} onClick={() => handleChangePage(page - 1)} />
        {pagesArray.map(p => (
          <button key={p} className={ p === page ? "selected" : "" } onClick={() => handleChangePage(p)}>{p}</button>
        ))}
        <FiArrowRight size={22} color="#353b48" style={{ cursor: "pointer" }} onClick={() => handleChangePage(page + 1)} />
      </div>

      <div className="pages-available" >{amountPages.length} Pages available</div>
    </>
  )
}

const Home = () => {
  const [ page, setPage ] = useState(1);
  const [ pages, setPages ] = useState<number[]>([]);

  const [ apiList, setApiList ] = useState<ApiItem[]>([]);

  const [ allCountries, setAllCountries ] = useState<Countries[]>([]);
  const [ country, setCountry ] = useState<SelectComponentProps>({ value: '0', label: "Filter by country" });

  const [ sortType, setSortType ] = useState<SelectComponentProps>({ value: 'id', label: 'Age' });
  const [ order, setOrder ] = useState<SelectComponentProps>({ value: 'desc', label: 'Desc' });

  // Changes pages on SelectPage component
  function handleChangePage(page: number) {
    if ( !pages.includes(page) ) return;

    setPage(page);
  }

  // Send the user to paypal donate page
  function handleClickDonate() {
    const url = process.env.REACT_APP_PAYPAL_DONATE_URL as string;

    console.log(url)

    window.open(url, '_blank');
  }

  // Get pages number to SelectPage component show the exact number of pages available to be shown
  useEffect(() => {
    async function getPages() {
      const response = await api.get<{pages: number[]}>('/apis/list/getPages');

      setPages(response.data.pages);
    }

    getPages();
  }, []);

  // Load all countries to select on Sort Types
  useEffect(() => {
    async function loadCountries() {
      const response = await axios.get<Countries[]>('https://restcountries.eu/rest/v2/all?fields=name');

      setAllCountries(response.data);
    }

    loadCountries();
  }, []);

  // Make a request to backend and load the api list by the requested page
  useEffect(() => {
    async function loadApis() {
      const response = await api.get<ApiItem[]>(`apis/list?page=1`);

      setApiList(response.data);
    }

    loadApis();
  }, []);

  // When Sort type select changes this useEffect will load up the sorted apiList instead the other one
  useEffect(() => {
    async function loadApiList() {
      if ( country.value === '0' ) {
        const response = await api.get<ApiItem[]>(`/apis/list?page=${page}&${sortType.value}Type=${order.value}`);

        setApiList(response.data);
      }
      else {
        const response = await api.get<ApiItem[]>(`apis/list?page=${page}&country=${country.value}&${sortType.value}Type=${order.value}`);

        setApiList(response.data);
      }
    }

    loadApiList();
  }, [ sortType, order, page, country ]);

  // Update number of pages available with a country filter
  useEffect(() => {
    async function getPages() {
      const response = await api.get<{pages: number[]}>(country.value === '0'? 
        'apis/list/getPages' :
        `apis/list/getPages?country=${country.value}`);
      
      setPage(1);

      setPages(response.data.pages);
    }

    getPages();
  }, [ country ]);
  
  useEffect(() => {
    const jwtAuthCode = localStorage.getItem('jwtAuthToken');

    const tokenSecretKey = process.env.REACT_APP_TOKEN_SECRET_KEY;

    if (tokenSecretKey === undefined || jwtAuthCode === null) {
      return;
    }

    const payload = jwt.verify(jwtAuthCode, tokenSecretKey) as { exp: number };

    if ( payload.exp < Date.now() ) {
      localStorage.removeItem('jwtAuthToken');
    }
  }, []);

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

        <SelectPage page={page} amountPages={pages} handleChangePage={handleChangePage} />

        <section className="select-api" >

          <div className="sortItems">
            <Select
              value={ sortType }
              className="sortType"
              onChange={value => setSortType(value as SelectComponentProps)}
              options={[
                { value: "age", label: "Age" },
                { value: "likes", label: "Likes" },
                { value: "views", label: "Views" }
              ]} 
            />

            <Select 
              value={country}
              className="sortType"
              onChange={ value => setCountry(value as SelectComponentProps) }
              options={[
                { value: '0', label: 'Filter by country' },
                ...allCountries.map(({ name }) => ({ label: name, value: name }))
              ]}
            />

            <Select 
              value={order}
              className="sortType"
              onChange={ value => setOrder(value as SelectComponentProps) }
              options={[
                { value: 'desc', label: 'Desc' },
                { value: 'asc', label: 'Asc' }
              ]}
            />
          </div>
          

          {apiList.map(api => (
            <ApiContainer 
              key={api.id}
              id={api.id}
              name={api.apiName}
              description={api.description}
              user_id={api.user_api_id}
              views={api.views}
              likes={api.likes}
              api_country={api.apiCountry} 
            />
          ))}

        </section>

        <SelectPage page={page} amountPages={pages} handleChangePage={handleChangePage} />
        
      </div>

      <div className="donate-section">
        <h1>Is API Compass being useful to you? Help us with a small donation($12)! We are going to be very pleased!</h1>
        <button className="donate-paypal" onClick={handleClickDonate} >
          Donate with PayPal
          <FaPaypal color="#fafafa" size={18} className="paypal-icon"/>
        </button>
      </div>
      <Footer />
    </>
  )
}

export default Home;
