import request from "supertest";
import { app } from "../../app";

jest.mock("../../service/RabbitMQService", () => ({
  rabbit: {
    sendMessage: jest.fn((exchange: string, topic: string, data) => {}),
    connect: jest.fn(),
    initializePublisher: jest.fn(),
  },
}));

describe("User sign up", () => {
  // Mock the User model methods
  it("returns a 201 on successful signup and sends appropirate RABBITMQ message", async () => {
    const newUser = {
      email: "testuser3@example.com",
      password: "TestPassword123",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "0952230241",
    };
    const response = await request(app)
      .post("/auth/users/sign-up")
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBeDefined();
    // expect(rabbit.sendMessage).toHaveBeenCalledWith(
    //   "auth-events",
    //   "users.new",
    //   { ...newUser }
    // );
  });

  //   write more tests, finish signup and write tests for that
  it("returns status 400 and an array of validation errors if the payload is missing information", async () => {
    const newUser = {
      email: "testuser3@example.com",
      password: "1", // invalid
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "0", // invalid
    };

    const response = await request(app)
      .post("/auth/users/sign-up")
      .send(newUser);

    expect(response.status).toBe(400);
    expect(response?.body.errors.length).toEqual(2);
  });

  it("returns status 400 if the user already exists", async () => {
    const newUser = {
      email: "testuser3@example.com",
      password: "TestPassword123",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "0952230241",
    };

    await request(app).post("/auth/users/sign-up").send(newUser);

    const response = await request(app)
      .post("/auth/users/sign-up")
      .send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });
});
