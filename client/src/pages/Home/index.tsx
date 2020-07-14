import React, { useState, useEffect, ChangeEvent } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
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

const SelectPage: React.FC<SelectPageProps> = ({ page, amountPages, handleChangePage }) => {
  return (
    <div className="select-page">
      <FiArrowLeft size={22} color="#353b48" style={{ cursor: "pointer" }} onClick={() => handleChangePage(page - 1)} />
      {amountPages.map(p => (
        <button key={p} className={ p === page ? "selected" : "" } onClick={() => handleChangePage(p)}>{p}</button>
      ))}
      <FiArrowRight size={22} color="#353b48" style={{ cursor: "pointer" }} onClick={() => handleChangePage(page + 1)} />
    </div>
  )
}

const Home = () => {
  const [ page, setPage ] = useState(1);
  const [ pages, setPages ] = useState<number[]>([]);

  const [ apiList, setApiList ] = useState<ApiItem[]>([]);

  const [ allCountries, setAllCountries ] = useState<Countries[]>([]);
  const [ country, setCountry ] = useState("0");

  const [ sortType, setSortType ] = useState('id');
  const [ order, setOrder ] = useState('desc');

  function handleChangeOrder(event: ChangeEvent<HTMLSelectElement>) {
    setOrder(event.target.value);
  }

  // Changes pages on SelectPage component
  function handleChangePage(page: number) {
    if ( !pages.includes(page) ) return;

    setPage(page);
  }

  // Sort the api list by sort type
  function handleSelectSortType(event: ChangeEvent<HTMLSelectElement>) {
    setSortType(event.target.value);
  }

  // The api list will only show apis that its country matchs with the sorted one
  function handleSelectCountry(event: ChangeEvent<HTMLSelectElement>) {
    setCountry(event.target.value);
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
      if ( country === '0' ) {
        const response = await api.get<ApiItem[]>(`/apis/list?page=${page}&${sortType}Type=${order}`);

        setApiList(response.data);
      }
      else {
        const response = await api.get<ApiItem[]>(`apis/list?page=${page}&country=${country}&${sortType}Type=${order}`);

        setApiList(response.data);
      }
    }

    loadApiList();
  }, [ sortType, order, page, country ]);

  // Update number of pages available with a country filter
  useEffect(() => {
    async function getPages() {
      const response = await api.get<{pages: number[]}>(country === '0'? 
        'apis/list/getPages' :
        `apis/list/getPages?country=${country}`);
      
      setPage(1);

      setPages(response.data.pages);
    }

    getPages();
  }, [ country ]);

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
            <select name="sortType" className="sortType" onChange={handleSelectSortType} >
              <option value="id">Age</option>
              <option value="likes">Likes</option>
              <option value="views">Views</option>
            </select>

            <select name="sortCountry" className="sortType" onChange={handleSelectCountry} >
              <option value="0">Select a country</option>

              {allCountries.map(({ name }) => <option value={name} key={name}>{name}</option>)}

            </select>

            <select name="sortOrder" className="sortType" onChange={handleChangeOrder}>
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
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
      <Footer />
    </>
  )
}

export default Home;
