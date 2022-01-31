import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavLinks.css';

const NavLinks = props => {
  return <ul className="nav-links">
    <li>
      <NavLink to="/" end>ALL USERS</NavLink>
    </li>
    <li>
      <NavLink to="/u1/events">MY EVENTS</NavLink>
    </li>
    <li>
      <NavLink to="/events/new">ADD EVENT</NavLink>
    </li>
    <li>
      <NavLink to="/auth">AUTHENTICATE</NavLink>
    </li>
  </ul>
};

export default NavLinks;