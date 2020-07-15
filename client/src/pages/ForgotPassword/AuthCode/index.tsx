import React, { FormEvent, ChangeEvent, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useHistory } from 'react-router-dom';
import { createDecipher } from 'crypto';
 
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

  const [ status, setStatus ] = useState(<h1 className="statusgray" >Enter the code</h1>)

  function handleConfirmCode(e: FormEvent) {
    function handleCodeExpiration() {
      history.push('/user/forgotPassword');
    }

    e.preventDefault();

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
      console.log(authCode)
      setStatus(<h1 className="statusred">Code doesn't match</h1>);
    }
  }

  function handleChangeInput(e: ChangeEvent<HTMLInputElement>, setItem: React.Dispatch<React.SetStateAction<string>>) {
    const item = e.target.value;

    if ( !isNaN(Number(item)) && item !== ' ' ) {
      setItem(String(item));
    }
    else {
      setItem('');
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
              <div>
                <input type="text" value={item1} onChange={e => handleChangeInput(e, setItem1)} maxLength={1} />
              </div>
              <div>
                <input type="text" value={item2} onChange={e => handleChangeInput(e, setItem2)} maxLength={1} />
              </div>
              <div>
                <input type="text" value={item3} onChange={e => handleChangeInput(e, setItem3)} maxLength={1} />
              </div>
              <div>
                <input type="text" value={item4} onChange={e => handleChangeInput(e, setItem4)} maxLength={1} />
              </div>
              <div>
                <input type="text" value={item5} onChange={e => handleChangeInput(e, setItem5)} maxLength={1} />
              </div>
              <div>
                <input type="text" value={item6} onChange={e => handleChangeInput(e, setItem6)} maxLength={1} />
              </div>
            </div>

            <button type="submit" >Verify</button>
          </form>

          <img src={logoPreto} alt="logo-preto"/>
        </div>
      </div>
    </>
  );
}

export default AuthCode;