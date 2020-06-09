import React from 'react';
import { FaUser } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

import './styles.css';

const Header = ()  => {
  const history = useHistory();

  return (
    <div className="header-container">
      <div className="logo" onClick={ () => { history.push('/') } }>
        Logo
      </div>

      <ul>
        <li>item1</li>
        <li>item2</li>
        <li>item3</li>
        <li>item4</li>
      </ul>

      <div className="profile-button">
        <FaUser />
      </div>
    </div>
  );
}

export default Header;