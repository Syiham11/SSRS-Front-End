export const API = 'http://localhost:9090';
export const port = '9090';

export const config = {
  headers: { Authorization: sessionStorage.getItem('token') }
};

export const { sub } = JSON.parse(sessionStorage.getItem('user'));
