import React, { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import useCheckLogged from '../../utils/checkLogged';

import api from '../../services/api';

import logo from '../../assets/logo.png';
import logoPreto from '../../assets/logo-preto.png';

import ReturnArrow from '../../components/ReturnArrow';

import "./styles.css";

interface LoginResponse {
  logged: boolean;
  jwToken: string;
  message: string;
}

const Login: React.FC = () => {
  const history = useHistory();

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const [ status, setStatus ] = useState(<div className="status statusgray">Enter the data</div>);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const data = {
      email,
      password
    }

    const response = await api.post<LoginResponse>('/users/login', data);
    
    if ( !response.data.logged ) {
      setStatus(<div className="status statusred" >{response.data.message}</div>)

      return;
    }

    localStorage.setItem('user_token', response.data.jwToken);

    history.push('/');
  }

  useCheckLogged([]);

  return (
    <>
      <div className="login form-container">

        <ReturnArrow />

        <img src={logo} alt="logo" className="background-logo"/>

        <form action="/" onSubmit={handleSubmit} className="box-container">
          <img src={logoPreto} alt="logo-preto"/>

          <div className="title-section">Login</div>

          {status}

          <input 
            type="email" 
            placeholder="E-Mail" 
            className="email" 
            required 
            onChange={e => { setEmail( e.target.value ) }}
          />

          <input 
            type="password" 
            placeholder="Password" 
            className="password" 
            required
            onChange={e => { setPassword( e.target.value ) }}
          />

          <button type="submit">Log-In</button>

          <Link to="/user/forgotpassword" className="forget-pass-link">Did you forget your pass?</Link>
          <Link to="/user/register" className="register-link">Don't have an account? Please register.</Link>
        </form>
      </div>
    </>
  )
}

export default Login;