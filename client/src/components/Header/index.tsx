import React, { useState, useEffect, FormEvent } from 'react';
import { FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { verify } from 'jsonwebtoken';

import "./styles.css";

import logoBranco from '../../assets/logo-branco.png';
import logoPreto from '../../assets/logo-preto.png';

interface DynamicStyle {
  minWidth: number
}

interface UserData {
  id: string;
  name: string;
  email: string;
  api_ids: string[];
  liked_apis: string[];
  logged: boolean;
}

const Header = () => {
  const history = useHistory();

  const [ logoBack, setLogoBack ] = useState('#2f3640');
  const [ logoImg, setLogoImg ] = useState(<img src={logoBranco} alt="logo-branco"/>);

  const [ dynamicStyle, setDynamicStyle ] = useState<DynamicStyle>({minWidth: 0});

  const [ searchItem, setSearchItem ] = useState('');

  const defaultUserData = {
    id: '',
    name: '',
    email: '',
    api_ids: [],
    liked_apis: [],
    logged: false
  }

  const [ userData, setUserData ] = useState<UserData>(defaultUserData);

  const [ searchBoxClassName, setSearchBoxClassName ] = useState('search-box-unselected');

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const tokenKey = process.env.REACT_APP_TOKEN_SECRET_KEY as string;

    if ( !token ) return;

    const userData = verify(token, tokenKey);

    setUserData(userData as UserData);
  }, [  ]);

  function handleMouseIn(color: string, url: string) {
    setLogoBack(color);
    setLogoImg(<img src={url} alt={ url === logoBranco ? "logo-branco" : "logo-preto" } />);
  }

  function handleClickSearch() {
    setSearchBoxClassName('search-box-selected');
    setTimeout(() => {
      setDynamicStyle({minWidth: 250});
    }, 400);
  }

  function handleBlurSearch() {
    setSearchBoxClassName('search-box-unselected');
    if (dynamicStyle.minWidth === 250) setDynamicStyle({minWidth: 0});
    else {
      setTimeout(() => {
        setDynamicStyle({minWidth: 0});
      }, 400);
    }
  }

  function handleClickProfile() {
    if ( userData.logged ) {
      history.push(`/user/profile/?user_id=${userData.id}`);
    }
    else {
      history.push('/user/login');
    }
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();

    history.push(`/search/?item=${searchItem}`);
  }

  function handleLogOut() {
    localStorage.removeItem('user_token');
    
    history.push('/');
    window.location.reload();
  }

  return (
    <div className="header-container">
      <div className="half" id="half1">
        <div 
          className="logo-container"
          onMouseEnter={() => { handleMouseIn('#b9c3d0', logoPreto) }}
          onMouseLeave={() => { handleMouseIn('#2f3640', logoBranco) }}
          onClick={() => { history.push('/') }}
          style={{ backgroundColor: logoBack }} 
        >
          {logoImg}
        </div>

        <div 
          id="search-box" 
          className={searchBoxClassName}
          onClick={handleClickSearch}
          style={dynamicStyle}
        >
          <FiSearch color="#b9c3d0" className="icon" size={20} />

          { searchBoxClassName === 'search-box-selected' && (
            <form action="" onSubmit={ handleSearchSubmit } >
              <input id="input-search" type="text" autoFocus onBlur={handleBlurSearch} onChange={e => { setSearchItem(e.target.value) }} />
            </form>
          )}
        </div>
      </div>

      <div className="half" id="half2">
        <section>
          <div 
            className="item item1"
            onClick={() => { history.push('/news') }}
          >
            <div className="itemtext">News</div>
          </div>
          <div 
            className="item item2"
            onClick={() => { history.push('/contact') }}
          >
            <div className="itemtext">Contact</div>
          </div>
          <div 
            className="item item3"
            onClick={() => { history.push('/registerapi') }}
          >
            <div className="itemtext">Register API</div>
          </div>
        </section>

        <div 
          className={userData.logged? "profile-button-logged" : "profile-button"} 
          onClick={handleClickProfile}
        >
          { userData.logged && <span className="username">{userData.name}</span> }
          <FiUser size={28} color='#b9c3d0' className="icon" />
        </div>

        { userData.logged && <button className="loggout-button" onClick={ handleLogOut }><FiLogOut /></button> }
      </div>
    </div>
  );
}

export default Header;
