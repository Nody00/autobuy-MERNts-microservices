import request from "supertest";
import { User } from "../../models/user";
import { app } from "../../app";

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
