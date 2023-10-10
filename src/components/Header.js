import React from 'react';
import logo from '../images/Logo.svg';

function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип сайта" />
    </header>
  )
}
export default Header