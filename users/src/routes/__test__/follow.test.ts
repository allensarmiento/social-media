import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';
import { User } from '../../models/user';

it(
  `has a route handler listening on ${Routes.follow}/:userId for get requests`,
  async () => {
    const response = await request(app)
      .get(`${Routes.follow}/1234`);
    
    expect(response.status).not.toEqual(404);
  },
);

it('returns a 400 if the user tries to follow themself', async () => {
  const user = await global.signup();
  const userCookie = await global.login();

  await request(app)
    .get(`${Routes.follow}/${user.id}`)
    .set('Cookie', userCookie)
    .expect(400);
});
