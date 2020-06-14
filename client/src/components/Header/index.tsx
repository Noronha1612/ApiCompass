import React, { useState } from 'react';
import { FiSearch, FiUser } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import "./styles.css";

import logoBranco from '../../assets/logo-branco.png';
import logoPreto from '../../assets/logo-preto.png';

interface DynamicStyle {
  minWidth: number
}

const Header = () => {
  const history = useHistory();

  const [ logoBack, setLogoBack ] = useState('#2f3640');
  const [ logoImg, setLogoImg ] = useState(<img src={logoBranco} alt="logo-branco"/>);

  const [ dynamicStyle, setDynamicStyle ] = useState<DynamicStyle>({minWidth: 0})

  const [ searchBoxClassName, setSearchBoxClassName ] = useState('search-box-unselected');

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

          { searchBoxClassName === 'search-box-selected' && <input id="input-search" type="text"/>}
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
          <div className="item item2">
            <div className="itemtext">Support</div>
          </div>
          <div className="item item3">
            <div className="itemtext">Register API</div>
          </div>
        </section>

        <div className="profile-button">
          <FiUser size={28} color='#b9c3d0' className="icon" />
        </div>
      </div>
    </div>
  );
}

export default Header;
