import request from "supertest";
import { User } from "../../models/user";
import { app } from "../../app";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

const FAKE_USER_ID = new mongoose.Types.ObjectId();

jest.mock("../../service/RabbitMQService", () => ({
  rabbit: {
    sendMessage: jest.fn((exchange: string, topic: string, data) => {}),
    connect: jest.fn(),
    initializePublisher: jest.fn(),
  },
}));

jest.mock("../../middleware/auth.ts", () => ({
  authMiddleware: jest.fn((req, res, next) => {
    req.user = {
      // this can be fillled in to suite implementation
      id: FAKE_USER_ID,
      userName: "test",
    };

    next();
  }),
}));

jest.mock("../../middleware/permissionMiddleware.ts", () => ({
  permissionMiddleware: jest.fn((action: string, resource: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      // the permission middleware should be tested independently
      next();
    };
  }),
}));

const createUser = async () => {
  const newUser = {
    email: "testuser3@example.com",
    password: "TestPassword123",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "0952230241",
  };
  const user = new User(newUser);
  await user.save();

  return user;
};

describe("Delete user", () => {
  it("returns a 400 status if a invalid id is provided", async () => {
    const createdUser = await createUser();

    const result = await request(app).delete(`/auth/users/aaaaaaa`);

    expect(result.status).toBe(400);
  });
  it("soft deletes a user if a valid id is provided", async () => {
    const createdUser = await createUser();

    const result = await request(app).delete(`/auth/users/${createdUser._id}`);

    const foundUser = await User.findById(createdUser._id);

    expect(foundUser?.deleted).toBe(true);
    expect(result.status).toBe(200);
  });
});
