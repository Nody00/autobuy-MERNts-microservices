import request from "supertest";
import { app } from "../../app";
import { Listing } from "../../models/listing";
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

const createListing = async () => {
  const newListing = {
    userId: "507f1f77bcf86cd799439011", // Valid MongoDB ObjectId format
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
  const createdListing = new Listing(newListing);
  const res = await createdListing.save();
  return res;
};

describe("Listing deletion", () => {
  it("returns a 400 status if a invalid id is provided", async () => {
    const invalidId = "99941924912491294129adadadaxxxxxxxxxxxx!@#!@#!@!";
    const result = await request(app).delete(
      `/listings/delete-listing/${invalidId}`
    );

    expect(result.status).toBe(400);
  });

  it("returns a 404 status if no listing is found for the provided it", async () => {
    const newObjectId = new mongoose.Types.ObjectId();

    const result = await request(app).delete(
      `/listings/delete-listing/${newObjectId}`
    );

    expect(result.status).toBe(404);
  });

  it("returns a 200 status if listing is successfuly marked as deleted", async () => {
    const createdListing = await createListing();

    const result = await request(app).delete(
      `/listings/delete-listing/${createdListing._id}`
    );

    const fetchedListing = await Listing.findById(createdListing._id);

    expect(result.status).toBe(200);
    expect(fetchedListing?.deleted).toBe(true);
  });
});
