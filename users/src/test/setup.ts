import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { Routes } from '../common';
import { UserDoc } from '../models/user';

declare global {
  namespace NodeJS {
    interface Global {
      signin(email: string, password: string): Promise<string[]>
      signup(email: string, password: string): Promise<UserDoc>
      signupAndLogin(): Promise<string[]>
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'aouehtns';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async (email: string, password: string) => {
  const response = await request(app)
    .post(Routes.signin)
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};

global.signup = async (
  userEmail?: string,
  userPassword?: string,
): Promise<UserDoc> => {
  const email = userEmail || 'test@test.com';
  const password = userPassword || 'password';

  const response = await request(app)
    .post(Routes.signup)
    .send({ email, password })
    .expect(201);

  return response.body;
};

global.signupAndLogin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post(Routes.signup)
    .send({ email, password });

  expect(response.status).toEqual(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
