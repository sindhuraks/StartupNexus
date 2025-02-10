import cookie from 'cookie';

export const checkSession = (req) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.access_token ? true : false;
};