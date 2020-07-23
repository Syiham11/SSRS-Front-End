import React from 'react';

const jwtDecode = require('jwt-decode');

export const AuthContext = React.createContext();

export const checkConnected = () => {
  const local = localStorage.getItem('token');
  const session = sessionStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (local) {
    if (jwtDecode(local).exp < Date.now() / 1000) {
      localStorage.clear();
      sessionStorage.clear();
      return false;
    }
    sessionStorage.setItem('token', local);
    sessionStorage.setItem('user', user);
    return true;
  }
  if (session) {
    return true;
  }
  return false;
};

export const checkAuth = ({ authorization, roleTypes }) => {
  let hasRequiredRole = false;

  if (authorization.roles) {
    const role = authorization.roles[0];

    hasRequiredRole = roleTypes.includes(role);
  }

  return [hasRequiredRole];
};

export const getRole = () => {
  const token = sessionStorage.getItem('token');
  const authorization = jwtDecode(token);
  return authorization.roles[0];
};
