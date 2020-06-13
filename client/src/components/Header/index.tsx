import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

import "./styles.css";

import logoBranco from '../../assets/logo-branco.png';
import logoPreto from '../../assets/logo-preto.png';

const Header = () => {
  const [ logoBack, setLogoBack ] = useState('#2f3640');
  const [ logoImg, setLogoImg ] = useState(<img src={logoBranco} alt="logo-branco"/>);

  const [ searchBoxClassName, setSearchBoxClassName ] = useState('search-box-unselected');

  function handleMouseIn(color: string, url: string) {
    setLogoBack(color);
    setLogoImg(<img src={url} alt={ url === logoBranco ? "logo-branco" : "logo-preto" } />);
  }

  function handleClickSearchBox() {
    setSearchBoxClassName('search-box-selected');
  }

  return (
    <div className="header-container">
      <div className="half" id="half1">
        <div 
          className="logo-container"
          onMouseEnter={() => { handleMouseIn('#b9c3d0', logoPreto) }}
          onMouseLeave={() => { handleMouseIn('#2f3640', logoBranco) }}
          style={{ backgroundColor: logoBack }} 
        >
          {logoImg}
        </div>

        <div 
          id="search-box" 
          className={searchBoxClassName}
          onClick={handleClickSearchBox}
          >
          <FiSearch color="#b9c3d0" className="icon" size={20} />

          { searchBoxClassName === 'search-box-selected' && <input type="text"/>}
        </div>
      </div>

      <div className="half" id="half2">
        <div className="item1">item</div>
      </div>
      
    </div>
  );
}

export default Header;
