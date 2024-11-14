import request from "supertest";
import { app } from "../../app";
import { Listing } from "../../models/Listing";
import { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import { Bid } from "../../models/Bid";

const FAKE_USER_ID = new mongoose.Types.ObjectId();
const createListing = async ({ validBidingTime = true }) => {
  const fakeListing = {
    manufacturer: "BMW",
    model: "M3",
    yearOfProduction: 2020,
    mileage: 15000,
    firstYearOfRegistration: 2024,
    description: "A well-maintained car with low mileage.",
    price: 20000,
    category: 1,
    status: "available",
    views: 0,
    savedBy: [],
    tags: [],
    userId: "6735ea66e047e7d4b4c364f9",
    deleted: false,
    version: 1,
    endBiddingAt: validBidingTime
      ? "2025-12-12T00:00:00.000Z"
      : "2022-12-12T00:00:00.000Z",
    images: [
      {
        url: "https://res.cloudinary.com/dhtxtap6t/image/upload/v1731586672/vehicle-listings/zyx7nfsm5ubddzx3mmmx.jpg",
        publicId: "vehicle-listings/zyx7nfsm5ubddzx3mmmx",
        _id: "6735ea715ec079f17602ba99",
      },
    ],
    __v: 0,
  };

  const newListing = new Listing(fakeListing);
  await newListing.save();
  return newListing.toObject();
};

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

describe("Create bid tests", () => {
  it("returns 400 status if invalid data is sent", async () => {
    const payload1 = {
      listingId: "aaaaaaaaa",
      amount: 100,
    };

    const payload2 = {
      listingId: new mongoose.Types.ObjectId(),
      amount: "aaaaaaaaaa",
    };

    const result1 = await request(app).post("/bids/new").send(payload1);
    const result2 = await request(app).post("/bids/new").send(payload2);

    expect(result1.status).toBe(400);
    expect(result2.status).toBe(400);
  });

  it("returns 404 status if listing does not exist", async () => {
    const payload = {
      listingId: new mongoose.Types.ObjectId(),
      amount: 100,
    };

    const result = await request(app).post("/bids/new").send(payload);

    expect(result.status).toBe(404);
  });

  it("returns 400 status if the bidding time has ended", async () => {
    const listing = await createListing({ validBidingTime: false });

    const payload = {
      listingId: listing._id,
      amount: 100,
    };

    const result = await request(app).post("/bids/new").send(payload);
    expect(result.status).toBe(400);
  });

  it("returns 400 status if the bid is smaller or equal to the highest bid", async () => {
    const listing = await createListing({ validBidingTime: true });

    const payload = {
      listingId: listing._id,
      amount: 100,
    };

    await request(app).post("/bids/new").send(payload);

    const payloadInvalidAmount = {
      listingId: listing._id,
      amount: 50,
    };

    const result = await request(app)
      .post("/bids/new")
      .send(payloadInvalidAmount);

    expect(result.status).toBe(400);
  });

  it("returns 200 status, creates new bid and updates listing if valid data has been sent", async () => {
    const listing = await createListing({ validBidingTime: true });

    const payload = {
      listingId: listing._id,
      amount: 100,
    };

    await request(app).post("/bids/new").send(payload);

    const foundBid = await Bid.findOne({
      userId: FAKE_USER_ID,
      listingId: listing._id,
      amount: 100,
    });

    const foundListing = await Listing.findById(listing._id);

    expect(foundBid!.amount).toBe(100);

    expect(foundListing?.highestBid).toEqual(foundBid?._id);
  });
});
