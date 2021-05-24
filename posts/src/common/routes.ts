const API_ROUTE = '/api';

const USERS_ROUTE = `${API_ROUTE}/users`;
const POSTS_ROUTE = `${API_ROUTE}/posts`;

export const Routes = {
  currentUser: `${USERS_ROUTE}/currentuser`,
  signup: `${USERS_ROUTE}/signup`,
  signin: `${USERS_ROUTE}/signin`,
  signout: `${USERS_ROUTE}/signout`,
  follow: `${USERS_ROUTE}/follow`,
  unfollow: `${USERS_ROUTE}/unfollow`,

  posts: POSTS_ROUTE,
};
