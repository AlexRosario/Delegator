import { faAngleLeft, faHamburger } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faLandmarkDome } from '@fortawesome/free-solid-svg-icons';
import { useScreenInfo } from '../providers/ScreenProvider';
import { useAuthInfo } from '../providers/AuthProvider';
import { useCallback, useEffect, useState, useRef } from 'react';
import { Link, useHref, useLocation } from 'react-router-dom';
import { defaultUser } from '../providers/AuthProvider';

export const Header = () => {
  const { screenSelect, setScreenSelect } = useScreenInfo();
  const { user, setUser } = useAuthInfo();
  const [menuOpen, setMenuOpen] = useState(false);

  const logOut = () => {
    setUser(defaultUser);
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <>
      {'E Pluribus Unum'}
      <div className="top-nav">
        <img
          src="src/assets/main-logo.png"
          alt="Delegator Logo"
          className="gator-logo"
        />

        <section className="top-nav-user">
          {user.username ? (
            !menuOpen ? (
              <FontAwesomeIcon
                icon={faHamburger}
                className="menu-burger"
                onClick={() => {
                  setMenuOpen(!menuOpen);
                }}
              />
            ) : (
              <div className="settings-header">
                <div>
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    onClick={() => {
                      setMenuOpen(!menuOpen);
                    }}
                  />
                </div>

                <div className="profile">
                  <b>Settings</b>
                  <h4>{user?.username}</h4>
                  <h5>Zipcode: {user?.zipcode}</h5>
                  <h6 onClick={logOut} className="log-out">
                    Log Out
                  </h6>
                </div>
              </div>
            )
          ) : (
            <Link to="/Home">Sign in</Link>
          )}
        </section>
      </div>
      <div className="bottom-nav">
        <FontAwesomeIcon
          icon={faLandmarkDome}
          className={`screenSelect ${screenSelect === 'bills' ? 'active' : ''}`}
          onClick={() => setScreenSelect('bills')}
        />

        <FontAwesomeIcon
          icon={faChair}
          className={`screenSelect ${screenSelect === 'reps' ? 'active' : ''}`}
          onClick={() => {
            setScreenSelect('reps');
          }}
        />
      </div>
    </>
  );
};
