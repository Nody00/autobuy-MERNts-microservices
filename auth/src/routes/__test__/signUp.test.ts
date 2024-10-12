import request from "supertest";
import { app } from "../../app";

jest.mock("../../service/RabbitMQService", () => ({
  rabbit: {
    sendMessage: jest.fn((exchange: string, topic: string, data) => {}),
  },
}));

describe("User Signup", () => {
  // Mock the User model methods
  it("returns a 201 on successful signup", async () => {
    const response = await request(app).post("/auth/users/sign-up").send({
      email: "testuser3@example.com",
      password: "TestPassword123",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "0952230241",
    });

    expect(response.status).toBe(201);
  });

  //   write more tests, finish signup and write tests for that
});
