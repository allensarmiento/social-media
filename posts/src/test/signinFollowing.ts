import jwt from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../app';
import { Routes } from '../common';
import { generateId } from '../utilities/generate-id';

interface Following {
  userId: string;
}

interface Payload {
  id: string;
  email: string;
  following: Following[];
};

const signin = (jwtPayload: Payload): string[] => {
  const token = jwt.sign(jwtPayload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`express:sess=${base64}`];
};

export const signinFollowing = async () => {
  const userOnePayload = {
    id: generateId(),
    email: 'test1@test.com',
    following: [],
  };
  
  await request(app)
    .post(Routes.posts)
    .send({ content: 'New post' })
    .set('Cookie', signin(userOnePayload))
    .expect(201);

  const userTwoPayload = {
    id: generateId(),
    email: 'test2@test.com',
    following: [
      { userId: userOnePayload.id },
    ],
  };

  return signin(userTwoPayload);
};
