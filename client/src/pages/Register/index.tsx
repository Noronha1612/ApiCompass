import React, { FormEvent, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import api from '../../services/api';

import logo from '../../assets/logo.png';
import logoPreto from '../../assets/logo-preto.png';

import ReturnArrow from '../../components/ReturnArrow';

import "./styles.css";

interface CountryNames {
  nativeName: string;
  name: string;
}

interface RegisterResponse {
  logged: boolean;
  jwToken: string;
  message: string;
  field: string
}

const Login: React.FC = () => {
  const history = useHistory();

  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfPassword ] = useState('');
  const [ country, setCountry ] = useState('');

  const [ countries, setCountries ] = useState<CountryNames[]>([]);

  const [ status, setStatus ] = useState(<div className="status statusgray">Enter the data</div>);

  useEffect(() => {
    async function getCountryNames() {
      const response = await axios.get<CountryNames[]>('https://restcountries.eu/rest/v2/all?fields=nativeName;name');

      setCountries(response.data);
    }

    getCountryNames();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    const data = {
      name,
      email,
      password,
      confirmPassword,
      country
    }

    if ( !country || country === '0' ) {
      setStatus(<div className="status statusred" >Please. Select the country</div>);
    }

    const response = await api.post<RegisterResponse>('/users/create', data);

    if ( !response.data.logged ) {
      setStatus(<div className="status statusred" >{response.data.message}</div>);

      return;
    }

    localStorage.setItem('user_token', response.data.jwToken);

    history.push('/');
  }

  return (
    <>
      <div className="register form-container">

        <ReturnArrow />

        <img src={logo} alt="logo" className="background-logo"/>

        <form action="/" onSubmit={handleSubmit} className="box-container">
          <img src={logoPreto} alt="logo-preto"/>

          <div className="title-section">Register</div>

          {status}
          
          <input 
            type="name" 
            placeholder="Name" 
            className="name" 
            required 
            onChange={e => { setName( e.target.value ) }}
          />

          <input 
            type="email" 
            placeholder="E-Mail" 
            className="email" 
            required 
            onChange={e => { setEmail( e.target.value ) }}
          />

          <div className="input-box">
            <input 
              type="password" 
              placeholder="Password" 
              className="password" 
              required
              onChange={e => { setPassword( e.target.value ) }}
            />

            <input 
              type="password"
              placeholder="Confirm Password"
              className="confPass"
              required
              onChange={e => { setConfPassword( e.target.value ) }}
            />
          </div>
          
          <select 
            name="select-country" 
            className="select-country"
            onChange={ e => setCountry(e.target.value) }
          >
            <option value="0">Select an country</option>

            {countries.map(country => (
              <option key={country.name} value={country.name}> {country.nativeName} </option>
            ))}

          </select>

          <button type="submit">Register</button>

          <Link to="/user/login" className="login-link" >Already have an account? Log-in.</Link>
        </form>

      </div>
    </>
  )
}

export default Login;