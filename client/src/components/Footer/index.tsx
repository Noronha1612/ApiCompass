import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

import logo from '../../assets/logo.png';

const Footer = () => {
  function handleClickLink(url: string) {
    window.open(url, '_blank')
  }

  return (
    <footer className="footer-container" >
      <img src={logo} alt="logo" className="logo-footer" />

      <div className="contact-box">
        <div className="title">Team</div>

        <div className="p-container">
          <div className="contact-p developer">
            <div className="title-p">Developer</div>
            <p className="name-p">Gabriel Noronha Cavalcante Pessoa</p>
            <p className="email-p">inc.691@gmail.com</p>
            <span onClick={() => { handleClickLink("https://github.com/Noronha1612") }} className="link-developer link">https://github.com/Noronha1612</span>
          </div>
          <div className="contact-p designer">
            <div className="title-p">Designer</div>
            <p className="name-p">João Marcello Souza Santos</p>
            <p className="email-p">joaosportmarcello01@gmail.com</p>
            <span onClick={() => { handleClickLink("https://www.artstation.com/joaomarcello") }} className="link-designer link">https://www.artstation.com/joaomarcello</span>
          </div>
        </div>
      </div>

      <div className="conditions">
        <Link to="/termsandconditions">Terms and Conditions</Link>
        <Link to="/privacypolicy">Privacy policy</Link>
      </div>
    </footer>
  );
}

export default Footer;
