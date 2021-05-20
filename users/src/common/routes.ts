const API_ROUTE = '/api';

const USERS_ROUTE = `${API_ROUTE}/users`;

export const Routes = {
  currentUser: `${USERS_ROUTE}/currentuser`,
  signup: `${USERS_ROUTE}/signup`,
  signin: `${USERS_ROUTE}/signin`,
  signout: `${USERS_ROUTE}/signout`,
  follow: `${USERS_ROUTE}/follow`,
};
