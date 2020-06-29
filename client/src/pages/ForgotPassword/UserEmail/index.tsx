import React, { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../../services/api';

import ReturnArrow from '../../../components/ReturnArrow';

import logo from '../../../assets/logo.png';
import logoPreto from '../../../assets/logo-preto.png';

import './styles.css';
import '../forgotPass.css';

const ForgotPassword = () => {
  const history = useHistory();

  const [ email, setEmail ] = useState('');
  const [ status, setStatus ] = useState(<span className="status statusgray">Enter the data</span>)

  async function handleEnterEmail(e: FormEvent) {
    e.preventDefault();

    const searchAccount = await api.get<{error: boolean, message: string}>(`/users/list/?email=${email}`);

    if ( searchAccount.data.error ) {
      setStatus(<span className="status statusred">{searchAccount.data.message}</span>);
      return;
    }

    // Code HERE

    history.push('/user/confirmCode');
  }

  return (
    <>
      <div className="form-container">
        <ReturnArrow />

        <img src={logo} alt="logo" className="background-logo" />

        <div className="fp-container box-container">
          <h1>Enter your email</h1>
          <h6>An email will be sent with a code to reset your password</h6>

          <form action="" onSubmit={handleEnterEmail} >
            {status}

            <input 
              type="email" 
              className="email" 
              onChange={ e => setEmail(e.target.value)}
              placeholder="email"
              required
            />

            <button type="submit" >Send</button>
          </form>

          <img src={logoPreto} alt="logo-preto"/>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
