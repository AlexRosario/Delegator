import { faAngleLeft, faHamburger } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faLandmarkDome } from '@fortawesome/free-solid-svg-icons';
import { useScreenInfo } from '../providers/ScreenProvider';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const userString = localStorage.getItem('user');
  let user = userString ? JSON.parse(userString) : null;

  const logOut = () => {
    localStorage.clear();
    window.location.href = '/';
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const { screenSelect, setScreenSelect } = useScreenInfo();

  return (
    <>
      {' '}
      <div className="top-nav">
        <img
          src="src/assets/main-logo.png"
          alt="Delegator Logo"
          className="gator-logo"
        />

        <section className="top-nav-user">
          {user && !menuOpen && (
            <FontAwesomeIcon
              icon={faHamburger}
              className="menu-burger"
              onClick={() => {
                console.log(userString);

                setMenuOpen(!menuOpen);
              }}
            />
          )}
          {user && menuOpen && (
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
          )}
          {!user && <Link to="/Home">Sign in</Link>}
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
