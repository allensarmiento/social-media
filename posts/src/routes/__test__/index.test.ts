import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';
import { signinFollowing } from '../../test/signinFollowing';

// TODO: Should modify the global sign in function instead of repeating same code

const createPost = (userCookie: string[]) => {
  return request(app)
    .post(Routes.posts)
    .set('Cookie', userCookie)
    .send({ content: 'New post' });
};

it(
  `has a route handler listening to ${Routes.posts} for get requests`,
  async () => {
    const response = await request(app).get(Routes.posts);

    expect(response.status).not.toEqual(404);
  },
);

it('can only be accessid if the user is signed in', async () => {
  await request(app).get(Routes.posts).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .get(Routes.posts)
    .set('Cookie', global.signin());
  
  expect(response.status).not.toEqual(401);
});

it('can fetch a list of posts for the current user', async () => {
  const userCookie = global.signin();

  await createPost(userCookie);
  await createPost(userCookie);
  await createPost(userCookie);

  const response = await request(app)
    .get(Routes.posts)
    .set('Cookie', userCookie)
    .expect(200);

  expect(response.body.length).toEqual(3);
});

it(
  'can fetch a list of posts that the user is following along with themself',
  async () => {
    const userCookie = await signinFollowing();

    await createPost(userCookie);
    await createPost(userCookie);
    await createPost(userCookie);

    const response = await request(app)
      .get(Routes.posts)
      .set('Cookie', userCookie)
      .expect(200);

    expect(response.body.length).toEqual(4);
  },
);
