import request from "supertest";
import { app } from "../../app";
import { Listing } from "../../models/listing";
import { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";

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

describe("Listing creation", () => {
  it("returns a 400 error if wrong input data is provided", async () => {
    const newListing = {
      userId: "507f1f77bcf86cd799439011", // Valid MongoDB ObjectId format
      manufacturer: 99999,
      model: "Camry",
      yearOfProduction: 2020,
      mileage: 50000,
      firstYearOfRegistration: 2020,
      description:
        "Well maintained vehicle with full service history. Features include air conditioning, power windows, and a premium sound system.",
      price: 25000,
      category: 1,
    };

    const result = await request(app)
      .post("/listings/new-listing")
      .send(newListing);

    expect(result.status).toBe(400);
  });

  it("returns a 201 status if successful and creates a listing", async () => {
    const newListing = {
      manufacturer: "Toyota",
      model: "Camry",
      yearOfProduction: 2020,
      mileage: 50000,
      firstYearOfRegistration: 2020,
      description:
        "Well maintained vehicle with full service history. Features include air conditioning, power windows, and a premium sound system.",
      price: 25000,
      category: 1,
    };

    const response = await request(app)
      .post("/listings/new-listing")
      .send(newListing);

    const createdListing = await Listing.findOne({
      userId: FAKE_USER_ID.toString(),
    });

    expect(response.status).toBe(201);
    expect(createdListing!._id).toBeDefined();
  });
});
