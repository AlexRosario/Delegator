import React, { useEffect, useState, FormEvent } from 'react';
import { Requests } from './api';
import toast from 'react-hot-toast';
import { User } from './types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthInfo } from './Providers/AuthProvider';

export const SignIn = () => {
  const [name, setName] = useState('');
  const [pWord, setPWord] = useState('');
  const { setUser } = useAuthInfo();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) {
      setName(location.state.username || '');
      setPWord(location.state.password || '');
      if (name && pWord) {
        handleSignIn();
      }
    }
  }, [location.state, pWord]);

  const handleSignIn = () => {
    Requests.getAllUsers()
      .then((users) =>
        users.find((user: User) => {
          return (
            user.username?.toLowerCase() === name.toLowerCase() &&
            user.password === pWord
          );
        })
      )
      .then((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        navigate('/App');
      })
      .catch((err) => {
        toast.error('Sign in failed');
        return console.error('Fetch error:', err.message);
      });
  };
  return (
    <>
      <form
        className="sign-in-field"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignIn();
        }}
      >
        <input
          className="name"
          type="text"
          name="name"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>

        <input
          className="password"
          type="text"
          name="password"
          placeholder="Password"
          value={pWord}
          onChange={(e) => setPWord(e.target.value)}
        ></input>

        <button type="submit">Sign In</button>
      </form>
    </>
  );
};
