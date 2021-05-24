import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';
import { Post } from '../../models/post';

it(
  `has a route handler listening to ${Routes.posts} for post requests`,
  async() => {
    const response = await request(app)
      .post(Routes.posts)
      .send({});

    expect(response.status).not.toEqual(404);
  },
);

it('can only be accessed if the user is signed in', async () => {
  await request(app).post(Routes.posts).send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post(Routes.posts)
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if invalid content is empty', async () => {
  await request(app)
    .post(Routes.posts)
    .set('Cookie', global.signin())
    .send({})
    .expect(400);
});

it('creates a post with valid content and user is signed in', async () => {
  let posts = await Post.find({});
  expect(posts.length).toEqual(0);

  const content = 'Hello!';

  await request(app)
    .post(Routes.posts)
    .set('Cookie', global.signin())
    .send({ content })
    .expect(201);

  posts = await Post.find({});
  expect(posts.length).toEqual(1);
  expect(posts[0].content).toEqual(content);
});
