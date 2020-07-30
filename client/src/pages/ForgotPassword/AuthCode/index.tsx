import React, { FormEvent, ChangeEvent, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useHistory } from 'react-router-dom';
import { createDecipher } from 'crypto';

import useCheckLogged from '../../../utils/checkLogged';

import api from '../../../services/api';
 
import './styles.css';
import '../forgotPass.css';

import ReturnArrow from '../../../components/ReturnArrow';

import logo from '../../../assets/logo.png';
import logoPreto from '../../../assets/logo-preto.png';

const AuthCode = () => {
  const history = useHistory();

  const [ item1, setItem1 ] = useState('');
  const [ item2, setItem2 ] = useState('');
  const [ item3, setItem3 ] = useState('');
  const [ item4, setItem4 ] = useState('');
  const [ item5, setItem5 ] = useState('');
  const [ item6, setItem6 ] = useState('');

  const [ status, setStatus ] = useState(<h1 className="statusgray" >Enter the code</h1>);

  const [ resendEmailDelay, setResendEmailDelay ] = useState(60);

  function handleConfirmCode(e: FormEvent | null) {
    function handleCodeExpiration() {
      history.push('/user/forgotPassword');
    }

    if (e) e.preventDefault();

    const code = item1.concat(item2, item3, item4, item5, item6);

    if (code.length !== 6) {
      setStatus(<h1 className="statusred">Enter a valid code</h1>);
    }

    const jwtAuth = localStorage.getItem('jwtAuthToken');

    const tokenSecretKey = process.env.REACT_APP_TOKEN_SECRET_KEY;

    if ( tokenSecretKey === undefined ) {
      return;
    }

    if ( jwtAuth === null ) {
      handleCodeExpiration();
      return;
    }

    const payload = jwt.verify(jwtAuth, tokenSecretKey) as { userEmail: string, authCode: string, exp: number };

    if ( payload.exp < Date.now() ) {
      handleCodeExpiration();
      return;
    }

    const decipherKey = process.env.REACT_APP_DECIPHER_KEY;

    if ( decipherKey === undefined ) {
      return;
    }
    
    const decipher = createDecipher('aes-256-gcm', decipherKey);

    const authCode = decipher.update(payload.authCode, 'hex', 'utf8');

    if ( authCode === code ) {
      history.push('/user/changePassword');
    }
    else {
      setStatus(<h1 className="statusred">Code doesn't match</h1>);
    }
  }

  function handleChangeInput(e: ChangeEvent<HTMLInputElement>, setItem: React.Dispatch<React.SetStateAction<string>>, id:number) {
    const item = e.target.value;

    if ( !isNaN(Number(item)) && item !== ' ' ) {
      setItem(String(item));
    }
    else {
      setItem('');
    }

    if ( id !== 6 && !!item ) {
      document.getElementById(`btn${id + 1}`)?.focus();
    }
  }

  function handleResendEmail() {
    const token = localStorage.getItem('jwtAuthToken');

    if ( !token ) {
        history.push('/user/forgotPassword');
        return;
    }

    try {
        api.post('/services/resendEmail', { lsToken: token });

        setResendEmailDelay(60);
    }
    catch(err) {
        const { message } = err.response.data;

        setStatus(<h1 className="statusred" style={{ fontSize: 13 }}>{message}</h1>);
    }
  }

  useEffect(() => {
    const jwtAuthCode = localStorage.getItem('jwtAuthToken');

    const tokenSecretKey = process.env.REACT_APP_TOKEN_SECRET_KEY;

    if (tokenSecretKey === undefined || jwtAuthCode === null) {
      history.push('/user/forgotPassword');
      return;
    }

    const payload = jwt.verify(jwtAuthCode, tokenSecretKey) as { userEmail: string, exp: number };

    if ( payload.exp < Date.now() ) {
      localStorage.removeItem('jwtAuthToken');
      history.push('/user/forgotPassword');
    }
  }, [ history ]);

  useEffect(() => {
    const interval = setInterval(() => setResendEmailDelay(resendEmailDelay => resendEmailDelay - 1), 1000);

    if ( resendEmailDelay === 0 ) clearInterval(interval);

    return () => clearInterval(interval)
  }, [ resendEmailDelay ]);

  useCheckLogged([]);

  return (
    <>
      <div className="form-container">

        <ReturnArrow />

        <img src={logo} alt="logo-background" className="background-logo" />
        
        <div className="box-container cp-container">

          <form action="" onSubmit={ handleConfirmCode } >

            {status}

            <h6>The code will expire in 1 hour</h6>

            <div className="code-input">
              <label htmlFor="btn1">
                <input id="btn1" type="text" value={item1} onChange={e => handleChangeInput(e, setItem1, 1)} maxLength={1} />
              </label>
              <label htmlFor="btn2">
                <input id="btn2" type="text" value={item2} onChange={e => handleChangeInput(e, setItem2, 2)} maxLength={1} />
              </label>
              <label htmlFor="btn3">
                <input id="btn3" type="text" value={item3} onChange={e => handleChangeInput(e, setItem3, 3)} maxLength={1} />
              </label>
              <label htmlFor="btn4">
                <input id="btn4" type="text" value={item4} onChange={e => handleChangeInput(e, setItem4, 4)} maxLength={1} />
              </label>
              <label htmlFor="btn5">
                <input id="btn5" type="text" value={item5} onChange={e => handleChangeInput(e, setItem5, 5)} maxLength={1} />
              </label>
              <label htmlFor="btn6">
                <input id="btn6" type="text" value={item6} onChange={e => handleChangeInput(e, setItem6, 6)} maxLength={1} />
              </label>
            </div>

            <button type="submit" >Verify</button>
            <div 
              className="clickableDiv" 
              style={resendEmailDelay === 0? {} : {pointerEvents: 'none', opacity: .6}} 
              onClick={resendEmailDelay === 0? handleResendEmail : () => {}} 
            >Resend email {!!resendEmailDelay && resendEmailDelay}</div>
          </form>

          <img src={logoPreto} alt="logo-preto"/>
        </div>
      </div>
    </>
  );
}

export default AuthCode;