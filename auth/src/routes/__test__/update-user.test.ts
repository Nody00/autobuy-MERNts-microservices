import request from "supertest";
import { app } from "../../app";
import { User } from "../../models/user";

jest.mock("../../service/RabbitMQService", () => ({
  rabbit: {
    sendMessage: jest.fn((exchange: string, topic: string, data) => {}),
    connect: jest.fn(),
    initializePublisher: jest.fn(),
  },
}));

jest.mock("../../middleware/auth.ts", () => ({
  authMiddleware: jest.fn((res, req, next) => {
    req.user = {
      // this can be fillled in to suite implementation
      userId: "sadadsasd",
      userName: "test",
    };

    next();
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

  return user.toObject();
};

describe("Update user", () => {
  it("returns 400 when invalid id is sent", async () => {
    const data = {
      email: "test@email.com",
    };

    const result = await request(app)
      .patch("/auth/users/aaaaaaaaaaaa")
      .send(data);

    expect(result.status).toBe(400);
  });

  it("returns 400 when invalid data is sent", async () => {
    const createdUser = await createUser();

    const data = {
      email: "d3123123123123",
    };

    const result = await request(app)
      .patch(`/auth/users/${createdUser._id}`)
      .send(data);

    expect(result.status).toBe(400);
  });

  it("updates email and sets emailVerified to false if valid email is provided", async () => {
    const createdUser = await createUser();

    const data = {
      email: "test@test.com",
    };

    const result = await request(app)
      .patch(`/auth/users/${createdUser._id}`)
      .send(data);

    const foundUser = await User.findById(createdUser._id);
    expect(foundUser?.email).toBe(data.email);
    expect(foundUser?.emailVerified).toBe(false);
    expect(result.status).toBe(200);
  });

  it("updates firstName if valid data is provided", async () => {
    const createdUser = await createUser();

    const data = {
      firstName: "John",
    };

    const result = await request(app)
      .patch(`/auth/users/${createdUser._id}`)
      .send(data);

    const foundUser = await User.findById(createdUser._id);
    expect(foundUser?.firstName).toBe(data.firstName);
    expect(result.status).toBe(200);
  });

  it("updates lastName if valid data is provided", async () => {
    const createdUser = await createUser();

    const data = {
      lastName: "Wick",
    };

    const result = await request(app)
      .patch(`/auth/users/${createdUser._id}`)
      .send(data);

    const foundUser = await User.findById(createdUser._id);
    expect(foundUser?.lastName).toBe(data.lastName);
    expect(result.status).toBe(200);
  });

  it("updates the phone number and sets phoneVerified to false if valid phone is provided", async () => {
    const createdUser = await createUser();

    const data = {
      phoneNumber: "+1-418-543-8090",
    };

    const result = await request(app)
      .patch(`/auth/users/${createdUser._id}`)
      .send(data);

    const foundUser = await User.findById(createdUser._id);
    expect(foundUser?.phoneNumber).toBe(data.phoneNumber);
    expect(foundUser?.phoneVerified).toBe(false);
    expect(result.status).toBe(200);
  });

  it("updates the recoveryPhoneNumber if valid data is provided", async () => {
    const createdUser = await createUser();

    const data = {
      recoveryPhoneNumber: "+1-418-543-8090",
    };

    const result = await request(app)
      .patch(`/auth/users/${createdUser._id}`)
      .send(data);

    const foundUser = await User.findById(createdUser._id);
    expect(foundUser?.recoveryPhoneNumber).toBe(data.recoveryPhoneNumber);

    expect(result.status).toBe(200);
  });
});
