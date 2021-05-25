import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { generateId } from '../utilities/generate-id';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[]
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

global.signin = () => {
  const jwtPayload = {
    id: generateId(),
    email: 'test@test.com',
    following: [],
  };

  const token = jwt.sign(jwtPayload, process.env.JWT_KEY!);
  
  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  // Encode the sessionJSON as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string that contains the cookie with the encoded data
  return [`express:sess=${base64}`];
};
