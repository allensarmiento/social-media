import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from './common';
import { currentUserRouter } from './routes/current-user';
import { followRouter } from './routes/follow';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { unFollowRouter } from './routes/unfollow';

const app = express();
app.set('trust proxy',true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);
app.use(currentUser);

app.use(currentUserRouter);
app.use(followRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(unFollowRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
