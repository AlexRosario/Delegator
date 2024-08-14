import { faAngleLeft, faHamburger } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

export const Header = () => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : '';
  const logOut = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="top-nav">
      <img
        src="src/assets/main-logo.png"
        alt="Delegator Logo"
        className="gator-logo"
      />

      <div>
        {!menuOpen ? (
          <FontAwesomeIcon
            icon={faHamburger}
            className="menu-burger"
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
          ></FontAwesomeIcon>
        ) : (
          <div className="top-nav-user">
            <div className="settings-header">
              <FontAwesomeIcon
                icon={faAngleLeft}
                onClick={() => {
                  setMenuOpen(!menuOpen);
                }}
              ></FontAwesomeIcon>
              <b>Settings</b>
            </div>

            <br />
            <div className="profile">
              <h4>{user.username}</h4>
              <h5>Zipcode: {user.address.zipcode}</h5>
              <h6 onClick={logOut} className="log-out">
                Log Out
              </h6>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
