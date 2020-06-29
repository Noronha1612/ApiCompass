import React, { FormEvent, ChangeEvent, useState, Dispatch } from 'react';

import './styles.css';
import '../forgotPass.css';

import ReturnArrow from '../../../components/ReturnArrow';

import logo from '../../../assets/logo.png';
import logoPreto from '../../../assets/logo-preto.png';

const AuthCode = () => {
  const [ item1, setItem1 ] = useState('');
  const [ item2, setItem2 ] = useState('');
  const [ item3, setItem3 ] = useState('');
  const [ item4, setItem4 ] = useState('');
  const [ item5, setItem5 ] = useState('');
  const [ item6, setItem6 ] = useState('');

  const [ status, setStatus ] = useState(<h1 className="statusgray" >Enter the code</h1>)

  function handleConfirmCode(e: FormEvent) {
    e.preventDefault();

    const code = item1.concat(item2, item3, item4, item5, item6);

    if (code.length !== 6) {
      setStatus(<h1 className="statusred">Enter a valid code</h1>);
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

  return (
    <>
      <div className="form-container">

        <ReturnArrow />

        <img src={logo} alt="logo-background" className="background-logo" />
        
        <div className="box-container cp-container">

          <form action="" onSubmit={ handleConfirmCode } >

            {status}

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