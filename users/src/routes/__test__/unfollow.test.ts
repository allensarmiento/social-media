import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';

it(
  `has a route handler listening on ${Routes.unfollow}/:userId for get requests`,
  async () => {
    const response = await request(app)
      .get(`${Routes.unfollow}/1234`);
    
    expect(response.status).not.toEqual(404);
  },
);

it('returns a 400 if the user tries to unfollow themself', async () => {
  const user = await global.signup('test@test.com', 'password');
  const userCookie = await global.signin('test@test.com', 'password');

  await request(app)
    .get(`${Routes.unfollow}/${user.id}`)
    .set('Cookie', userCookie)
    .expect(400);
});

it('returns a 200 if the user is able to unfollow another user', async () => {
  const userOne = await global.signup('test1@test.com', 'password');
  await global.signup('test2@test.com', 'password');
  const userTwoCookie = await global.signin('test2@test.com', 'password');

  await request(app)
    .get(`${Routes.follow}/${userOne.id}`)
    .set('Cookie', userTwoCookie)
    .expect(200);

  const response = await request(app)
    .get(`${Routes.unfollow}/${userOne.id}`)
    .set('Cookie', userTwoCookie)
    .expect(200);

  expect(response.body.following.length).toEqual(0);
});
