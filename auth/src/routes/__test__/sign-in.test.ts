import request from "supertest";
import { app } from "../../app";

const signUpHelper = async () => {
  const newUser = {
    email: "testuser3@example.com",
    password: "TestPassword123",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "0952230241",
  };
  const response = await request(app).post("/auth/users/sign-up").send(newUser);
};

jest.mock("../../service/RabbitMQService", () => ({
  rabbit: {
    sendMessage: jest.fn((exchange: string, topic: string, data) => {}),
    connect: jest.fn(),
    initializePublisher: jest.fn(),
  },
}));

describe("User sign in", () => {
  it("returns status 200 on successful login", async () => {
    await signUpHelper();

    const response = await request(app).post("/auth/users/sign-in").send({
      email: "testuser3@example.com",
      password: "TestPassword123",
    });

    expect(response.status).toBe(200);
    expect(response.body.user._id).toBeDefined();
    expect(response.body.message).toBeDefined();
  });

  it("returns status 400 and an array of validation errors if the payload is missing information", async () => {
    await signUpHelper();

    const response = await request(app).post("/auth/users/sign-in").send({
      email: "tesexample.com",
      password: "1",
    });

    expect(response.status).toBe(400);
    expect(response?.body.errors.length).toEqual(2);
  });

  it("returns status 400 if invalid email", async () => {
    await signUpHelper();

    const response = await request(app).post("/auth/users/sign-in").send({
      email: "testuser3@example.comINVALID",
      password: "TestPassword123",
    });

    expect(response.status).toBe(400);
  });

  it("returns status 400 if invalid password", async () => {
    await signUpHelper();

    const response = await request(app).post("/auth/users/sign-in").send({
      email: "testuser3@example.com",
      password: "TestPassword123INVALID",
    });

    expect(response.status).toBe(400);
  });
});
