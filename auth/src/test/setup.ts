import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

let mongo: any;

beforeAll(async () => {
  process.env.COOKIE_SESSION_KEY = "test_cookie_session_key";
  process.env.JWT_SECRET = "test_jwt_secret";
  process.env.REFRESH_JWT_SECRET = "test_refresh_jwt_secret";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db?.collections();

  if (!collections) return;

  for (let collection of collections) {
    await collection.deleteMany();
  }
});

afterAll(async () => {
  delete process.env.COOKIE_SESSION_KEY;
  delete process.env.JWT_SECRET;

  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});
