import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Listing } from "../../models/listing";

// move mocks to setup file

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

describe("Saving listing", () => {
  it("returns a 400 status if invalid id is provided in the params", async () => {
    const response = await request(app).post("/listings/save/adawd3123123");

    expect(response.status).toBe(400);
  });

  it("returns a 404 status if the listing does not exist", async () => {
    const fakeListingId = new mongoose.Types.ObjectId();
    const response = await request(app).post(`/listings/save/${fakeListingId}`);

    //   console.log("dinov log response", response);
    expect(response.status).toBe(404);
  });

  it("adds user to savedBy array if he is not there", async () => {
    // create a new listing
    const newListing = {
      userId: FAKE_USER_ID.toString(), // Valid MongoDB ObjectId format
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
    const createdListing = response.body.data;

    // send a request to save the listing
    await request(app).post(`/listings/save/${createdListing._id}`);

    // fetch the listing
    const fetchedListing = await Listing.findById(createdListing._id);

    // check if the users id is in the savedBy array
    let includedInArr = false;

    fetchedListing?.savedBy.forEach((el) => {
      if (el.toString() === newListing.userId) {
        includedInArr = true;
      }
    });

    expect(includedInArr).toBe(true);
  });

  it("removes user from savedBy array if he was already there", async () => {
    // create a new listing
    const newListing = {
      userId: FAKE_USER_ID.toString(), // Valid MongoDB ObjectId format
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
    const createdListing = response.body.data;

    // send a request to save the listing
    await request(app).post(`/listings/save/${createdListing._id}`);
    await request(app).post(`/listings/save/${createdListing._id}`);

    // fetch the listing
    const fetchedListing = await Listing.findById(createdListing._id);

    // check if the users id is in the savedBy array
    let includedInArr = false;

    fetchedListing?.savedBy.forEach((el) => {
      if (el.toString() === newListing.userId) {
        includedInArr = true;
      }
    });

    expect(includedInArr).toBe(false);
  });
});
